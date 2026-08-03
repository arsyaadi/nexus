#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { CodebaseMemoryProvider, MockGraphProvider } from '../analyzer/index.js';
import { ModulePlanner } from '../planner/index.js';
import { FileSystemOKFWriter } from '../storage/index.js';
import { GraphProvider, OKFMetadata } from '../types/index.js';

const server = new Server(
  {
    name: 'okf-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const writer = new FileSystemOKFWriter();
const planner = new ModulePlanner();

// List available OKF tools for AI Hosts (Claude Code, Antigravity, Cursor)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'okf_plan',
        description:
          'Analyze target repository Knowledge Graph and generate Execution Plan containing capability modules, priority, complexity, dependencies, and related files.',
        inputSchema: {
          type: 'object',
          properties: {
            repo_path: {
              type: 'string',
              description: 'Absolute or relative path to the target repository',
            },
            mock: {
              type: 'boolean',
              description: 'Set to true to use mock graph for testing/offline mode',
            },
          },
          required: ['repo_path'],
        },
      },
      {
        name: 'okf_get_module_context',
        description:
          'Retrieve file paths and source code content for a specific capability module task to minimize LLM context window.',
        inputSchema: {
          type: 'object',
          properties: {
            repo_path: {
              type: 'string',
              description: 'Path to target repository',
            },
            module_name: {
              type: 'string',
              description: 'Name of the capability module',
            },
            related_files: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of related file paths from Execution Plan',
            },
          },
          required: ['repo_path', 'module_name', 'related_files'],
        },
      },
      {
        name: 'okf_save_module_doc',
        description:
          'Save technical documentation and draft business flow for a single module into .okf package structure.',
        inputSchema: {
          type: 'object',
          properties: {
            repo_path: {
              type: 'string',
              description: 'Path to target repository',
            },
            module_name: {
              type: 'string',
              description: 'Name of the capability module',
            },
            technical_content: {
              type: 'string',
              description: 'Factual technical documentation in Markdown format',
            },
            business_content: {
              type: 'string',
              description: 'Inferred business flow in Markdown format (marked DRAFT)',
            },
          },
          required: ['repo_path', 'module_name', 'technical_content', 'business_content'],
        },
      },
      {
        name: 'okf_finalize',
        description:
          'Finalize .okf package generation and write .okf/metadata.json.',
        inputSchema: {
          type: 'object',
          properties: {
            repo_path: {
              type: 'string',
              description: 'Path to target repository',
            },
            modules: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of completed capability module names',
            },
          },
          required: ['repo_path', 'modules'],
        },
      },
    ],
  };
});

// Handle Tool Call Requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'okf_plan') {
      const repoPath = String(args?.repo_path || '.');
      const isMock = Boolean(args?.mock);

      const provider: GraphProvider = isMock
        ? new MockGraphProvider()
        : new CodebaseMemoryProvider();

      const graph = await provider.getKnowledgeGraph(repoPath);
      const plan = await planner.createPlan(graph, repoPath);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(plan, null, 2),
          },
        ],
      };
    }

    if (name === 'okf_get_module_context') {
      const repoPath = String(args?.repo_path || '.');
      const moduleName = String(args?.module_name || '');
      const relatedFiles = (args?.related_files as string[]) || [];

      const fileSnippets: Array<{ filePath: string; content: string }> = [];

      for (const relFile of relatedFiles) {
        const fullPath = path.isAbsolute(relFile) ? relFile : path.join(repoPath, relFile);
        try {
          const content = await fs.readFile(fullPath, 'utf-8');
          // Limit individual file size preview if large
          const truncatedContent = content.length > 8000 ? content.slice(0, 8000) + '\n...[truncated]' : content;
          fileSnippets.push({ filePath: relFile, content: truncatedContent });
        } catch {
          fileSnippets.push({ filePath: relFile, content: 'File could not be read or does not exist.' });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                moduleName,
                fileCount: fileSnippets.length,
                files: fileSnippets,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'okf_save_module_doc') {
      const repoPath = String(args?.repo_path || '.');
      const moduleName = String(args?.module_name || '');
      const technicalContent = String(args?.technical_content || '');
      const businessContent = String(args?.business_content || '');

      await writer.initializePackage(repoPath);
      await writer.writeModuleDoc(repoPath, {
        moduleName,
        technicalContent,
        businessContent,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              message: `Module [${moduleName}] documentation saved into .okf/ directory.`,
              savedFiles: [
                `.okf/technical/${moduleName.toLowerCase()}.md`,
                `.okf/business/${moduleName.toLowerCase()}.md`,
              ],
            }),
          },
        ],
      };
    }

    if (name === 'okf_finalize') {
      const repoPath = String(args?.repo_path || '.');
      const modules = (args?.modules as string[]) || [];

      const metadata: OKFMetadata = {
        version: '0.1.0',
        generatedAt: new Date().toISOString(),
        repoPath,
        modules,
      };

      await writer.initializePackage(repoPath);
      await writer.writeMetadata(repoPath, metadata);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              message: `.okf package finalized successfully.`,
              metadataFile: path.join(repoPath, '.okf', 'metadata.json'),
              metadata,
            }),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `OKF MCP Error: ${errorMsg}`,
        },
      ],
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('OKF MCP Server running on stdio.');
}

runServer().catch((err) => {
  console.error('Fatal OKF MCP Server Error:', err);
  process.exit(1);
});
