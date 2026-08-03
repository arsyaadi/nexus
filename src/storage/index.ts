import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { ModuleDocOutput, OKFMetadata } from '../types/index.js';

export interface StorageManager {
  initOKFDir(targetDir: string): Promise<void>;
  saveModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void>;
  writeMetadata(targetDir: string, metadata: OKFMetadata): Promise<void>;
}

export class OKFStorage implements StorageManager {
  async initOKFDir(targetDir: string): Promise<void> {
    const okfPath = path.join(targetDir, '.okf');
    await fs.mkdir(path.join(okfPath, 'technical'), { recursive: true });
    await fs.mkdir(path.join(okfPath, 'business'), { recursive: true });
  }

  async saveModuleDoc(targetDir: string, doc: ModuleDocOutput): Promise<void> {
    const okfPath = path.join(targetDir, '.okf');
    const techFile = path.join(okfPath, 'technical', `${doc.moduleName.toLowerCase()}.md`);
    const bizFile = path.join(okfPath, 'business', `${doc.moduleName.toLowerCase()}.md`);

    await fs.writeFile(techFile, doc.technicalContent, 'utf-8');
    await fs.writeFile(bizFile, doc.businessContent, 'utf-8');
  }

  async writeMetadata(targetDir: string, metadata: OKFMetadata): Promise<void> {
    const metaFile = path.join(targetDir, '.okf', 'metadata.json');
    await fs.writeFile(metaFile, JSON.stringify(metadata, null, 2), 'utf-8');
  }
}
