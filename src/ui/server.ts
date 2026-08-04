import * as http from 'node:http';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { fileURLToPath } from 'node:url';
import { CodebaseAnalyzer } from '../analyzer/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NexusUIServer {
  private port: number;

  constructor(port = 3333) {
    this.port = port;
  }

  async start(repoPath: string = '.'): Promise<void> {
    const defaultAbsPath = path.resolve(repoPath);
    const analyzer = new CodebaseAnalyzer();

    const server = http.createServer(async (req, res) => {
      const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const pathname = parsedUrl.pathname;

      // API: List all indexed projects in $HOME/.nexus/projects.json
      if (pathname === '/api/projects') {
        try {
          const registryPath = path.join(os.homedir(), '.nexus', 'projects.json');
          let projects: any[] = [];
          try {
            const content = await fs.readFile(registryPath, 'utf-8');
            projects = JSON.parse(content);
          } catch {
            projects = [];
          }

          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify(projects));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: String(err) }));
        }
        return;
      }

      // API: Get graph data for a specific project repo path or default
      if (pathname === '/api/graph') {
        try {
          const requestedPath = parsedUrl.searchParams.get('repo') || parsedUrl.searchParams.get('path') || defaultAbsPath;
          const targetAbsPath = path.resolve(requestedPath);
          const graph = await analyzer.getKnowledgeGraph(targetAbsPath);
          const projectName = path.basename(targetAbsPath) || 'Root';

          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ project: projectName, repoPath: targetAbsPath, nodes: graph.nodes, edges: graph.edges }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: String(err) }));
        }
        return;
      }

      // HTML Viewer
      if (pathname === '/' || pathname === '/index.html') {
        try {
          const htmlPath = path.join(__dirname, 'viewer.html');
          const htmlContent = await fs.readFile(htmlPath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(htmlContent);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Error loading viewer.html: ${String(err)}`);
        }
        return;
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    server.listen(this.port, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 Nexus Interactive Graph UI running on:`);
      console.log(`👉 http://localhost:${this.port}`);
      console.log(`==================================================\n`);
    });
  }
}
