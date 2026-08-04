import * as path from 'node:path';
import { KnowledgeGraph, GraphNode, GraphEdge } from '../types/index.js';

export interface E2EFlowOutput {
  title: string;
  masterMermaid: string;
  markdownContent: string;
}

export class E2EFlowGenerator {
  generate(graph: KnowledgeGraph, repoName: string = 'System'): E2EFlowOutput {
    const { nodes, edges } = graph;

    // Filter out root folder node for cleaner diagramming
    const mainNodes = nodes.filter((n) => n.type !== 'Folder');

    // Filter out CONTAINS_FILE noise edges
    const meaningfulEdges = edges.filter((e) => e.relationship !== 'CONTAINS_FILE');

    // Group nodes into logical module subgraphs
    const moduleMap = new Map<string, GraphNode[]>();
    mainNodes.forEach((node) => {
      const modName = this.extractModuleName(node);
      if (!moduleMap.has(modName)) {
        moduleMap.set(modName, []);
      }
      moduleMap.get(modName)!.push(node);
    });

    // 1. Build Master Mermaid Flowchart (TD) with Subgraphs
    const mermaidLines: string[] = ['flowchart TD'];
    const nodeIdMap = new Map<string, string>();
    let nodeCounter = 1;

    // Render Subgraphs per Module
    moduleMap.forEach((moduleNodes, moduleName) => {
      const cleanModuleName = moduleName.replace(/[^a-zA-Z0-9_]/g, '_');
      mermaidLines.push(`    subgraph ${cleanModuleName}["${moduleName} Module"]`);

      moduleNodes.forEach((node) => {
        const cleanId = `N${nodeCounter++}`;
        nodeIdMap.set(node.id, cleanId);
        const label = `${node.name} [${node.type}]`;
        mermaidLines.push(`        ${cleanId}["${label}"]`);
      });

      mermaidLines.push(`    end`);
    });

    // Render Edges between nodes
    meaningfulEdges.forEach((edge) => {
      const sourceId = nodeIdMap.get(edge.source);
      const targetId = nodeIdMap.get(edge.target);

      if (sourceId && targetId && sourceId !== targetId) {
        const rel = edge.relationship.replace(/_/g, ' ');
        mermaidLines.push(`    ${sourceId} -->|"${rel}"| ${targetId}`);
      }
    });

    const masterMermaid = mermaidLines.join('\n');

    // 2. Build Single Unified E2E Document Markdown Content
    const docLines: string[] = [
      `# ${repoName} - End-to-End System Core Flow`,
      ``,
      `> ⚠️ **Draft E2E System Documentation**`,
      `>`,
      `> Dokumen ini dihasilkan secara otomatis dari analisis AST Knowledge Graph untuk menampilkan alur bisnis dan arsitektur sistem dari awal hingga akhir.`,
      ``,
      `---`,
      ``,
      `# 1. Ringkasan Arsitektur Sistem`,
      ``,
      `Dokumen ini menyatukan seluruh modul kapabilitas, komponen AST, dan berkas di dalam sistem **${repoName}** ke dalam satu diagram alur berstruktur subgraph.`,
      ``,
      `Total Modul Kapabilitas: **${moduleMap.size}** | Total Node AST: **${mainNodes.length}** | Total Relasi Bermakna: **${meaningfulEdges.length}**`,
      ``,
      `---`,
      ``,
      `# 2. Master End-to-End Flowchart`,
      ``,
      `\`\`\`mermaid`,
      masterMermaid,
      `\`\`\``,
      ``,
      `---`,
      ``,
      `# 3. Rincian Modul & Komponen`,
      ``,
    ];

    let modIndex = 1;
    moduleMap.forEach((moduleNodes, moduleName) => {
      docLines.push(`## 3.${modIndex++} Modul Kapabilitas: ${moduleName}`);
      docLines.push(`Total Komponen: **${moduleNodes.length}**`);
      docLines.push(``);

      moduleNodes.forEach((node) => {
        const outgoingEdges = meaningfulEdges.filter((e) => e.source === node.id);
        const incomingEdges = meaningfulEdges.filter((e) => e.target === node.id);

        docLines.push(`- **${node.name}** (\`${node.type}\`) - \`${node.filePath || 'Root'}\``);
        if (incomingEdges.length > 0) {
          docLines.push(`  - *Incoming*: ${incomingEdges.map((e) => `\`${e.source}\``).join(', ')}`);
        }
        if (outgoingEdges.length > 0) {
          docLines.push(`  - *Outgoing*: ${outgoingEdges.map((e) => `\`${e.target}\``).join(', ')}`);
        }
      });
      docLines.push(``);
    });

    docLines.push(`---`);
    docLines.push(``);
    docLines.push(`# 4. Matrix Relasi Komponen`);
    docLines.push(``);
    docLines.push(`| Sumber (Source) | Tipe Relasi | Target |`);
    docLines.push(`|-----------------|-------------|--------|`);

    if (meaningfulEdges.length > 0) {
      meaningfulEdges.forEach((edge) => {
        docLines.push(`| \`${edge.source}\` | ${edge.relationship} | \`${edge.target}\` |`);
      });
    } else {
      docLines.push(`| N/A | No meaningful edges detected | N/A |`);
    }

    docLines.push(``);
    docLines.push(`---`);
    docLines.push(``);
    docLines.push(`# 5. Catatan Pengecekan`);
    docLines.push(``);
    docLines.push(`Dokumen E2E ini diekstraksi secara otomatis dari AST kode sumber.`);
    docLines.push(`Semua relasi komponen menggambarkan dependensi faktual sistem.`);

    return {
      title: `${repoName} E2E Flow`,
      masterMermaid,
      markdownContent: docLines.join('\n'),
    };
  }

  private extractModuleName(node: GraphNode): string {
    const filePath = node.filePath || '';
    const parts = filePath.split(/[/\\]+/).filter(Boolean);

    const rootDirIndex = parts.findIndex((p) => ['src', 'lib', 'pkg', 'app', 'internal', 'modules'].includes(p));
    if (rootDirIndex !== -1 && rootDirIndex + 1 < parts.length - 1) {
      const folder = parts[rootDirIndex + 1];
      return folder.charAt(0).toUpperCase() + folder.slice(1);
    }

    if (parts.length >= 2) {
      const folder = parts[parts.length - 2];
      if (!['src', 'lib', 'pkg', 'app', 'internal', 'modules', 'dist', 'build'].includes(folder)) {
        return folder.charAt(0).toUpperCase() + folder.slice(1);
      }
    }

    return 'Core';
  }
}
