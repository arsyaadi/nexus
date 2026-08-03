import { KnowledgeGraph, GraphProvider } from '../types/index.js';
import { CodebaseMemoryProvider } from './codebaseMemoryProvider.js';

export { CodebaseMemoryProvider };

export interface Analyzer extends GraphProvider {
  analyze(repoPath: string): Promise<KnowledgeGraph>;
}

/**
 * High-level Analyzer wrapper that accepts any GraphProvider implementation
 */
export class CodebaseAnalyzer implements Analyzer {
  private provider: GraphProvider;

  constructor(provider: GraphProvider = new CodebaseMemoryProvider()) {
    this.provider = provider;
  }

  async indexRepository(repoPath: string): Promise<void> {
    if (this.provider.indexRepository) {
      await this.provider.indexRepository(repoPath);
    }
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    return this.provider.getKnowledgeGraph(repoPath);
  }

  async analyze(repoPath: string): Promise<KnowledgeGraph> {
    return this.getKnowledgeGraph(repoPath);
  }
}
