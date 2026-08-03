import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { VidyaPackageData } from './index.js';
import { VidyaMetadata } from '../types/index.js';

export async function loadVidyaPackage(targetDir: string): Promise<VidyaPackageData> {
  // Check for .vidya dir first, fallback to .okf dir
  let pkgDir = targetDir;
  if (!pkgDir.endsWith('.vidya') && !pkgDir.endsWith('.okf')) {
    try {
      const vidyaStat = await fs.stat(path.join(targetDir, '.vidya'));
      if (vidyaStat.isDirectory()) {
        pkgDir = path.join(targetDir, '.vidya');
      }
    } catch {
      pkgDir = path.join(targetDir, '.okf');
    }
  }

  let metadata: VidyaMetadata = {
    version: '0.1.0',
    generatedAt: new Date().toISOString(),
    repoPath: targetDir,
    modules: []
  };

  try {
    const metadataPath = path.join(pkgDir, 'metadata.json');
    const metadataRaw = await fs.readFile(metadataPath, 'utf-8');
    metadata = JSON.parse(metadataRaw);
  } catch {
    // Fallback default metadata if metadata.json is not present
  }

  let e2eFlowContent: string | undefined;
  try {
    const e2ePath = path.join(pkgDir, 'e2e_flow.md');
    e2eFlowContent = await fs.readFile(e2ePath, 'utf-8');
  } catch {
    // Optional if not generated yet
  }

  const technicalDocs = new Map<string, string>();
  const techDir = path.join(pkgDir, 'technical');
  try {
    const files = await fs.readdir(techDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(techDir, file), 'utf-8');
        technicalDocs.set(file, content);
      }
    }
  } catch {
    // Ignore missing directory if empty
  }

  const businessDocs = new Map<string, string>();
  const bizDir = path.join(pkgDir, 'business');
  try {
    const files = await fs.readdir(bizDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(bizDir, file), 'utf-8');
        businessDocs.set(file, content);
      }
    }
  } catch {
    // Ignore missing directory if empty
  }

  return {
    metadata,
    e2eFlowContent,
    technicalDocs,
    businessDocs
  };
}

export const loadOKFPackage = loadVidyaPackage;
