import { KnowledgeGraph, GraphProvider } from '../types/index.js';
import { LocalGraphProvider } from './localGraphProvider.js';

export { LocalGraphProvider };

export interface Analyzer extends GraphProvider {
  analyze(repoPath: string): Promise<KnowledgeGraph>;
}

/**
 * High-level Codebase Analyzer powered by built-in AST parser (zero external dependency).
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
    return this.provider.getKnowledgeGraph(repoPath);
  }

  async analyze(repoPath: string): Promise<KnowledgeGraph> {
    return this.getKnowledgeGraph(repoPath);
  }
}
