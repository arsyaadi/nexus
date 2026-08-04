#!/usr/bin/env node

import * as path from 'node:path';
import { CodebaseAnalyzer } from './analyzer/index.js';
import { ModulePlanner } from './planner/index.js';
import { ModuleExecutor } from './executor/index.js';
import { NexusStorage } from './storage/index.js';
import { NexusWorkflowOrchestrator, PlaceholderUserReview } from './workflow/index.js';
import { DocusaurusExporter } from './exporter/docusaurusExporter.js';
import { DocxExporter } from './exporter/docxExporter.js';
import { NexusUIServer } from './ui/server.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const targetPath = args.find((a) => !a.startsWith('-') && a !== command) || '.';

  console.log('Nexus - Standalone Knowledge Graph & Flow Engine');

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Usage: nexus <command> [target-path] [options]

Commands:
  init <path>                                   Index target repository AST
  plan <path>                                   Generate Execution Plan from Knowledge Graph
  run <path>                                    Execute full Workflow (Init → E2E Flow → Review → .nexus)
  ui <path>                                     Launch Interactive Web Graph Visualizer UI (http://localhost:3333)
  export <path> --format <docusaurus|docx> --out <dir>   Export .nexus package to Docusaurus or Word (.docx)
  help                                          Show help information
`);
    return;
  }

  if (command === 'export') {
    const formatArgIdx = args.indexOf('--format');
    const format = formatArgIdx !== -1 ? args[formatArgIdx + 1] : 'docx';

    const outArgIdx = args.indexOf('--out');
    const outputDir = outArgIdx !== -1 ? args[outArgIdx + 1] : './export';

    const titleArgIdx = args.indexOf('--title');
    const title = titleArgIdx !== -1 ? args[titleArgIdx + 1] : 'Nexus End-to-End Documentation';

    const nexusDir = targetPath.endsWith('.nexus') 
      ? targetPath 
      : path.join(targetPath, '.nexus');

    console.log(`\n--- Exporting Nexus package at [${nexusDir}] ---`);
    console.log(`Format: ${format}, Output Directory: ${outputDir}`);

    if (format === 'docusaurus') {
      const exporter = new DocusaurusExporter();
      await exporter.export({ nexusDir, outputDir, title });
    } else if (format === 'docx') {
      const exporter = new DocxExporter();
      await exporter.export({ nexusDir, outputDir, title });
    } else {
      console.error(`Unsupported format: ${format}. Allowed formats: docusaurus, docx.`);
      process.exit(1);
    }

    console.log('Export completed successfully.');
    return;
  }

  if (command === 'ui' || command === 'view') {
    const uiServer = new NexusUIServer(3333);
    await uiServer.start(targetPath);
    return;
  }

  const analyzer = new CodebaseAnalyzer();

  if (command === 'init') {
    console.log(`\n--- Initializing & Indexing Repository at: ${targetPath} ---`);
    await analyzer.indexRepository(targetPath);
    console.log('Indexing initiated successfully.');
    return;
  }

  if (command === 'plan') {
    console.log(`\n--- Analyzing Knowledge Graph at: ${targetPath} ---`);

    const planner = new ModulePlanner();
    const graph = await analyzer.analyze(targetPath);
    const plan = await planner.createPlan(graph, targetPath);

    console.log(`\nGenerated Execution Plan (${plan.tasks.length} modules):\n`);
    for (const task of plan.tasks) {
      console.log(`[Module: ${task.moduleName}] (Priority: ${task.priority}, Complexity: ${task.estimatedComplexity})`);
      console.log(`  - Related Nodes (${task.relatedNodes.length}): ${task.relatedNodes.join(', ')}`);
      console.log(`  - Related Files (${task.relatedFiles.length}): ${task.relatedFiles.join(', ')}`);
      console.log(`  - Dependencies (${task.dependencies.length}): ${task.dependencies.length > 0 ? task.dependencies.join(', ') : 'none'}`);
      console.log('');
    }

    return;
  }

  if (command === 'run' || command === 'analyze') {
    const orchestrator = new NexusWorkflowOrchestrator({
      graphProvider: analyzer,
      planner: new ModulePlanner(),
      reviewer: new PlaceholderUserReview(),
      executor: new ModuleExecutor(),
      storage: new NexusStorage(),
    });

    await orchestrator.run(targetPath);
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
