import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { ModuleDocOutput, NexusMetadata } from '../types/index.js';

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

export interface NexusWriter {
  initializePackage(targetDir: string): Promise<void>;
  writeModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void>;
  writeE2EFlow(targetDir: string, content: string): Promise<void>;
  writeMetadata(targetDir: string, metadata: NexusMetadata): Promise<void>;
}

export class FileSystemNexusWriter implements NexusWriter {
  private renderer: RenderAdapter;

  constructor(renderer: RenderAdapter = new DefaultMarkdownRenderAdapter()) {
    this.renderer = renderer;
  }

  async initializePackage(targetDir: string): Promise<void> {
    const nexusRoot = path.join(targetDir, '.nexus');
    await fs.mkdir(path.join(nexusRoot, 'technical'), { recursive: true });
    await fs.mkdir(path.join(nexusRoot, 'business'), { recursive: true });

    // Also support backward compatible .vidya and .okf folders
    const vidyaRoot = path.join(targetDir, '.vidya');
    await fs.mkdir(path.join(vidyaRoot, 'technical'), { recursive: true });
    await fs.mkdir(path.join(vidyaRoot, 'business'), { recursive: true });

    const okfRoot = path.join(targetDir, '.okf');
    await fs.mkdir(path.join(okfRoot, 'technical'), { recursive: true });
    await fs.mkdir(path.join(okfRoot, 'business'), { recursive: true });
  }

  async writeModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void> {
    const nexusRoot = path.join(targetDir, '.nexus');
    const vidyaRoot = path.join(targetDir, '.vidya');
    const okfRoot = path.join(targetDir, '.okf');
    const techRelPath = this.renderer.formatTechnicalPath(doc.moduleName);
    const bizRelPath = this.renderer.formatBusinessPath(doc.moduleName);

    await fs.writeFile(path.join(nexusRoot, techRelPath), doc.technicalContent, 'utf-8');
    await fs.writeFile(path.join(nexusRoot, bizRelPath), doc.businessContent, 'utf-8');

    // Also write to .vidya and .okf for backward compatibility
    await fs.writeFile(path.join(vidyaRoot, techRelPath), doc.technicalContent, 'utf-8');
    await fs.writeFile(path.join(vidyaRoot, bizRelPath), doc.businessContent, 'utf-8');
    await fs.writeFile(path.join(okfRoot, techRelPath), doc.technicalContent, 'utf-8');
    await fs.writeFile(path.join(okfRoot, bizRelPath), doc.businessContent, 'utf-8');
  }

  async writeE2EFlow(targetDir: string, content: string): Promise<void> {
    const nexusRoot = path.join(targetDir, '.nexus');
    const vidyaRoot = path.join(targetDir, '.vidya');
    const okfRoot = path.join(targetDir, '.okf');
    await fs.mkdir(nexusRoot, { recursive: true });
    await fs.mkdir(vidyaRoot, { recursive: true });
    await fs.mkdir(okfRoot, { recursive: true });

    await fs.writeFile(path.join(nexusRoot, 'e2e_flow.md'), content, 'utf-8');
    await fs.writeFile(path.join(vidyaRoot, 'e2e_flow.md'), content, 'utf-8');
    await fs.writeFile(path.join(okfRoot, 'e2e_flow.md'), content, 'utf-8');
  }

  async writeMetadata(targetDir: string, metadata: NexusMetadata): Promise<void> {
    const raw = JSON.stringify(metadata, null, 2);
    await fs.writeFile(path.join(targetDir, '.nexus', 'metadata.json'), raw, 'utf-8');
    await fs.writeFile(path.join(targetDir, '.vidya', 'metadata.json'), raw, 'utf-8');
    await fs.writeFile(path.join(targetDir, '.okf', 'metadata.json'), raw, 'utf-8');
  }
}

export type VidyaWriter = NexusWriter;
export type FileSystemVidyaWriter = FileSystemNexusWriter;
export type OKFWriter = NexusWriter;
export type FileSystemOKFWriter = FileSystemNexusWriter;

export interface StorageManager {
  initNexusDir(targetDir: string): Promise<void>;
  saveModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void>;
  writeE2EFlow(targetDir: string, content: string): Promise<void>;
  writeMetadata(targetDir: string, metadata: NexusMetadata): Promise<void>;
}

export class NexusStorage implements StorageManager {
  private writer: NexusWriter;

  constructor(writer: NexusWriter = new FileSystemNexusWriter()) {
    this.writer = writer;
  }

  async initNexusDir(targetDir: string): Promise<void> {
    await this.writer.initializePackage(targetDir);
  }

  async initVidyaDir(targetDir: string): Promise<void> {
    await this.writer.initializePackage(targetDir);
  }

  async initOKFDir(targetDir: string): Promise<void> {
    await this.writer.initializePackage(targetDir);
  }

  async saveModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void> {
    await this.writer.writeModuleDoc(targetDir, doc);
  }

  async writeE2EFlow(targetDir: string, content: string): Promise<void> {
    await this.writer.writeE2EFlow(targetDir, content);
  }

  async writeMetadata(targetDir: string, metadata: NexusMetadata): Promise<void> {
    await this.writer.writeMetadata(targetDir, metadata);
  }
}

export type VidyaStorage = NexusStorage;
export type OKFStorage = NexusStorage;
