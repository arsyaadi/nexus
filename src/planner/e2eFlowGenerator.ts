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

    // 1. Build Master Mermaid Flowchart (TD) connecting all graph nodes
    const mermaidLines: string[] = ['flowchart TD'];

    // Map node IDs to sanitized Mermaid Node IDs
    const nodeIdMap = new Map<string, string>();
    mainNodes.forEach((node, idx) => {
      const cleanId = `N${idx + 1}`;
      nodeIdMap.set(node.id, cleanId);
      const label = `${node.name} (${node.type})`;
      mermaidLines.push(`    ${cleanId}["${label}"]`);
    });

    // Add edges
    edges.forEach((edge) => {
      const sourceId = nodeIdMap.get(edge.source);
      const targetId = nodeIdMap.get(edge.target);

      if (sourceId && targetId) {
        const rel = edge.relationship.replace(/_/g, ' ');
        mermaidLines.push(`    ${sourceId} -->|"${rel}"| ${targetId}`);
      }
    });

    const masterMermaid = mermaidLines.join('\n');

    // 2. Generate Single Unified E2E Document Markdown Content
    const docLines: string[] = [
      `# ${repoName} - End-to-End System Core Flow`,
      ``,
      `> ⚠️ **Draft E2E System Documentation**`,
      `>`,
      `> Dokumen ini dihasilkan secara otomatis dari analisis AST Knowledge Graph untuk menampilkan alur bisnis dan arsitektur sistem dari awal hingga akhir.`,
      ``,
      `---`,
      ``,
      `# 1. Ringkasan Sistem & Alur Utama`,
      ``,
      `Dokumen ini menyatukan seluruh kapabilitas, modul, komponen, dan berkas di dalam sistem **${repoName}** ke dalam satu diagram alur dan penjelasan terstruktur.`,
      ``,
      `Total Node Terdeteksi: **${mainNodes.length}** | Total Relasi Antar Komponen: **${edges.length}**`,
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
      `# 3. Penjelasan Rinci Alur Komponen`,
      ``,
    ];

    mainNodes.forEach((node, idx) => {
      const outgoingEdges = edges.filter((e) => e.source === node.id);
      const incomingEdges = edges.filter((e) => e.target === node.id);

      docLines.push(`### ${idx + 1}. ${node.name} (\`${node.type}\`)`);
      docLines.push(`- **Lokasi Berkas**: \`${node.filePath}\``);
      docLines.push(`- **Komponen Masuk (Incoming)**: ${incomingEdges.length > 0 ? incomingEdges.map((e) => `\`${e.source}\``).join(', ') : 'None (Entry Point)'}`);
      docLines.push(`- **Komponen Keluar (Outgoing)**: ${outgoingEdges.length > 0 ? outgoingEdges.map((e) => `\`${e.target}\``).join(', ') : 'None'}`);
      docLines.push(``);
    });

    docLines.push(`---`);
    docLines.push(``);
    docLines.push(`# 4. Matrix Relasi Komponen`);
    docLines.push(``);
    docLines.push(`| Sumber (Source) | Tipe Relasi | Target |`);
    docLines.push(`|-----------------|-------------|--------|`);

    if (edges.length > 0) {
      edges.forEach((edge) => {
        docLines.push(`| \`${edge.source}\` | ${edge.relationship} | \`${edge.target}\` |`);
      });
    } else {
      docLines.push(`| N/A | No edges detected | N/A |`);
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
      markdownContent: docLines.join('\n')
    };
  }
}
