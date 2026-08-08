import { KnowledgeGraph, GraphProvider } from '../types/index.js';
import { LocalGraphProvider } from './localGraphProvider.js';
import { SqliteGraphProvider } from './sqliteGraphProvider.js';
import { LadybugGraphProvider } from './ladybugGraphProvider.js';

export { LocalGraphProvider, SqliteGraphProvider, LadybugGraphProvider };

export interface Analyzer extends GraphProvider {
  analyze(repoPath: string): Promise<KnowledgeGraph>;
}

/**
 * High-level Codebase Analyzer with LadybugGraphProvider primary & SqliteGraphProvider fallback.
 */
export class CodebaseAnalyzer implements Analyzer {
  private provider: GraphProvider;

  constructor(provider: GraphProvider = new LadybugGraphProvider()) {
    this.provider = provider;
  }

  async indexRepository(repoPath: string): Promise<void> {
    try {
      if (this.provider.indexRepository) {
        await this.provider.indexRepository(repoPath);
      }
    } catch (err) {
      if (!(this.provider instanceof SqliteGraphProvider)) {
        console.warn('[CodebaseAnalyzer] Primary provider indexing failed, falling back to SqliteGraphProvider:', err);
        const fallback = new SqliteGraphProvider();
        if (fallback.indexRepository) {
          await fallback.indexRepository(repoPath);
        }
      } else {
        throw err;
      }
    }
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    try {
      return await this.provider.getKnowledgeGraph(repoPath);
    } catch (err) {
      if (!(this.provider instanceof SqliteGraphProvider)) {
        console.warn('[CodebaseAnalyzer] Primary provider getKnowledgeGraph failed, falling back to SqliteGraphProvider:', err);
        const fallback = new SqliteGraphProvider();
        return fallback.getKnowledgeGraph(repoPath);
      }
      throw err;
    }
  }

  async analyze(repoPath: string): Promise<KnowledgeGraph> {
    return this.getKnowledgeGraph(repoPath);
  }
}
