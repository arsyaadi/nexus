import * as path from 'node:path';
import {
  GraphProvider,
  ExecutionPlan,
  UserReviewHandler,
  VidyaMetadata,
} from '../types/index.js';
import { TaskExecutor } from '../executor/index.js';
import { Planner, E2EFlowGenerator } from '../planner/index.js';
import { StorageManager } from '../storage/index.js';

export class PlaceholderUserReview implements UserReviewHandler {
  async reviewPlan(plan: ExecutionPlan): Promise<boolean> {
    console.log(`\n[Workflow: Stage 3 - User Review]`);
    console.log(`Execution Plan containing ${plan.tasks.length} modules reviewed.`);
    console.log(`Status: APPROVED (Placeholder auto-approve)\n`);
    return true;
  }
}

export interface WorkflowOptions {
  graphProvider: GraphProvider;
  planner: Planner;
  reviewer: UserReviewHandler;
  executor: TaskExecutor;
  storage: StorageManager;
}

export class VidyaWorkflowOrchestrator {
  private graphProvider: GraphProvider;
  private planner: Planner;
  private reviewer: UserReviewHandler;
  private executor: TaskExecutor;
  private storage: StorageManager;

  constructor(options: WorkflowOptions) {
    this.graphProvider = options.graphProvider;
    this.planner = options.planner;
    this.reviewer = options.reviewer;
    this.executor = options.executor;
    this.storage = options.storage;
  }

  async run(repoPath: string): Promise<VidyaMetadata> {
    console.log(`=== Starting Vidya Workflow for: ${repoPath} ===\n`);

    // Stage 1: Extract Knowledge Graph
    console.log(`[Workflow: Stage 1] Extracting Knowledge Graph...`);
    const graph = await this.graphProvider.getKnowledgeGraph(repoPath);
    console.log(`Knowledge Graph loaded (${graph.nodes.length} nodes, ${graph.edges.length} edges).`);

    // Stage 2: Generate Master E2E System Flow
    console.log(`[Workflow: Stage 2] Generating Master End-to-End System Flow...`);
    const e2eGenerator = new E2EFlowGenerator();
    const repoName = path.basename(path.resolve(repoPath)) || 'System';
    const e2eFlow = e2eGenerator.generate(graph, repoName);

    // Stage 3: Planning
    console.log(`[Workflow: Stage 3] Generating Execution Plan...`);
    const plan = await this.planner.createPlan(graph, repoPath);
    console.log(`Plan generated (${plan.tasks.length} capability modules).`);

    // Stage 4: User Review
    console.log(`[Workflow: Stage 4] Requesting User Review...`);
    const isApproved = await this.reviewer.reviewPlan(plan);
    if (!isApproved) {
      throw new Error('Workflow aborted: Execution Plan was rejected during User Review.');
    }

    // Stage 5: Task Execution & Single E2E + Package Generation
    console.log(`[Workflow: Stage 5] Initializing .vidya package directory...`);
    await this.storage.initVidyaDir(repoPath);

    console.log(`[Workflow: Stage 5.1] Writing Single Unified E2E Document (.vidya/e2e_flow.md)...`);
    await this.storage.writeE2EFlow(repoPath, e2eFlow.markdownContent);

    console.log(`[Workflow: Stage 5.2] Executing tasks module-by-module...`);
    const processedModules: string[] = [];

    for (const task of plan.tasks) {
      console.log(` -> Executing task for module [${task.moduleName}]...`);
      const docOutput = await this.executor.executeModuleTask(task);
      await this.storage.saveModuleDoc(repoPath, docOutput);
      processedModules.push(task.moduleName);
    }

    // Stage 6: Finalize Package (.vidya metadata generation)
    console.log(`[Workflow: Stage 6] Finalizing .vidya package & metadata.json...`);
    const metadata: VidyaMetadata = {
      version: '0.1.0',
      generatedAt: new Date().toISOString(),
      repoPath,
      modules: processedModules,
    };

    await this.storage.writeMetadata(repoPath, metadata);
    console.log(`\n=== Vidya Workflow Completed Successfully! ===`);

    return metadata;
  }
}

export type OKFWorkflowOrchestrator = VidyaWorkflowOrchestrator;
