#!/usr/bin/env node

import { CodebaseAnalyzer, CodebaseMemoryProvider } from './analyzer/index.js';
import { ModulePlanner } from './planner/index.js';
import { ModuleExecutor } from './executor/index.js';
import { OKFStorage } from './storage/index.js';
import { OKFWorkflowOrchestrator, PlaceholderUserReview } from './workflow/index.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const targetPath = args.find((a) => !a.startsWith('-') && a !== command) || '.';

  console.log('OKF - Knowledge Extraction Engine');

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Usage: okf <command> [target-path]

Commands:
  init <path>       Index target repository using codebase-memory-mcp
  plan <path>       Generate Execution Plan from Knowledge Graph
  run <path>        Execute full Workflow (Init → Plan → Review → Execute → .okf)
  help              Show help information
`);
    return;
  }

  const provider = new CodebaseMemoryProvider();
  const analyzer = new CodebaseAnalyzer(provider);

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
    const orchestrator = new OKFWorkflowOrchestrator({
      graphProvider: analyzer,
      planner: new ModulePlanner(),
      reviewer: new PlaceholderUserReview(),
      executor: new ModuleExecutor(),
      storage: new OKFStorage(),
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
