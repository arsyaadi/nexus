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
      `### Knowledge Graph Components (${relatedNodes.length})`,
      relatedNodes.length > 0 ? relatedNodes.slice(0, 8).map((node) => `- \`${node}\``).join('\n') + (relatedNodes.length > 8 ? `\n- *...and ${relatedNodes.length - 8} more components*` : '') : `- None`,
      ``,
      `### Source Files (${relatedFiles.length})`,
      relatedFiles.length > 0 ? relatedFiles.slice(0, 8).map((file) => `- \`${file}\``).join('\n') + (relatedFiles.length > 8 ? `\n- *...and ${relatedFiles.length - 8} more files*` : '') : `- None`,
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
      `> 💡 **Draft Business Documentation**`,
      `>`,
      `> This document is generated automatically based on source code analysis and should be reviewed by Product Owners or Domain Experts.`,
      ``,
      `---`,
      ``,
      `# Summary`,
      ``,
      `The **${moduleName}** module handles core business processes and domain capabilities related to ${moduleName}.`,
      ``,
      `---`,
      ``,
      `# Business Objectives`,
      ``,
      `This module aims to:`,
      ``,
      `- Ensure ${moduleName} operations comply with system business rules.`,
      `- Manage transactions and input data validation for ${moduleName}.`,
      `- Coordinate domain workflows between related system components.`,
      ``,
      `---`,
      ``,
      `# Actors`,
      ``,
      `| Actor | Role |`,
      `|-------|------|`,
      `| User / Client | Initiates ${moduleName} transactions or requests |`,
      `| System / Service | Validates data and executes core business logic |`,
      `| Database / Storage | Persists domain state and data entities |`,
      ``,
      `---`,
      ``,
      `# Prerequisites`,
      ``,
      `Before process execution:`,
      ``,
      `- System service and component dependencies are active.`,
      `- Input parameters for ${moduleName} are validated.`,
      `- User has appropriate permissions for ${moduleName}.`,
      ``,
      `---`,
      ``,
      `# Business Flow`,
      ``,
      `\`\`\`mermaid`,
      `flowchart TD`,
      `    A[Start ${moduleName} Transaction] --> B[Input Parameters]`,
      `    B --> C[Validate Constraints]`,
      `    C --> D{Is Valid?}`,
      `    D -->|Yes| E[Execute Business Logic]`,
      `    D -->|No| F[Return Error Response]`,
      `    E --> G[Update State & Storage]`,
      `    G --> H[Finish]`,
      `\`\`\``,
      ``,
      `---`,
      ``,
      `# Flow Description`,
      ``,
      `### 1. Data Input`,
      ``,
      `User or caller provides transaction parameters for ${moduleName}.`,
      ``,
      `---`,
      ``,
      `### 2. Validation`,
      ``,
      `System validates input payload constraints against related components:`,
      relatedFiles.length > 0 ? relatedFiles.map((f) => `- \`${f}\``).join('\n') : `- Components`,
      ``,
      `---`,
      ``,
      `### 3. Execution & Processing`,
      ``,
      `System executes core processing and domain calculation logic.`,
      ``,
      `---`,
      ``,
      `### 4. Completion`,
      ``,
      `Transaction succeeds and state updates are saved to database/storage.`,
      ``,
      `---`,
      ``,
      `# Detected Business Rules`,
      ``,
      `| Rule | Confidence |`,
      `|------|------------|`,
      `| Transaction data must adhere to interface contracts | High |`,
      `| State mutations persist consistently upon completion | Medium |`,
      ``,
      `---`,
      ``,
      `# Edge Cases & Errors`,
      ``,
      `- Invalid input parameters.`,
      `- Dependency service connection failure.`,
      `- User transaction cancellation.`,
      ``,
      `---`,
      ``,
      `# Inter-Module Dependencies`,
      ``,
      `This module interacts with:`,
      relatedNodes.length > 0 ? relatedNodes.slice(0, 5).map((n) => `- \`${n}\``).join('\n') : `- Structural Components`,
      ``,
      `---`,
      ``,
      `# Notes`,
      ``,
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
