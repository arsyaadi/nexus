import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import { GraphEdge, GraphNode, GraphProvider, KnowledgeGraph } from '../types/index.js';
import { LocalGraphProvider } from './localGraphProvider.js';

export class KuzuGraphProvider implements GraphProvider {
  private fallbackProvider = new LocalGraphProvider();

  private getGlobalNexusDir(): string {
    return path.join(os.homedir(), '.nexus');
  }

  private getGraphsDir(): string {
    return path.join(this.getGlobalNexusDir(), 'graphs');
  }

  private getProjectsRegistryPath(): string {
    return path.join(this.getGlobalNexusDir(), 'projects.json');
  }

  private getProjectKey(repoPath: string): { absRoot: string; projectName: string; hash: string; dbPath: string; dbName: string } {
    const absRoot = path.resolve(repoPath);
    const hash = crypto.createHash('sha256').update(absRoot).digest('hex').slice(0, 12);
    const rawName = path.basename(absRoot) || 'root';
    const projectName = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const dbName = `${projectName}_${hash}.kuzu`;
    const dbPath = path.join(this.getGraphsDir(), dbName);
    return { absRoot, projectName, hash, dbPath, dbName };
  }

  async indexRepository(repoPath: string): Promise<void> {
    const { absRoot, projectName, hash, dbPath, dbName } = this.getProjectKey(repoPath);
    await fs.mkdir(this.getGraphsDir(), { recursive: true });

    let kuzuModule: any;
    try {
      kuzuModule = await import('kuzu');
    } catch (err) {
      console.error('[Nexus KuzuGraphProvider] Warning: Could not load native kuzu module, using LocalGraphProvider fallback:', err);
      return this.fallbackProvider.indexRepository(repoPath);
    }

    const { Database, Connection } = kuzuModule;

    // Build KnowledgeGraph AST using built-in parser
    const astGraph = await this.fallbackProvider.getKnowledgeGraph(repoPath);

    // Initialize Kuzu Database
    const db = new Database(dbPath);
    const conn = new Connection(db);

    try {
      // Create Schema
      await conn.query(`CREATE NODE TABLE IF NOT EXISTS Node(id STRING, name STRING, type STRING, filePath STRING, PRIMARY KEY (id));`);
      await conn.query(`CREATE REL TABLE IF NOT EXISTS EDGE(FROM Node TO Node, relationship STRING);`);

      // Populate Nodes
      for (const node of astGraph.nodes) {
        const escapedId = this.escapeString(node.id);
        const escapedName = this.escapeString(node.name);
        const escapedType = this.escapeString(node.type);
        const escapedFilePath = this.escapeString(node.filePath || '');

        await conn.query(
          `MERGE (n:Node {id: '${escapedId}'}) ON CREATE SET n.name = '${escapedName}', n.type = '${escapedType}', n.filePath = '${escapedFilePath}'`
        );
      }

      // Populate Edges
      for (const edge of astGraph.edges) {
        const escapedSource = this.escapeString(edge.source);
        const escapedTarget = this.escapeString(edge.target);
        const escapedRel = this.escapeString(edge.relationship);

        // Ensure target node exists in KuzuDB
        await conn.query(
          `MERGE (b:Node {id: '${escapedTarget}'}) ON CREATE SET b.name = '${escapedTarget}', b.type = 'External', b.filePath = ''`
        );

        await conn.query(
          `MATCH (a:Node {id: '${escapedSource}'}), (b:Node {id: '${escapedTarget}'}) MERGE (a)-[r:EDGE {relationship: '${escapedRel}'}]->(b)`
        );
      }
    } finally {
      await conn.close();
      await db.close();
    }

    // Update global project registry with Kuzu engine details
    await this.updateProjectsRegistry({
      repoPath: absRoot,
      projectName,
      hash,
      graphFile: dbName,
      nodeCount: astGraph.nodes.length,
      edgeCount: astGraph.edges.length,
      lastIndexedAt: new Date().toISOString(),
      engine: 'kuzu',
    });
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    const { dbPath } = this.getProjectKey(repoPath);

    let kuzuModule: any;
    try {
      kuzuModule = await import('kuzu');
    } catch {
      return this.fallbackProvider.getKnowledgeGraph(repoPath);
    }

    try {
      await fs.access(dbPath);
    } catch {
      await this.indexRepository(repoPath);
    }

    const { Database, Connection } = kuzuModule;
    let db: any;
    let conn: any;

    try {
      db = new Database(dbPath);
      conn = new Connection(db);
    } catch {
      return this.fallbackProvider.getKnowledgeGraph(repoPath);
    }

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    try {
      const nodeQueryResult = await conn.query(`MATCH (n:Node) RETURN n.id, n.name, n.type, n.filePath`);
      const nodeRows = await nodeQueryResult.getAll();
      for (const row of nodeRows) {
        nodes.push({
          id: String(row[0]),
          name: String(row[1]),
          type: String(row[2]) as any,
          filePath: String(row[3]),
        });
      }

      const edgeQueryResult = await conn.query(`MATCH (a:Node)-[r:EDGE]->(b:Node) RETURN a.id, b.id, r.relationship`);
      const edgeRows = await edgeQueryResult.getAll();
      for (const row of edgeRows) {
        edges.push({
          source: String(row[0]),
          target: String(row[1]),
          relationship: String(row[2]) as any,
        });
      }
    } catch {
      return this.fallbackProvider.getKnowledgeGraph(repoPath);
    } finally {
      try {
        await conn?.close();
        await db?.close();
      } catch {
        // Ignore cleanup error
      }
    }

    return { nodes, edges };
  }

  private escapeString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  private async updateProjectsRegistry(entry: any): Promise<void> {
    const registryPath = this.getProjectsRegistryPath();
    let projects: any[] = [];

    try {
      const content = await fs.readFile(registryPath, 'utf-8');
      projects = JSON.parse(content);
      if (!Array.isArray(projects)) {
        projects = [];
      }
    } catch {
      projects = [];
    }

    const idx = projects.findIndex((p) => p.repoPath === entry.repoPath);
    if (idx !== -1) {
      projects[idx] = entry;
    } else {
      projects.push(entry);
    }

    await fs.writeFile(registryPath, JSON.stringify(projects, null, 2), 'utf-8');
  }
}
