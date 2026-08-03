#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { CodebaseAnalyzer, LocalGraphProvider } from '../analyzer/index.js';
import { ModulePlanner, E2EFlowGenerator } from '../planner/index.js';
import { FileSystemOKFWriter } from '../storage/index.js';
import { OKFMetadata } from '../types/index.js';
import { DocusaurusExporter } from '../exporter/docusaurusExporter.js';
import { DocxExporter } from '../exporter/docxExporter.js';

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
        name: 'okf_generate_e2e',
        description:
          'PRIMARY TOOL: Analyze repository and generate ONE SINGLE End-to-End Master Mermaid Diagram and unified documentation file (.okf/e2e_flow.md) covering all components end-to-end in ONE step. DO NOT loop per module.',
        inputSchema: {
          type: 'object',
          properties: {
            repo_path: {
              type: 'string',
              description: 'Path to target repository (default: current directory ".")',
            },
          },
          required: ['repo_path'],
        },
      },
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
              description: 'Inferred business flow in Markdown format (marked DRAFT). MUST include a Mermaid diagram block (```mermaid flowchart TD ... ```).',
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
      {
        name: 'okf_export',
        description:
          'ALWAYS use this tool whenever the user asks to export, convert, or generate Word documents (.docx) or Docusaurus sites from an .okf package or repository. DO NOT run external shell tools like pandoc, python, or libreoffice. Supported formats: docx (generates single unified documentation.docx with Master E2E Flow diagram), docusaurus.',
        inputSchema: {
          type: 'object',
          properties: {
            target_dir: {
              type: 'string',
              description: 'Path to directory containing .okf package or target repo path (default: current workspace directory ".") ',
            },
            format: {
              type: 'string',
              enum: ['docusaurus', 'docx'],
              description: 'Export format: "docx" for Word documents or "docusaurus" for site structure',
            },
            output_dir: {
              type: 'string',
              description: 'Output directory path for exported files (e.g., "./export" or "./docs")',
            },
            title: {
              type: 'string',
              description: 'Optional document/project title',
            },
          },
          required: ['target_dir', 'format', 'output_dir'],
        },
      },
    ],
  };
});

// Handle Tool Call Requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'okf_generate_e2e') {
      const repoPath = String(args?.repo_path || '.');
      const analyzer = new CodebaseAnalyzer();

      const graph = await analyzer.getKnowledgeGraph(repoPath);
      const e2eGenerator = new E2EFlowGenerator();
      const repoName = path.basename(path.resolve(repoPath)) || 'System';
      const e2eFlow = e2eGenerator.generate(graph, repoName);

      await writer.initializePackage(repoPath);
      await writer.writeE2EFlow(repoPath, e2eFlow.markdownContent);

      const metadata: OKFMetadata = {
        version: '0.1.0',
        generatedAt: new Date().toISOString(),
        repoPath,
        modules: [repoName],
      };
      await writer.writeMetadata(repoPath, metadata);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                message: 'Master End-to-End Mermaid Flowchart & single unified documentation generated in ONE step.',
                e2eFile: path.join(repoPath, '.okf', 'e2e_flow.md'),
                masterMermaidDiagram: e2eFlow.masterMermaid,
                preview: e2eFlow.markdownContent.slice(0, 1200) + '\n...[truncated preview]',
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (name === 'okf_plan') {
      const repoPath = String(args?.repo_path || '.');
      const analyzer = new CodebaseAnalyzer();

      const graph = await analyzer.getKnowledgeGraph(repoPath);

      // Generate Master E2E Flow documentation & diagram
      const e2eGenerator = new E2EFlowGenerator();
      const repoName = path.basename(path.resolve(repoPath)) || 'System';
      const e2eFlow = e2eGenerator.generate(graph, repoName);

      // Save .okf/e2e_flow.md
      await writer.initializePackage(repoPath);
      await writer.writeE2EFlow(repoPath, e2eFlow.markdownContent);

      const plan = await planner.createPlan(graph, repoPath);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                status: 'success',
                message: 'AST Knowledge Graph analyzed and Master E2E Flow documentation generated.',
                e2eFlowFile: path.join(repoPath, '.okf', 'e2e_flow.md'),
                masterMermaidDiagram: e2eFlow.masterMermaid,
                plan,
              },
              null,
              2
            ),
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

      let finalBusinessContent = businessContent;
      if (!finalBusinessContent.includes('```mermaid')) {
        const diagramBlock = [
          ``,
          `# Alur Bisnis`,
          ``,
          `\`\`\`mermaid`,
          `flowchart TD`,
          `    A[Mulai Transaksi ${moduleName}] --> B[Input Data & Parameter]`,
          `    B --> C[Validasi Rule Bisnis ${moduleName}]`,
          `    C --> D{Apakah Valid?}`,
          `    D -->|Ya| E[Eksekusi Operasi ${moduleName}]`,
          `    D -->|Tidak| F[Kembalikan Error & Log]`,
          `    E --> G[Update Storage & Finish]`,
          `\`\`\``,
          ``,
        ].join('\n');
        finalBusinessContent += `\n${diagramBlock}`;
      }

      await writer.initializePackage(repoPath);
      await writer.writeModuleDoc(repoPath, {
        moduleName,
        technicalContent,
        businessContent: finalBusinessContent,
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

    if (name === 'okf_export') {
      const targetDir = String(args?.target_dir || '.');
      const format = String(args?.format || 'docx').toLowerCase();
      const outputDir = String(args?.output_dir || './export');
      const title = args?.title ? String(args.title) : 'OKF Documentation';

      const okfDir = targetDir.endsWith('.okf') ? targetDir : path.join(targetDir, '.okf');

      if (format === 'docusaurus') {
        const exporter = new DocusaurusExporter();
        await exporter.export({ okfDir, outputDir, title });
      } else if (format === 'docx') {
        const exporter = new DocxExporter();
        await exporter.export({ okfDir, outputDir, title });
      } else {
        throw new Error(`Unsupported export format: ${format}. Allowed: docusaurus, docx.`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'success',
              message: `Exported .okf package successfully using [${format}] format into [${outputDir}].`,
              format,
              outputDir,
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
