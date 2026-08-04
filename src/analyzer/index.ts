import { KnowledgeGraph, GraphProvider } from '../types/index.js';
import { LocalGraphProvider } from './localGraphProvider.js';
import { KuzuGraphProvider } from './kuzuGraphProvider.js';
import { SqliteGraphProvider } from './sqliteGraphProvider.js';

export { LocalGraphProvider, KuzuGraphProvider, SqliteGraphProvider };

export interface Analyzer extends GraphProvider {
  analyze(repoPath: string): Promise<KnowledgeGraph>;
}

/**
 * High-level Codebase Analyzer powered by AST parser & SQLite Graph Engine ($HOME/.nexus).
 */
export class CodebaseAnalyzer implements Analyzer {
  private provider: GraphProvider;

  constructor(provider: GraphProvider = new SqliteGraphProvider()) {
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
