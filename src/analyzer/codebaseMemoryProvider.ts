import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as path from 'node:path';
import { GraphNode, GraphEdge, KnowledgeGraph, GraphProvider } from '../types/index.js';

export class CodebaseMemoryProvider implements GraphProvider {
  private command: string;

  constructor(command = 'codebase-memory-mcp') {
    this.command = command;
  }

  private async createClient(): Promise<{ client: Client; transport: StdioClientTransport }> {
    const transport = new StdioClientTransport({
      command: this.command,
      args: [],
    });

    const client = new Client(
      { name: 'okf-client', version: '0.1.0' },
      { capabilities: {} }
    );

    await client.connect(transport);
    return { client, transport };
  }

  async indexRepository(repoPath: string): Promise<void> {
    const absPath = path.resolve(repoPath);
    console.log(`[CodebaseMemoryProvider] Triggering repo indexing for: ${absPath}...`);

    const { client, transport } = await this.createClient();
    try {
      const response = await client.callTool({
        name: 'index_repository',
        arguments: { path: absPath },
      });
      console.log(`[CodebaseMemoryProvider] Indexing response:`, JSON.stringify(response.content, null, 2));
    } finally {
      await transport.close();
    }
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    const absPath = path.resolve(repoPath);
    const { client, transport } = await this.createClient();

    try {
      // Step 1: Find indexed project name
      const projectsRes = (await client.callTool({
        name: 'list_projects',
        arguments: {},
      })) as { content: Array<{ type: string; text: string }> };

      let projectName = '';
      if (projectsRes.content && projectsRes.content[0]?.text) {
        const parsed = JSON.parse(projectsRes.content[0].text);
        const projects = parsed.projects || [];
        const match = projects.find(
          (p: { root_path?: string; git?: { canonical_root?: string } }) =>
            p.root_path === absPath || p.git?.canonical_root === absPath
        );
        if (match) {
          projectName = match.name;
        } else if (projects.length > 0) {
          // Fallback to first project if exact path match is close
          projectName = projects[0].name;
        }
      }

      if (!projectName) {
        throw new Error(`Project not found in Codebase Memory index for path: ${absPath}. Run 'okf init ${repoPath}' first.`);
      }

      console.log(`[CodebaseMemoryProvider] Reading Knowledge Graph for project: ${projectName}...`);

      // Step 2: Query Graph Nodes
      const nodesResult = (await client.callTool({
        name: 'query_graph',
        arguments: {
          project: projectName,
          query: `MATCH (n) WHERE n.file_path IS NOT NULL RETURN id(n) as id, n.name as name, labels(n)[0] as type, n.file_path as filePath LIMIT 500`,
        },
      })) as { content: Array<{ type: string; text: string }> };

      const nodes: GraphNode[] = [];
      if (nodesResult.content && nodesResult.content[0]?.text) {
        const data = JSON.parse(nodesResult.content[0].text);
        if (Array.isArray(data.rows)) {
          for (const row of data.rows) {
            nodes.push({
              id: String(row[0] || row[1]),
              name: String(row[1] || 'anonymous'),
              type: String(row[2] || 'Node'),
              filePath: String(row[3] || ''),
            });
          }
        }
      }

      // Step 3: Query Graph Edges
      const edgesResult = (await client.callTool({
        name: 'query_graph',
        arguments: {
          project: projectName,
          query: `MATCH (n)-[r]->(m) WHERE n.file_path IS NOT NULL AND m.file_path IS NOT NULL RETURN id(n) as source, id(m) as target, type(r) as relationship LIMIT 1000`,
        },
      })) as { content: Array<{ type: string; text: string }> };

      const edges: GraphEdge[] = [];
      if (edgesResult.content && edgesResult.content[0]?.text) {
        const data = JSON.parse(edgesResult.content[0].text);
        if (Array.isArray(data.rows)) {
          for (const row of data.rows) {
            edges.push({
              source: String(row[0]),
              target: String(row[1]),
              relationship: String(row[2] || 'REL'),
            });
          }
        }
      }

      console.log(`[CodebaseMemoryProvider] Loaded ${nodes.length} nodes and ${edges.length} edges.`);
      return { nodes, edges };
    } finally {
      await transport.close();
    }
  }
}
