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

    // Technical documentation (Factual implementation overview)
    const technicalContent = [
      `# Technical Documentation: ${moduleName}`,
      ``,
      `## Purpose`,
      `Technical specification and architectural overview for the **${moduleName}** capability module.`,
      ``,
      `## Related Components`,
      `### Nodes (${relatedNodes.length})`,
      relatedNodes.length > 0 ? relatedNodes.map((node) => `- \`${node}\``).join('\n') : `- None`,
      ``,
      `### Source Files (${relatedFiles.length})`,
      relatedFiles.length > 0 ? relatedFiles.map((file) => `- \`${file}\``).join('\n') : `- None`,
      ``,
      `## Architecture & Data Flow`,
      `*Implementation details extracted from Knowledge Graph analysis.*`,
    ].join('\n');

    // Business flow documentation (Always marked as DRAFT)
    const businessContent = [
      `# Draft Business Flow: ${moduleName}`,
      ``,
      `> **NOTICE**: Business documentation is inferred from codebase implementation. Treat as DRAFT until human review.`,
      ``,
      `## Overview`,
      `Inferred business capability and user interaction flow for **${moduleName}**.`,
      ``,
      `## Inferred Business Rules`,
      `- Rule 1: *Inferred business rule for ${moduleName} operations.*`,
      `- Rule 2: *Validation criteria derived from source file contracts.*`,
      ``,
      `## Process Flow`,
      `1. User triggers ${moduleName} operation.`,
      `2. System validates input constraints across related components.`,
      `3. Execution completes and state is updated.`,
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
