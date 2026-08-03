import { ModuleDocOutput } from '../types/index.js';

export interface DocGenerator {
  formatTechnicalDoc(moduleName: string, rawDetails: string): string;
  formatBusinessDoc(moduleName: string, rawFlow: string): string;
}

export class MarkdownDocGenerator implements DocGenerator {
  formatTechnicalDoc(moduleName: string, rawDetails: string): string {
    return `# Technical Documentation: ${moduleName}\n\n${rawDetails}`;
  }

  formatBusinessDoc(moduleName: string, rawFlow: string): string {
    return `# Draft Business Flow: ${moduleName}\n\n> **NOTICE**: Business flow is inferred. Review before using.\n\n${rawFlow}`;
  }
}
