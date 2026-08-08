import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { GraphEdge, GraphNode, GraphProvider, KnowledgeGraph } from '../types/index.js';
import { LocalGraphProvider } from './localGraphProvider.js';

export class SqliteGraphProvider implements GraphProvider {
  private fallbackProvider = new LocalGraphProvider();

  private getGlobalNexusDir(): string {
    return path.join(os.homedir(), '.nexus');
  }

  private getGraphsDir(): string {
    return path.join(this.getGlobalNexusDir(), 'graphs');
  }

  private getProjectsRegistryPath(): string {
    return path.join(this.getGlobalNexusDir(), 'projects.json');
  }

  private getProjectKey(repoPath: string): { absRoot: string; projectName: string; hash: string; dbPath: string; dbName: string } {
    const absRoot = path.resolve(repoPath);
    const hash = crypto.createHash('sha256').update(absRoot).digest('hex').slice(0, 12);
    const rawName = path.basename(absRoot) || 'root';
    const projectName = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const dbName = `${projectName}_${hash}.sqlite`;
    const dbPath = path.join(this.getGraphsDir(), dbName);
    return { absRoot, projectName, hash, dbPath, dbName };
  }

  async indexRepository(repoPath: string): Promise<void> {
    const { absRoot, projectName, hash, dbPath, dbName } = this.getProjectKey(repoPath);
    await fs.mkdir(this.getGraphsDir(), { recursive: true });

    // Build AST KnowledgeGraph directly from AST parser
    const astGraph = await this.fallbackProvider.buildKnowledgeGraphFromAST(repoPath);

    // Initialize SQLite Database via Node native sqlite module
    const db = new DatabaseSync(dbPath);

    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS nodes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          filePath TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS edges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          source_id TEXT NOT NULL,
          target_id TEXT NOT NULL,
          relationship TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source_id);
        CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target_id);
        CREATE INDEX IF NOT EXISTS idx_edges_rel ON edges(relationship);
      `);

      // Begin Transaction
      db.exec('BEGIN TRANSACTION;');
      db.exec('DELETE FROM edges;');
      db.exec('DELETE FROM nodes;');

      const insertNodeStmt = db.prepare('INSERT OR REPLACE INTO nodes (id, name, type, filePath) VALUES (?, ?, ?, ?)');
      for (const node of astGraph.nodes) {
        insertNodeStmt.run(node.id, node.name, node.type, node.filePath || '');
      }

      const insertEdgeStmt = db.prepare('INSERT INTO edges (source_id, target_id, relationship) VALUES (?, ?, ?)');
      for (const edge of astGraph.edges) {
        insertNodeStmt.run(edge.target, edge.target, 'External', '');
        insertEdgeStmt.run(edge.source, edge.target, edge.relationship);
      }

      db.exec('COMMIT;');
    } catch (err) {
      try {
        db.exec('ROLLBACK;');
      } catch {
        // Ignore rollback failure
      }
      throw err;
    } finally {
      db.close();
    }

    // Update global project registry
    await this.updateProjectsRegistry({
      repoPath: absRoot,
      projectName,
      hash,
      graphFile: dbName,
      nodeCount: astGraph.nodes.length,
      edgeCount: astGraph.edges.length,
      lastIndexedAt: new Date().toISOString(),
      engine: 'sqlite',
    });
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    const { dbPath } = this.getProjectKey(repoPath);

    try {
      await fs.access(dbPath);
    } catch {
      await this.indexRepository(repoPath);
    }

    let db: DatabaseSync;
    try {
      db = new DatabaseSync(dbPath);
    } catch {
      return this.fallbackProvider.getKnowledgeGraph(repoPath);
    }

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    try {
      const nodeStmt = db.prepare('SELECT id, name, type, filePath FROM nodes');
      const nodeRows = nodeStmt.all() as Array<{ id: string; name: string; type: string; filePath: string }>;
      for (const row of nodeRows) {
        nodes.push({
          id: row.id,
          name: row.name,
          type: row.type as any,
          filePath: row.filePath,
        });
      }

      const edgeStmt = db.prepare('SELECT source_id, target_id, relationship FROM edges');
      const edgeRows = edgeStmt.all() as Array<{ source_id: string; target_id: string; relationship: string }>;
      for (const row of edgeRows) {
        edges.push({
          source: row.source_id,
          target: row.target_id,
          relationship: row.relationship as any,
        });
      }
    } catch {
      return this.fallbackProvider.getKnowledgeGraph(repoPath);
    } finally {
      db.close();
    }

    return { nodes, edges };
  }

  private async updateProjectsRegistry(entry: any): Promise<void> {
    const registryPath = this.getProjectsRegistryPath();
    let projects: any[] = [];

    try {
      const content = await fs.readFile(registryPath, 'utf-8');
      projects = JSON.parse(content);
      if (!Array.isArray(projects)) {
        projects = [];
      }
    } catch {
      projects = [];
    }

    const idx = projects.findIndex((p) => p.repoPath === entry.repoPath);
    if (idx !== -1) {
      projects[idx] = entry;
    } else {
      projects.push(entry);
    }

    await fs.writeFile(registryPath, JSON.stringify(projects, null, 2), 'utf-8');
  }
}
