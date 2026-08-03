import { KnowledgeGraph, GraphProvider } from '../types/index.js';

export interface Analyzer extends GraphProvider {
  analyze(repoPath: string): Promise<KnowledgeGraph>;
}

/**
 * Mock GraphProvider implementation for testing & offline planning
 */
export class MockGraphProvider implements GraphProvider {
  async getKnowledgeGraph(_repoPath: string): Promise<KnowledgeGraph> {
    return {
      nodes: [
        // Invoice domain
        { id: 'node_1', name: 'InvoiceController', type: 'class', filePath: 'src/controllers/InvoiceController.ts' },
        { id: 'node_2', name: 'InvoiceService', type: 'class', filePath: 'src/services/InvoiceService.ts' },
        { id: 'node_3', name: 'InvoiceRepository', type: 'class', filePath: 'src/repositories/InvoiceRepository.ts' },
        { id: 'node_4', name: 'CalculateTax', type: 'function', filePath: 'src/utils/TaxCalculator.ts' },
        
        // Inventory domain
        { id: 'node_5', name: 'InventoryController', type: 'class', filePath: 'src/controllers/InventoryController.ts' },
        { id: 'node_6', name: 'InventoryService', type: 'class', filePath: 'src/services/InventoryService.ts' },
        { id: 'node_7', name: 'StockChecker', type: 'function', filePath: 'src/helpers/StockChecker.ts' },

        // Buyback domain
        { id: 'node_8', name: 'BuybackService', type: 'class', filePath: 'src/services/BuybackService.ts' },
        { id: 'node_9', name: 'BuybackEvaluator', type: 'class', filePath: 'src/evaluators/BuybackEvaluator.ts' },
      ],
      edges: [
        // Invoice connections
        { source: 'node_1', target: 'node_2', relationship: 'calls' },
        { source: 'node_2', target: 'node_3', relationship: 'uses' },
        { source: 'node_2', target: 'node_4', relationship: 'calls' },

        // Inventory connections
        { source: 'node_5', target: 'node_6', relationship: 'calls' },
        { source: 'node_6', target: 'node_7', relationship: 'uses' },

        // Cross-domain dependency: InvoiceService calls InventoryService
        { source: 'node_2', target: 'node_6', relationship: 'depends_on' },

        // Cross-domain dependency: BuybackService uses InventoryService & InvoiceService
        { source: 'node_8', target: 'node_9', relationship: 'calls' },
        { source: 'node_8', target: 'node_6', relationship: 'uses' },
        { source: 'node_8', target: 'node_2', relationship: 'uses' },
      ],
    };
  }
}

/**
 * Placeholder CodebaseMemoryProvider
 * Will connect to Codebase Memory MCP graph search/query API
 */
export class CodebaseMemoryProvider implements GraphProvider {
  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    console.log(`[CodebaseMemoryProvider] Connecting to Codebase Memory MCP for repository: ${repoPath}...`);
    // Placeholder: Will call MCP search_graph / query_graph tools to extract AST graph
    return {
      nodes: [],
      edges: [],
    };
  }
}

/**
 * High-level Analyzer wrapper that accepts any GraphProvider implementation
 */
export class CodebaseAnalyzer implements Analyzer {
  private provider: GraphProvider;

  constructor(provider: GraphProvider = new MockGraphProvider()) {
    this.provider = provider;
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    return this.provider.getKnowledgeGraph(repoPath);
  }

  async analyze(repoPath: string): Promise<KnowledgeGraph> {
    return this.getKnowledgeGraph(repoPath);
  }
}
