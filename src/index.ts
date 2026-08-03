#!/usr/bin/env node

import { CodebaseAnalyzer } from './analyzer/index.js';
import { ModulePlanner } from './planner/index.js';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('OKF - Knowledge Extraction Engine (Phase 1 MVP)');

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Usage: okf <command> [options]

Commands:
  plan <path>       Generate Execution Plan from repository Knowledge Graph
  help              Show help information
`);
    return;
  }

  if (command === 'plan' || command === 'analyze') {
    const targetPath = args[1] || '.';
    console.log(`\n--- Analyzing Knowledge Graph at: ${targetPath} ---`);

    const analyzer = new CodebaseAnalyzer();
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

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
