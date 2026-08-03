import { KnowledgeGraph, ExecutionPlan, ModuleTask, GraphNode, GraphEdge, GraphProvider } from '../types/index.js';
import { E2EFlowGenerator, E2EFlowOutput } from './e2eFlowGenerator.js';

export { E2EFlowGenerator, E2EFlowOutput };

export interface Planner {
  createPlanFromProvider(provider: GraphProvider, repoPath: string): Promise<ExecutionPlan>;
  createPlan(graph: KnowledgeGraph, repoPath: string): Promise<ExecutionPlan>;
}

export class ModulePlanner implements Planner {
  // Suffixes/prefixes to strip to isolate core business/technical capability
  private static TECH_NOISE_REGEX = /(Controller|Service|Repository|Evaluator|Calculator|Checker|Manager|Helper|Util|Handler|Dto|Model|View|Api)$/i;

  async createPlanFromProvider(provider: GraphProvider, repoPath: string): Promise<ExecutionPlan> {
    const graph = await provider.getKnowledgeGraph(repoPath);
    return this.createPlan(graph, repoPath);
  }

  async createPlan(graph: KnowledgeGraph, repoPath: string): Promise<ExecutionPlan> {
    const nodeToModuleMap = new Map<string, string>();
    const modulesMap = new Map<string, { nodes: GraphNode[]; files: Set<string> }>();

    // Step 1: Group nodes into business capability modules based on domain tokens (not folder names)
    for (const node of graph.nodes) {
      const moduleName = this.extractCapabilityName(node.name);
      nodeToModuleMap.set(node.id, moduleName);

      if (!modulesMap.has(moduleName)) {
        modulesMap.set(moduleName, { nodes: [], files: new Set<string>() });
      }

      const mod = modulesMap.get(moduleName)!;
      mod.nodes.push(node);
      mod.files.add(node.filePath);
    }

    // Step 2: Determine inter-module dependencies and internal edge counts
    const moduleDependencies = new Map<string, Set<string>>();
    const moduleInternalEdgeCount = new Map<string, number>();

    for (const modName of modulesMap.keys()) {
      moduleDependencies.set(modName, new Set<string>());
      moduleInternalEdgeCount.set(modName, 0);
    }

    for (const edge of graph.edges) {
      const sourceModule = nodeToModuleMap.get(edge.source);
      const targetModule = nodeToModuleMap.get(edge.target);

      if (!sourceModule || !targetModule) continue;

      if (sourceModule === targetModule) {
        moduleInternalEdgeCount.set(sourceModule, (moduleInternalEdgeCount.get(sourceModule) || 0) + 1);
      } else {
        // Inter-module dependency: sourceModule depends on targetModule
        moduleDependencies.get(sourceModule)?.add(targetModule);
      }
    }

    // Step 3: Estimate priority via dependency depth
    const priorityMap = this.calculatePriorities(moduleDependencies);

    // Step 4: Construct ModuleTask list
    const tasks: ModuleTask[] = [];

    for (const [moduleName, data] of modulesMap.entries()) {
      const relatedNodes = data.nodes.map((n) => n.id);
      const relatedFiles = Array.from(data.files);
      const deps = Array.from(moduleDependencies.get(moduleName) || []);
      const internalEdges = moduleInternalEdgeCount.get(moduleName) || 0;

      // Complexity estimation heuristic based on size & internal connections
      const totalScore = relatedNodes.length + internalEdges;
      let estimatedComplexity: 'low' | 'medium' | 'high' = 'low';
      if (totalScore >= 8) {
        estimatedComplexity = 'high';
      } else if (totalScore >= 4) {
        estimatedComplexity = 'medium';
      }

      tasks.push({
        id: `task_${moduleName.toLowerCase()}`,
        moduleName,
        description: `Extract technical documentation and business flow for ${moduleName} capability module.`,
        relatedNodes,
        relatedFiles,
        estimatedComplexity,
        priority: priorityMap.get(moduleName) || 1,
        dependencies: deps,
      });
    }

    // Sort tasks by priority (lowest number = highest priority)
    tasks.sort((a, b) => a.priority - b.priority);

    return {
      repoPath,
      tasks,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Extracts core business capability name from symbol name (e.g. InvoiceController -> Invoice)
   */
  private extractCapabilityName(nodeName: string): string {
    const stripped = nodeName.replace(ModulePlanner.TECH_NOISE_REGEX, '');
    if (stripped.length > 0) {
      return stripped;
    }
    return nodeName;
  }

  /**
   * Calculates priority based on dependency depth (0 dependencies = priority 1)
   */
  private calculatePriorities(dependencies: Map<string, Set<string>>): Map<string, number> {
    const priorityMap = new Map<string, number>();

    const getDepth = (modName: string, visited = new Set<string>()): number => {
      if (visited.has(modName)) return 1; // Cycle safeguard
      visited.add(modName);

      const deps = dependencies.get(modName);
      if (!deps || deps.size === 0) return 1;

      let maxDepDepth = 0;
      for (const dep of deps) {
        maxDepDepth = Math.max(maxDepDepth, getDepth(dep, new Set(visited)));
      }
      return maxDepDepth + 1;
    };

    for (const modName of dependencies.keys()) {
      priorityMap.set(modName, getDepth(modName));
    }

    return priorityMap;
  }
}
