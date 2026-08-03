import { VidyaMetadata } from '../types/index.js';

export interface VidyaExporterOptions {
  vidyaDir: string;
  outputDir: string;
  title?: string;
}

export type OKFExporterOptions = VidyaExporterOptions & { okfDir?: string };

export interface VidyaExporter {
  export(options: VidyaExporterOptions): Promise<void>;
}

export type OKFExporter = VidyaExporter;

export interface VidyaPackageData {
  metadata: VidyaMetadata;
  e2eFlowContent?: string;
  technicalDocs: Map<string, string>; // filename -> markdown content
  businessDocs: Map<string, string>;  // filename -> markdown content
}

export type OKFPackageData = VidyaPackageData;
