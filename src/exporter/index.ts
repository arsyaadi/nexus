import { NexusMetadata } from '../types/index.js';

export interface NexusExporterOptions {
  nexusDir?: string;
  vidyaDir?: string;
  okfDir?: string;
  outputDir: string;
  title?: string;
}

export type VidyaExporterOptions = NexusExporterOptions;
export type OKFExporterOptions = NexusExporterOptions;

export interface NexusExporter {
  export(options: NexusExporterOptions): Promise<void>;
}

export type VidyaExporter = NexusExporter;
export type OKFExporter = NexusExporter;

export interface NexusPackageData {
  metadata: NexusMetadata;
  e2eFlowContent?: string;
  technicalDocs: Map<string, string>; // filename -> markdown content
  businessDocs: Map<string, string>;  // filename -> markdown content
}

export type VidyaPackageData = NexusPackageData;
export type OKFPackageData = NexusPackageData;
