import { NexusMetadata } from '../types/index.js';

export interface NexusExporterOptions {
  nexusDir?: string;
  outputDir: string;
  title?: string;
}

export interface NexusExporter {
  export(options: NexusExporterOptions): Promise<void>;
}

export interface NexusPackageData {
  metadata: NexusMetadata;
  e2eFlowContent?: string;
  technicalDocs: Map<string, string>; // filename -> markdown content
  businessDocs: Map<string, string>;  // filename -> markdown content
}
