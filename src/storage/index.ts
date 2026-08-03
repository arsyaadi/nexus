import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { ModuleDocOutput, OKFMetadata } from '../types/index.js';

/**
 * Output Renderer / Formatter abstraction for extensibility in future phases (e.g. Markdown, HTML, Docusaurus)
 */
export interface RenderAdapter {
  formatTechnicalPath(moduleName: string): string;
  formatBusinessPath(moduleName: string): string;
}

export class DefaultMarkdownRenderAdapter implements RenderAdapter {
  formatTechnicalPath(moduleName: string): string {
    return path.join('technical', `${this.sanitizeFilename(moduleName)}.md`);
  }

  formatBusinessPath(moduleName: string): string {
    return path.join('business', `${this.sanitizeFilename(moduleName)}.md`);
  }

  private sanitizeFilename(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  }
}

/**
 * Writer contract for saving extracted knowledge into .okf package structure.
 * Has zero dependency on Planner or Workflow.
 */
export interface OKFWriter {
  initializePackage(targetDir: string): Promise<void>;
  writeModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void>;
  writeMetadata(targetDir: string, metadata: OKFMetadata): Promise<void>;
}

export class FileSystemOKFWriter implements OKFWriter {
  private renderer: RenderAdapter;

  constructor(renderer: RenderAdapter = new DefaultMarkdownRenderAdapter()) {
    this.renderer = renderer;
  }

  async initializePackage(targetDir: string): Promise<void> {
    const okfRoot = path.join(targetDir, '.okf');
    await fs.mkdir(path.join(okfRoot, 'technical'), { recursive: true });
    await fs.mkdir(path.join(okfRoot, 'business'), { recursive: true });
  }

  async writeModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void> {
    const okfRoot = path.join(targetDir, '.okf');
    const techRelPath = this.renderer.formatTechnicalPath(doc.moduleName);
    const bizRelPath = this.renderer.formatBusinessPath(doc.moduleName);

    const techFile = path.join(okfRoot, techRelPath);
    const bizFile = path.join(okfRoot, bizRelPath);

    await fs.writeFile(techFile, doc.technicalContent, 'utf-8');
    await fs.writeFile(bizFile, doc.businessContent, 'utf-8');
  }

  async writeMetadata(targetDir: string, metadata: OKFMetadata): Promise<void> {
    const metaFile = path.join(targetDir, '.okf', 'metadata.json');
    await fs.writeFile(metaFile, JSON.stringify(metadata, null, 2), 'utf-8');
  }
}

/**
 * Backward-compatible StorageManager adapter for Workflow
 */
export interface StorageManager {
  initOKFDir(targetDir: string): Promise<void>;
  saveModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void>;
  writeMetadata(targetDir: string, metadata: OKFMetadata): Promise<void>;
}

export class OKFStorage implements StorageManager {
  private writer: OKFWriter;

  constructor(writer: OKFWriter = new FileSystemOKFWriter()) {
    this.writer = writer;
  }

  async initOKFDir(targetDir: string): Promise<void> {
    await this.writer.initializePackage(targetDir);
  }

  async saveModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void> {
    await this.writer.writeModuleDoc(targetDir, doc);
  }

  async writeMetadata(targetDir: string, metadata: OKFMetadata): Promise<void> {
    await this.writer.writeMetadata(targetDir, metadata);
  }
}
