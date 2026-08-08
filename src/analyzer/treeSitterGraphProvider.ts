import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';
import { Parser, Language, Node } from 'web-tree-sitter';
import { GraphEdge, GraphNode, GraphProvider, KnowledgeGraph } from '../types/index.js';

interface SymbolDefinition {
  id: string;
  name: string;
  type: string;
  filePath: string;
}

export class TreeSitterGraphProvider implements GraphProvider {
  private ignoredDirs = new Set(['.git', 'node_modules', 'dist', '.nexus', '.agents', 'build', 'coverage', 'export']);
  private languageCache = new Map<string, Language>();
  private wasmDir: string = '';
  private initialized = false;

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

  private async ensureInitialized() {
    if (this.initialized) return;

    // Resolve WASM directory path
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const distWasmRoot = path.join(currentDir, '../wasm');
    const devWasmRoot = path.join(currentDir, '../../node_modules/tree-sitter-wasms/out');
    const webTreeSitterDevWasm = path.join(currentDir, '../../node_modules/web-tree-sitter/web-tree-sitter.wasm');

    let mainWasmPath = path.join(distWasmRoot, 'tree-sitter.wasm');
    this.wasmDir = distWasmRoot;

    // Check if dist/wasm/tree-sitter.wasm exists (packaged prod mode)
    if (!fsSync.existsSync(mainWasmPath)) {
      this.wasmDir = devWasmRoot;
      mainWasmPath = webTreeSitterDevWasm;
    }

    try {
      await Parser.init({
        locateFile(scriptName: string) {
          if (scriptName === 'tree-sitter.wasm') {
            return mainWasmPath;
          }
          return scriptName;
        }
      });
      this.initialized = true;
    } catch (err) {
      console.error('[TreeSitterGraphProvider] Failed to initialize web-tree-sitter core:', err);
      throw err;
    }
  }

  private async loadLanguage(ext: string): Promise<Language | null> {
    await this.ensureInitialized();

    const langName = this.getLanguageNameForExt(ext);
    if (!langName) return null;

    if (this.languageCache.has(langName)) {
      return this.languageCache.get(langName)!;
    }

    const wasmFileName = `tree-sitter-${langName}.wasm`;
    const wasmPath = path.join(this.wasmDir, wasmFileName);

    try {
      const language = await Language.load(wasmPath);
      this.languageCache.set(langName, language);
      return language;
    } catch (err) {
      console.warn(`[TreeSitterGraphProvider] Failed to load WASM grammar for ${langName} at ${wasmPath}:`, err);
      return null;
    }
  }

  private getLanguageNameForExt(ext: string): string | null {
    switch (ext) {
      case '.ts':
        return 'typescript';
      case '.tsx':
        return 'tsx';
      case '.js':
      case '.jsx':
      case '.mjs':
      case '.cjs':
        return 'javascript';
      case '.go':
        return 'go';
      case '.php':
        return 'php';
      case '.py':
        return 'python';
      case '.java':
        return 'java';
      case '.rs':
        return 'rust';
      case '.rb':
        return 'ruby';
      case '.c':
      case '.h':
        return 'c';
      case '.cpp':
      case '.cc':
      case '.hpp':
        return 'cpp';
      case '.cs':
        return 'c_sharp';
      default:
        return null;
    }
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
      // Ignore read errors, generate fresh
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

    // Update projects registry
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

  private async walkDir(dir: string): Promise<string[]> {
    const files: string[] = [];
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (this.ignoredDirs.has(entry.name) || entry.name.startsWith('.') || entry.name.startsWith('output-') || entry.name.startsWith('test-')) {
          continue;
        }
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const subFiles = await this.walkDir(res);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (this.getLanguageNameForExt(ext)) {
            files.push(res);
          }
        }
      }
    } catch {
      // Ignore unreadable
    }
    return files;
  }

  public async buildKnowledgeGraphFromAST(repoPath: string): Promise<KnowledgeGraph> {
    await this.ensureInitialized();

    const absRoot = path.resolve(repoPath);
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const nodeMap = new Map<string, GraphNode>();

    const allFiles = await this.walkDir(absRoot);
    const parser = new Parser();

    // Map: relativePath -> package/namespace/module details
    const fileImports = new Map<string, Map<string, string>>();
    const fileDefinitions = new Map<string, SymbolDefinition[]>();
    const pendingCalls: Array<{ sourceContextNodeId: string; filePath: string; callee: string; object?: string }> = [];

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
      const ext = path.extname(fileAbsPath).toLowerCase();

      const lang = await this.loadLanguage(ext);
      if (!lang) continue;

      parser.setLanguage(lang);

      const fileNode: GraphNode = {
        id: fileNodeId,
        name: path.basename(fileAbsPath),
        type: 'File',
        filePath: relPath,
      };

      nodes.push(fileNode);
      nodeMap.set(fileNodeId, fileNode);

      edges.push({
        source: rootNode.id,
        target: fileNodeId,
        relationship: 'CONTAINS_FILE',
      });

      try {
        const content = await fs.readFile(fileAbsPath, 'utf-8');
        const tree = parser.parse(content);
        if (!tree) continue;

        const imports = new Map<string, string>();
        const definitions: SymbolDefinition[] = [];

        let currentClassName = '';

        const walk = (node: Node) => {
          const type = node.type;

          // Class/Struct/Interface declarations
          if (type === 'class_declaration' || type === 'class_definition' || type === 'class') {
            const nameNode = node.childForFieldName('name') || node.children.find((c: Node) => c.type === 'identifier');
            if (nameNode) {
              const className = nameNode.text;
              currentClassName = className;

              const classNodeId = `${relPath}#class#${className}`;
              const classNode: GraphNode = {
                id: classNodeId,
                name: className,
                type: 'Class',
                filePath: relPath,
              };

              if (!nodeMap.has(classNodeId)) {
                nodes.push(classNode);
                nodeMap.set(classNodeId, classNode);
                edges.push({
                  source: fileNodeId,
                  target: classNodeId,
                  relationship: 'DEFINES',
                });
                definitions.push({
                  id: classNodeId,
                  name: className,
                  type: 'Class',
                  filePath: relPath,
                });
              }
            }
          }

          if (type === 'interface_declaration') {
            const nameNode = node.childForFieldName('name') || node.children.find((c: Node) => c.type === 'identifier');
            if (nameNode) {
              const name = nameNode.text;
              const interfaceNodeId = `${relPath}#interface#${name}`;
              const interfaceNode: GraphNode = {
                id: interfaceNodeId,
                name,
                type: 'Interface',
                filePath: relPath,
              };

              if (!nodeMap.has(interfaceNodeId)) {
                nodes.push(interfaceNode);
                nodeMap.set(interfaceNodeId, interfaceNode);
                edges.push({
                  source: fileNodeId,
                  target: interfaceNodeId,
                  relationship: 'DEFINES',
                });
                definitions.push({
                  id: interfaceNodeId,
                  name,
                  type: 'Interface',
                  filePath: relPath,
                });
              }
            }
          }

          // Function/Method declarations
          if (type === 'function_declaration' || type === 'function_definition' || type === 'function') {
            const nameNode = node.childForFieldName('name') || node.children.find((c: Node) => c.type === 'identifier');
            if (nameNode) {
              const name = nameNode.text;
              const funcNodeId = `${relPath}#func#${name}`;
              const funcNode: GraphNode = {
                id: funcNodeId,
                name,
                type: 'Function',
                filePath: relPath,
              };

              if (!nodeMap.has(funcNodeId)) {
                nodes.push(funcNode);
                nodeMap.set(funcNodeId, funcNode);
                edges.push({
                  source: fileNodeId,
                  target: funcNodeId,
                  relationship: 'DEFINES',
                });
                definitions.push({
                  id: funcNodeId,
                  name,
                  type: 'Function',
                  filePath: relPath,
                });
              }
            }
          }

          if (type === 'method_definition' || type === 'method_declaration') {
            const nameNode = node.childForFieldName('name') || node.children.find((c: Node) => c.type === 'identifier');
            if (nameNode) {
              const name = nameNode.text;
              const className = currentClassName || 'Class';
              const methodNodeId = `${relPath}#method#${className}.${name}`;
              const methodNode: GraphNode = {
                id: methodNodeId,
                name: `${className}.${name}`,
                type: 'Function',
                filePath: relPath,
              };

              if (!nodeMap.has(methodNodeId)) {
                nodes.push(methodNode);
                nodeMap.set(methodNodeId, methodNode);
                const classNodeId = `${relPath}#class#${className}`;
                edges.push({
                  source: nodeMap.has(classNodeId) ? classNodeId : fileNodeId,
                  target: methodNodeId,
                  relationship: 'DEFINES',
                });
                definitions.push({
                  id: methodNodeId,
                  name: `${className}.${name}`,
                  type: 'Function',
                  filePath: relPath,
                });
              }
            }
          }

          // Imports parsing (TS/JS specific)
          if (type === 'import_declaration') {
            const sourceNode = node.childForFieldName('source');
            if (sourceNode) {
              const importStr = sourceNode.text.replace(/['"]/g, '');
              // Match named/default imports
              const identifiers = node.descendantsOfType('identifier');
              for (const idNode of identifiers) {
                if (idNode.text !== 'import' && idNode.text !== 'from') {
                  imports.set(idNode.text, importStr);
                }
              }
            }
          }

          // Invocations / Calls
          if (type === 'call_expression' || type === 'function_call_expression' || type === 'member_call_expression') {
            const calleeNode = node.childForFieldName('function') || node.children[0];
            if (calleeNode) {
              if (calleeNode.type === 'identifier') {
                const calleeName = calleeNode.text;
                if (!['log', 'error', 'push', 'join', 'map', 'filter', 'slice', 'resolve', 'require', 'stringify', 'parse'].includes(calleeName)) {
                  pendingCalls.push({
                    sourceContextNodeId: fileNodeId,
                    filePath: relPath,
                    callee: calleeName,
                  });
                }
              } else if (calleeNode.type === 'member_expression' || calleeNode.type === 'property_access_expression') {
                const objNode = calleeNode.childForFieldName('object') || calleeNode.children[0];
                const propNode = calleeNode.childForFieldName('property') || calleeNode.children[2];
                if (objNode && propNode && propNode.type === 'identifier') {
                  const objName = objNode.text;
                  const calleeName = propNode.text;
                  if (!['log', 'error', 'push', 'join', 'map', 'filter', 'slice', 'resolve', 'stringify', 'parse'].includes(calleeName)) {
                    pendingCalls.push({
                      sourceContextNodeId: fileNodeId,
                      filePath: relPath,
                      callee: calleeName,
                      object: objName,
                    });
                  }
                }
              }
            }
          }

          // Walk children
          for (const child of node.children) {
            walk(child);
          }

          // Reset class name when class node finishes
          if (type === 'class_declaration' || type === 'class_definition' || type === 'class') {
            currentClassName = '';
          }
        };

        walk(tree.rootNode);

        fileImports.set(relPath, imports);
        fileDefinitions.set(relPath, definitions);
      } catch (err) {
        console.warn(`[TreeSitterGraphProvider] Skipped file due to parse error: ${relPath}`, err);
      }
    }

    // Resolve Pending Calls to targets (Cross-file Reference Resolution)
    for (const call of pendingCalls) {
      let resolved = false;

      // 1. Resolve local functions/methods first
      const localDefs = fileDefinitions.get(call.filePath) || [];
      if (call.object) {
        // Method call on object: e.g. analyzer.indexRepository()
        const matchingMethod = localDefs.find(
          d => d.type === 'Function' && d.name.endsWith(`.${call.callee}`)
        );
        if (matchingMethod) {
          edges.push({ source: call.sourceContextNodeId, target: matchingMethod.id, relationship: 'CALLS' });
          resolved = true;
        }
      } else {
        // Direct function call
        const matchingFunc = localDefs.find(
          d => d.type === 'Function' && d.name === call.callee
        );
        if (matchingFunc) {
          edges.push({ source: call.sourceContextNodeId, target: matchingFunc.id, relationship: 'CALLS' });
          resolved = true;
        }
      }

      if (resolved) continue;

      // 2. Resolve via Imports mapping
      const imports = fileImports.get(call.filePath);
      if (imports) {
        // Determine symbol name we are looking for
        const targetSymbol = call.object || call.callee;
        const importPathVal = imports.get(targetSymbol);

        if (importPathVal) {
          // Resolve relative path to imports
          const fileDir = path.dirname(call.filePath);
          const rawImportPath = path.join(fileDir, importPathVal);

          // Find actual file matching import in the workspace
          const matchFile = allFiles.map(f => path.relative(absRoot, f)).find(f => {
            const fNoExt = f.substring(0, f.lastIndexOf('.')) || f;
            return fNoExt === rawImportPath || fNoExt === rawImportPath + '/index';
          });

          if (matchFile) {
            const importedDefs = fileDefinitions.get(matchFile) || [];

            if (call.object) {
              // Target is a method on an imported class or object
              // Check if class matching targetSymbol exists, and if it defines the method
              const classDef = importedDefs.find(d => d.type === 'Class' && d.name === call.object);
              if (classDef) {
                const methodDef = importedDefs.find(
                  d => d.type === 'Function' && d.name === `${call.object}.${call.callee}`
                );
                if (methodDef) {
                  edges.push({ source: call.sourceContextNodeId, target: methodDef.id, relationship: 'CALLS' });
                  resolved = true;
                }
              }
            } else {
              // Direct imported function
              const funcDef = importedDefs.find(d => d.type === 'Function' && d.name === call.callee);
              if (funcDef) {
                edges.push({ source: call.sourceContextNodeId, target: funcDef.id, relationship: 'CALLS' });
                resolved = true;
              }
            }
          }
        }
      }

      if (resolved) continue;

      // 3. Fallback: Search globally for unique symbol if not resolved
      if (!call.object) {
        let globalMatch: SymbolDefinition | null = null;
        let matchCount = 0;

        for (const [_, defs] of fileDefinitions.entries()) {
          for (const def of defs) {
            if (def.type === 'Function' && def.name === call.callee) {
              globalMatch = def;
              matchCount++;
            }
          }
        }

        if (matchCount === 1 && globalMatch) {
          // If unique globally, link to it
          edges.push({ source: call.sourceContextNodeId, target: globalMatch.id, relationship: 'CALLS' });
        }
      }
    }

    return { nodes, edges };
  }
}
