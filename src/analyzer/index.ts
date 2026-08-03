import { KnowledgeGraph, GraphProvider } from '../types/index.js';
import { LocalGraphProvider } from './localGraphProvider.js';
import { CodebaseMemoryProvider } from './codebaseMemoryProvider.js';

export { LocalGraphProvider, CodebaseMemoryProvider };

export interface Analyzer extends GraphProvider {
  analyze(repoPath: string): Promise<KnowledgeGraph>;
}

/**
 * High-level Analyzer wrapper that defaults to built-in LocalGraphProvider (zero external dependency).
 */
export class CodebaseAnalyzer implements Analyzer {
  private provider: GraphProvider;

  constructor(provider: GraphProvider = new LocalGraphProvider()) {
    this.provider = provider;
  }

  async indexRepository(repoPath: string): Promise<void> {
    if (this.provider.indexRepository) {
      await this.provider.indexRepository(repoPath);
    }
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    try {
      return await this.provider.getKnowledgeGraph(repoPath);
    } catch (err) {
      // Fallback to LocalGraphProvider if external provider fails
      if (!(this.provider instanceof LocalGraphProvider)) {
        console.warn('[CodebaseAnalyzer] External provider failed, falling back to built-in LocalGraphProvider:', err);
        const fallback = new LocalGraphProvider();
        return fallback.getKnowledgeGraph(repoPath);
      }
      throw err;
    }
  }

  async analyze(repoPath: string): Promise<KnowledgeGraph> {
    return this.getKnowledgeGraph(repoPath);
  }
}
