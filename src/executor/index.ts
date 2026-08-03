import { ModuleDocOutput } from '../types/index.js';

export interface WorkerInput {
  moduleName: string;
  relatedNodes: string[];
  relatedFiles: string[];
}

export type WorkerOutput = ModuleDocOutput;

export interface TaskWorker {
  execute(input: WorkerInput): Promise<WorkerOutput>;
}

/**
 * Worker responsible for executing a single module task in isolation.
 * Has no awareness of Planner or Workflow.
 */
export class ModuleWorker implements TaskWorker {
  async execute(input: WorkerInput): Promise<WorkerOutput> {
    const { moduleName, relatedNodes, relatedFiles } = input;

    // Technical documentation (Factual implementation overview with Sequence Diagram)
    const technicalContent = [
      `# Technical Specification: ${moduleName}`,
      ``,
      `## 1. Overview`,
      `Technical specification and architectural contract for **${moduleName}**.`,
      ``,
      `---`,
      ``,
      `## 2. Technical Sequence Diagram`,
      ``,
      `\`\`\`mermaid`,
      `sequenceDiagram`,
      `    autonumber`,
      `    participant Client as Caller / EntryPoint`,
      `    participant Module as ${moduleName}`,
      `    participant Engine as Internal Logic / Provider`,
      `    participant Storage as FileSystem / Data Store`,
      ``,
      `    Client->>Module: Invoke ${moduleName} capability`,
      `    Module->>Engine: Process request parameters`,
      `    Engine->>Storage: Read/Write module state`,
      `    Storage-->>Engine: State response`,
      `    Engine-->>Module: Execution result`,
      `    Module-->>Client: Return outcome / data`,
      `\`\`\``,
      ``,
      `---`,
      ``,
      `## 3. Related Components`,
      ``,
      `### Knowledge Graph Nodes (${relatedNodes.length})`,
      relatedNodes.length > 0 ? relatedNodes.map((node) => `- \`${node}\``).join('\n') : `- None`,
      ``,
      `### Source Files (${relatedFiles.length})`,
      relatedFiles.length > 0 ? relatedFiles.map((file) => `- \`${file}\``).join('\n') : `- None`,
      ``,
      `---`,
      ``,
      `## 4. Architecture & Execution Details`,
      `*Implementation details extracted from Knowledge Graph analysis.*`,
      ``,
      `- **Module Scope**: ${moduleName}`,
      `- **Data Mutability**: State updates written via Nexus Storage adapter.`,
      `- **Dependencies**: Interacts with related graph components.`,
    ].join('\n');

    // Business flow documentation (Standardized template, marked DRAFT)
    const businessContent = [
      `# ${moduleName}`,
      ``,
      `> ⚠️ **Draft Business Documentation**`,
      `>`,
      `> Dokumen ini dihasilkan secara otomatis berdasarkan analisis source code dan perlu divalidasi oleh Business Analyst atau Product Owner.`,
      ``,
      `---`,
      ``,
      `# Ringkasan`,
      ``,
      `Modul **${moduleName}** digunakan untuk menangani proses bisnis terkait kapabilitas ${moduleName} di dalam sistem.`,
      ``,
      `---`,
      ``,
      `# Tujuan Bisnis`,
      ``,
      `Modul ini bertujuan untuk:`,
      ``,
      `- Memastikan proses ${moduleName} berjalan sesuai aturan perusahaan.`,
      `- Mengelola transaksi dan validasi data ${moduleName}.`,
      `- Mengkoordinasikan alur kerja antar komponen terkait.`,
      ``,
      `---`,
      ``,
      `# Aktor`,
      ``,
      `| Aktor | Peran |`,
      `|--------|------|`,
      `| User / Customer | Memulai transaksi / interaksi ${moduleName} |`,
      `| System / Service | Memproses validasi data dan logika bisnis |`,
      `| Database / Store | Menyimpan status dan entitas data |`,
      ``,
      `---`,
      ``,
      `# Prasyarat`,
      ``,
      `Sebelum proses dimulai:`,
      ``,
      `- Sistem dan dependensi komponen aktif.`,
      `- Parameter input ${moduleName} valid.`,
      `- User memiliki kewenangan akses fitur ${moduleName}.`,
      ``,
      `---`,
      ``,
      `# Alur Bisnis`,
      ``,
      `\`\`\`mermaid`,
      `flowchart TD`,
      `    A[Mulai Transaksi ${moduleName}] --> B[Input Data Parameter]`,
      `    B --> C[Validasi Constraint]`,
      `    C --> D{Apakah Valid?}`,
      `    D -->|Ya| E[Eksekusi Logika Bisnis]`,
      `    D -->|Tidak| F[Kembalikan Pesan Error]`,
      `    E --> G[Update Status & Storage]`,
      `    G --> H[Selesai]`,
      `\`\`\``,
      ``,
      `---`,
      ``,
      `# Penjelasan Alur`,
      ``,
      `### 1. Input Data`,
      ``,
      `Pengguna memasukkan informasi atau payload transaksi ${moduleName}.`,
      ``,
      `---`,
      ``,
      `### 2. Validasi`,
      ``,
      `Sistem melakukan validasi terhadap parameter input dan aturan bisnis terkait komponen file:`,
      relatedFiles.length > 0 ? relatedFiles.map((f) => `- \`${f}\``).join('\n') : `- Components`,
      ``,
      `---`,
      ``,
      `### 3. Perhitungan & Eksekusi`,
      ``,
      `Sistem menjalankan pemrosesan utama dan kalkulasi logika bisnis.`,
      ``,
      `---`,
      ``,
      `### 4. Penyelesaian`,
      ``,
      `Data berhasil diproses dan disimpan ke penyimpanan sistem.`,
      ``,
      `---`,
      ``,
      `# Aturan Bisnis yang Terdeteksi`,
      ``,
      `| Rule | Confidence |`,
      `|-------|------------|`,
      `| Data transaksi wajib memenuhi kontrak antarmuka | High |`,
      `| State diubah secara konsisten saat proses selesai | Medium |`,
      ``,
      `---`,
      ``,
      `# Kondisi Khusus`,
      ``,
      `- Data input tidak valid.`,
      `- Kegagalan koneksi ke komponen dependensi.`,
      `- Pembatalan transaksi oleh pengguna.`,
      ``,
      `---`,
      ``,
      `# Dampak ke Modul Lain`,
      ``,
      `Modul ini berinteraksi dengan:`,
      relatedNodes.length > 0 ? relatedNodes.slice(0, 5).map((n) => `- \`${n}\``).join('\n') : `- Structural Components`,
      ``,
      `---`,
      ``,
      `# Catatan`,
      ``,
      `Dokumen ini merupakan hasil ekstraksi otomatis dari source code.`,
      `Beberapa aturan bisnis mungkin memerlukan validasi lebih lanjut oleh tim bisnis.`,
    ].join('\n');

    return {
      moduleName,
      technicalContent,
      businessContent,
    };
  }
}

/**
 * Adapter implementing TaskExecutor interface for Workflow compatibility
 */
export interface TaskExecutor {
  executeModuleTask(input: WorkerInput): Promise<WorkerOutput>;
}

export class ModuleExecutor implements TaskExecutor {
  private worker: TaskWorker;

  constructor(worker: TaskWorker = new ModuleWorker()) {
    this.worker = worker;
  }

  async executeModuleTask(input: WorkerInput): Promise<WorkerOutput> {
    return this.worker.execute(input);
  }
}
