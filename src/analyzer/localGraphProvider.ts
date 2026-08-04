import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import ts from 'typescript';
import { GraphEdge, GraphNode, GraphProvider, KnowledgeGraph } from '../types/index.js';

export interface RegisteredProject {
  repoPath: string;
  projectName: string;
  hash: string;
  graphFile: string;
  nodeCount: number;
  edgeCount: number;
  lastIndexedAt: string;
}

export class LocalGraphProvider implements GraphProvider {
  private ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.nexus', '.agents', 'build', 'coverage']);

  private getGlobalNexusDir(): string {
    return path.join(os.homedir(), '.nexus');
  }

  private getGraphsDir(): string {
    return path.join(this.getGlobalNexusDir(), 'graphs');
  }

  private getProjectsRegistryPath(): string {
    return path.join(this.getGlobalNexusDir(), 'projects.json');
  }

  private getProjectKey(repoPath: string): { absRoot: string; projectName: string; hash: string; graphFilePath: string; graphFileName: string } {
    const absRoot = path.resolve(repoPath);
    const hash = crypto.createHash('sha256').update(absRoot).digest('hex').slice(0, 12);
    const rawName = path.basename(absRoot) || 'root';
    const projectName = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const graphFileName = `${projectName}_${hash}.json`;
    const graphFilePath = path.join(this.getGraphsDir(), graphFileName);
    return { absRoot, projectName, hash, graphFilePath, graphFileName };
  }

  async indexRepository(repoPath: string): Promise<void> {
    const graph = await this.buildKnowledgeGraphFromAST(repoPath);
    await this.saveGraphToGlobalStorage(repoPath, graph);
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
    const { graphFilePath } = this.getProjectKey(repoPath);
    try {
      const content = await fs.readFile(graphFilePath, 'utf-8');
      const graph = JSON.parse(content) as KnowledgeGraph;
      if (Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
        return graph;
      }
    } catch {
      // Not cached yet or unparseable, generate fresh and save
    }

    const graph = await this.buildKnowledgeGraphFromAST(repoPath);
    await this.saveGraphToGlobalStorage(repoPath, graph);
    return graph;
  }

  private async saveGraphToGlobalStorage(repoPath: string, graph: KnowledgeGraph): Promise<void> {
    const { absRoot, projectName, hash, graphFilePath, graphFileName } = this.getProjectKey(repoPath);
    const graphsDir = this.getGraphsDir();

    await fs.mkdir(graphsDir, { recursive: true });
    await fs.writeFile(graphFilePath, JSON.stringify(graph, null, 2), 'utf-8');

    // Update global projects registry
    await this.updateProjectsRegistry({
      repoPath: absRoot,
      projectName,
      hash,
      graphFile: graphFileName,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      lastIndexedAt: new Date().toISOString(),
    });
  }

  private async updateProjectsRegistry(entry: RegisteredProject): Promise<void> {
    const registryPath = this.getProjectsRegistryPath();
    let projects: RegisteredProject[] = [];

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

  public async buildKnowledgeGraphFromAST(repoPath: string): Promise<KnowledgeGraph> {
    const absRoot = path.resolve(repoPath);
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // 1. Traverse directory tree
    const allFiles = await this.walkDir(absRoot);

    // Add root folder node
    const rootNode: GraphNode = {
      id: absRoot,
      name: path.basename(absRoot) || 'root',
      type: 'Folder',
      filePath: absRoot,
    };
    nodes.push(rootNode);
    nodeMap.set(rootNode.id, rootNode);

    for (const fileAbsPath of allFiles) {
      const relPath = path.relative(absRoot, fileAbsPath);
      const fileNodeId = relPath;

      const fileNode: GraphNode = {
        id: fileNodeId,
        name: path.basename(fileAbsPath),
        type: 'File',
        filePath: relPath,
      };

      nodes.push(fileNode);
      nodeMap.set(fileNodeId, fileNode);

      // Edge: Root contains file
      edges.push({
        source: rootNode.id,
        target: fileNodeId,
        relationship: 'CONTAINS_FILE',
      });

      // 2. Parse Code AST
      const ext = path.extname(fileAbsPath).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(ext)) {
        try {
          const content = await fs.readFile(fileAbsPath, 'utf-8');
          const sourceFile = ts.createSourceFile(
            fileAbsPath,
            content,
            ts.ScriptTarget.Latest,
            true
          );

          this.parseAST(sourceFile, fileNodeId, relPath, nodes, edges, nodeMap);
        } catch {
          // Ignore unparseable files
        }
      } else if (['.go', '.py', '.java', '.kt', '.rs', '.php', '.cs', '.cpp', '.h', '.rb', '.swift'].includes(ext)) {
        try {
          const content = await fs.readFile(fileAbsPath, 'utf-8');
          this.parseRegexAST(content, ext, fileNodeId, relPath, nodes, edges, nodeMap);
        } catch {
          // Ignore unparseable files
        }
      }
    }

    return { nodes, edges };
  }

  private static ALLOWED_CODE_EXTENSIONS = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.go', '.py', '.java', '.kt', '.rs', '.php',
    '.c', '.cpp', '.cs', '.h', '.hpp', '.rb', '.swift'
  ]);

  private async walkDir(dir: string): Promise<string[]> {
    const files: string[] = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (this.ignoredDirs.has(entry.name) || entry.name.startsWith('output-') || entry.name.startsWith('test-') || entry.name.startsWith('.')) {
          continue;
        }
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const subFiles = await this.walkDir(res);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (LocalGraphProvider.ALLOWED_CODE_EXTENSIONS.has(ext)) {
            files.push(res);
          }
        }
      }
    } catch {
      // Ignore unreadable directories
    }
    return files;
  }

  private parseAST(
    sourceFile: ts.SourceFile,
    fileNodeId: string,
    relPath: string,
    nodes: GraphNode[],
    edges: GraphEdge[],
    nodeMap: Map<string, GraphNode>
  ): void {
    const visit = (node: ts.Node) => {
      // Class Declaration
      if (ts.isClassDeclaration(node) && node.name) {
        const name = node.name.text;
        const nodeId = `${relPath}#class#${name}`;
        const classNode: GraphNode = {
          id: nodeId,
          name,
          type: 'Class',
          filePath: relPath,
        };

        if (!nodeMap.has(nodeId)) {
          nodes.push(classNode);
          nodeMap.set(nodeId, classNode);
          edges.push({
            source: fileNodeId,
            target: nodeId,
            relationship: 'DEFINES',
          });
        }

        // Extends / Implements Heritage Clauses
        if (node.heritageClauses) {
          for (const heritage of node.heritageClauses) {
            for (const typeNode of heritage.types) {
              const targetName = typeNode.expression.getText(sourceFile);
              edges.push({
                source: nodeId,
                target: targetName,
                relationship: heritage.token === ts.SyntaxKind.ExtendsKeyword ? 'EXTENDS' : 'IMPLEMENTS',
              });
            }
          }
        }
      }

      // Interface Declaration
      if (ts.isInterfaceDeclaration(node) && node.name) {
        const name = node.name.text;
        const nodeId = `${relPath}#interface#${name}`;
        const interfaceNode: GraphNode = {
          id: nodeId,
          name,
          type: 'Interface',
          filePath: relPath,
        };

        if (!nodeMap.has(nodeId)) {
          nodes.push(interfaceNode);
          nodeMap.set(nodeId, interfaceNode);
          edges.push({
            source: fileNodeId,
            target: nodeId,
            relationship: 'DEFINES',
          });
        }
      }

      // Function Declaration
      if (ts.isFunctionDeclaration(node) && node.name) {
        const name = node.name.text;
        const nodeId = `${relPath}#func#${name}`;
        const funcNode: GraphNode = {
          id: nodeId,
          name,
          type: 'Function',
          filePath: relPath,
        };

        if (!nodeMap.has(nodeId)) {
          nodes.push(funcNode);
          nodeMap.set(nodeId, funcNode);
          edges.push({
            source: fileNodeId,
            target: nodeId,
            relationship: 'DEFINES',
          });
        }
      }

      // Method Declaration inside Class
      if (ts.isMethodDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
        const name = node.name.text;
        const parentClass = node.parent && ts.isClassDeclaration(node.parent) && node.parent.name ? node.parent.name.text : 'Class';
        const nodeId = `${relPath}#method#${parentClass}.${name}`;
        const methodNode: GraphNode = {
          id: nodeId,
          name: `${parentClass}.${name}`,
          type: 'Function',
          filePath: relPath,
        };

        if (!nodeMap.has(nodeId)) {
          nodes.push(methodNode);
          nodeMap.set(nodeId, methodNode);
          edges.push({
            source: `${relPath}#class#${parentClass}`,
            target: nodeId,
            relationship: 'DEFINES',
          });
        }
      }

      // Call Expressions (Function/Method invocation tracing)
      if (ts.isCallExpression(node)) {
        let calleeName = '';
        if (ts.isIdentifier(node.expression)) {
          calleeName = node.expression.text;
        } else if (ts.isPropertyAccessExpression(node.expression)) {
          calleeName = node.expression.name.text;
        }

        if (calleeName && !['log', 'error', 'push', 'join', 'map', 'filter', 'slice', 'resolve', 'stringify', 'parse'].includes(calleeName)) {
          edges.push({
            source: fileNodeId,
            target: calleeName,
            relationship: 'CALLS',
          });
        }
      }

      // Import Statement
      if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const importPath = node.moduleSpecifier.text;
        edges.push({
          source: fileNodeId,
          target: importPath,
          relationship: 'IMPORTS',
        });
      }

      ts.forEachChild(node, visit);
    };

    ts.forEachChild(sourceFile, visit);
  }

  private parseRegexAST(
    content: string,
    ext: string,
    fileNodeId: string,
    relPath: string,
    nodes: GraphNode[],
    edges: GraphEdge[],
    nodeMap: Map<string, GraphNode>
  ): void {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Go AST Parsing
      if (ext === '.go') {
        const structMatch = trimmed.match(/^type\s+([A-Za-z0-9_]+)\s+struct/);
        const funcMatch = trimmed.match(/^func\s+(?:\([^)]+\)\s+)?([A-Za-z0-9_]+)\s*\(/);
        const importMatch = trimmed.match(/^import\s+"([^"]+)"/) || trimmed.match(/^\s*"([^"]+)"/);

        if (structMatch) {
          this.addSymbolNode(structMatch[1], 'Class', relPath, fileNodeId, nodes, edges, nodeMap);
        } else if (funcMatch && funcMatch[1] !== 'main') {
          this.addSymbolNode(funcMatch[1], 'Function', relPath, fileNodeId, nodes, edges, nodeMap);
        } else if (importMatch) {
          edges.push({ source: fileNodeId, target: importMatch[1], relationship: 'IMPORTS' });
        }
      }

      // Python AST Parsing
      if (ext === '.py') {
        const classMatch = trimmed.match(/^class\s+([A-Za-z0-9_]+)/);
        const defMatch = trimmed.match(/^def\s+([A-Za-z0-9_]+)\s*\(/);
        const importMatch = trimmed.match(/^(?:from\s+([A-Za-z0-9_.]+)\s+)?import\s+([A-Za-z0-9_.]+)/);

        if (classMatch) {
          this.addSymbolNode(classMatch[1], 'Class', relPath, fileNodeId, nodes, edges, nodeMap);
        } else if (defMatch && !defMatch[1].startsWith('__')) {
          this.addSymbolNode(defMatch[1], 'Function', relPath, fileNodeId, nodes, edges, nodeMap);
        } else if (importMatch) {
          const imp = importMatch[1] || importMatch[2];
          edges.push({ source: fileNodeId, target: imp, relationship: 'IMPORTS' });
        }
      }

      // Java / PHP / C# / C++ / Rust AST Parsing
      if (['.java', '.kt', '.php', '.cs', '.cpp', '.rs', '.rb', '.swift'].includes(ext)) {
        const classMatch = trimmed.match(/(?:class|interface|struct|trait)\s+([A-Za-z0-9_]+)/);
        const funcMatch = trimmed.match(/(?:function|fn|def|public|private|protected)\s+(?:[A-Za-z0-9_<>\[\]]+\s+)?([A-Za-z0-9_]+)\s*\(/);

        if (classMatch) {
          const type = trimmed.includes('interface') ? 'Interface' : 'Class';
          this.addSymbolNode(classMatch[1], type, relPath, fileNodeId, nodes, edges, nodeMap);
        } else if (funcMatch && !['if', 'for', 'while', 'switch', 'catch'].includes(funcMatch[1])) {
          this.addSymbolNode(funcMatch[1], 'Function', relPath, fileNodeId, nodes, edges, nodeMap);
        }
      }
    }
  }

  private addSymbolNode(
    name: string,
    type: 'Class' | 'Interface' | 'Function',
    relPath: string,
    fileNodeId: string,
    nodes: GraphNode[],
    edges: GraphEdge[],
    nodeMap: Map<string, GraphNode>
  ): void {
    const nodeId = `${relPath}#${type.toLowerCase()}#${name}`;
    if (!nodeMap.has(nodeId)) {
      const symbolNode: GraphNode = { id: nodeId, name, type, filePath: relPath };
      nodes.push(symbolNode);
      nodeMap.set(nodeId, symbolNode);
      edges.push({ source: fileNodeId, target: nodeId, relationship: 'DEFINES' });
    }
  }
}

