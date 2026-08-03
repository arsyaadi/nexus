import { OKFMetadata } from '../types/index.js';

export interface OKFExporterOptions {
  okfDir: string;
  outputDir: string;
  title?: string;
}

export interface OKFExporter {
  export(options: OKFExporterOptions): Promise<void>;
}

export interface OKFPackageData {
  metadata: OKFMetadata;
  e2eFlowContent?: string;
  technicalDocs: Map<string, string>; // filename -> markdown content
  businessDocs: Map<string, string>;  // filename -> markdown content
}
