import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import ts from 'typescript';
import { GraphEdge, GraphNode, GraphProvider, KnowledgeGraph } from '../types/index.js';

export class LocalGraphProvider implements GraphProvider {
  private ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.nexus', '.agents', 'build', 'coverage']);

  async indexRepository(_repoPath: string): Promise<void> {
    // No-op for built-in analyzer: AST indexing happens dynamically on-demand
  }

  async getKnowledgeGraph(repoPath: string): Promise<KnowledgeGraph> {
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

      // 2. Parse TypeScript/JavaScript AST
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
      }
    }

    return { nodes, edges };
  }

  private async walkDir(dir: string): Promise<string[]> {
    const files: string[] = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (this.ignoredDirs.has(entry.name) || entry.name.startsWith('output-') || entry.name.startsWith('test-')) {
          continue;
        }
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const subFiles = await this.walkDir(res);
          files.push(...subFiles);
        } else {
          files.push(res);
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
}
