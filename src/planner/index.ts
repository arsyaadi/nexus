import * as path from 'node:path';
import { KnowledgeGraph, ExecutionPlan, ModuleTask, GraphNode, GraphEdge, GraphProvider } from '../types/index.js';
import { E2EFlowGenerator, E2EFlowOutput } from './e2eFlowGenerator.js';

export { E2EFlowGenerator, E2EFlowOutput };

export interface Planner {
  createPlanFromProvider(provider: GraphProvider, repoPath: string): Promise<ExecutionPlan>;
  createPlan(graph: KnowledgeGraph, repoPath: string): Promise<ExecutionPlan>;
}

export class ModulePlanner implements Planner {
  // Suffixes/prefixes to strip to isolate core business/technical capability
  private static TECH_NOISE_REGEX = /(Controller|Service|Repository|Evaluator|Calculator|Checker|Manager|Helper|Util|Handler|Dto|Model|View|Api|Provider|Adapter|Executor|Generator|Orchestrator|Writer|Exporter)$/i;

  async createPlanFromProvider(provider: GraphProvider, repoPath: string): Promise<ExecutionPlan> {
    const graph = await provider.getKnowledgeGraph(repoPath);
    return this.createPlan(graph, repoPath);
  }

  async createPlan(graph: KnowledgeGraph, repoPath: string): Promise<ExecutionPlan> {
    const nodeToModuleMap = new Map<string, string>();
    const modulesMap = new Map<string, { nodes: GraphNode[]; files: Set<string> }>();

    // Step 1: Group nodes into high-level business capability modules based on domain/folder structure
    for (const node of graph.nodes) {
      // Ignore root folder node itself
      if (node.type === 'Folder') continue;

      const moduleName = this.extractCapabilityName(node);
      if (!moduleName) continue;

      nodeToModuleMap.set(node.id, moduleName);

      if (!modulesMap.has(moduleName)) {
        modulesMap.set(moduleName, { nodes: [], files: new Set<string>() });
      }

      const mod = modulesMap.get(moduleName)!;
      mod.nodes.push(node);
      if (node.filePath) {
        mod.files.add(node.filePath);
      }
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
   * Extracts core logical capability module name from node and file path
   */
  private extractCapabilityName(node: GraphNode): string {
    const filePath = node.filePath || '';
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath).toLowerCase();

    // Skip non-code configuration and documentation files
    if (['.json', '.md', '.lock', '.yml', '.yaml', '.gitignore'].includes(ext) || basename.startsWith('.')) {
      return '';
    }

    const parts = filePath.split(/[/\\]+/).filter(Boolean);

    // Heuristic 1: Subdirectory in src/ or lib/ or pkg/ or app/
    const rootDirIndex = parts.findIndex((p) => ['src', 'lib', 'pkg', 'app', 'internal', 'modules'].includes(p));
    if (rootDirIndex !== -1 && rootDirIndex + 1 < parts.length - 1) {
      const folder = parts[rootDirIndex + 1];
      return this.formatModuleName(folder);
    }

    // Heuristic 2: Subdirectory in target repo
    if (parts.length >= 2) {
      const folder = parts[parts.length - 2];
      if (!['src', 'lib', 'pkg', 'app', 'internal', 'modules', 'dist', 'build'].includes(folder)) {
        return this.formatModuleName(folder);
      }
    }

    // Heuristic 3: Symbol or File basename stripped of technical suffixes
    const nameWithoutExt = path.basename(node.name, path.extname(node.name));
    const stripped = nameWithoutExt.replace(ModulePlanner.TECH_NOISE_REGEX, '');
    const candidate = stripped.length > 0 ? stripped : nameWithoutExt;
    return this.formatModuleName(candidate);
  }

  private formatModuleName(name: string): string {
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean === 'mcp') return 'MCP';
    if (clean.length === 0) return 'Core';
    return name.charAt(0).toUpperCase() + name.slice(1);
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

