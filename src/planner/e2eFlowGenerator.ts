import * as path from 'node:path';
import { KnowledgeGraph, GraphNode, GraphEdge } from '../types/index.js';

export interface E2EFlowOutput {
  title: string;
  masterMermaid: string;
  masterSequence: string;
  markdownContent: string;
}

export type ProjectCategory =
  | 'FRONTEND_WEB_APP'
  | 'REPORT_EXPORT_SERVICE'
  | 'REST_API_SERVICE'
  | 'AUTH_IDENTITY_SERVICE'
  | 'PAYMENT_BILLING_SERVICE'
  | 'CLI_SYSTEM_TOOL'
  | 'GENERIC_APPLICATION';

export interface ProjectAnalysis {
  category: ProjectCategory;
  categoryTitle: string;
  summaryText: string;
  catalogTitle: string;
  outputTerm: string;
}

export class E2EFlowGenerator {
  generate(graph: KnowledgeGraph, repoName: string = 'System'): E2EFlowOutput {
    const { nodes, edges } = graph;

    // Filter out root folder node & low-level raw string nodes
    const keyNodes = nodes.filter((n) => n.type !== 'Folder');
    const meaningfulEdges = edges.filter((e) => e.relationship !== 'CONTAINS_FILE');

    // Collect all file paths
    const allFiles = new Set<string>();
    keyNodes.forEach((node) => {
      if (node.filePath) {
        allFiles.add(node.filePath);
      }
    });
    const fileList = Array.from(allFiles);

    // 1. DYNAMIC PROJECT CLASSIFIER: Automatically discover what this project actually is
    const projectAnalysis = this.analyzeProjectDomain(keyNodes, fileList);

    // Group nodes into logical module subgraphs
    const moduleMap = new Map<string, { nodes: GraphNode[]; files: Set<string> }>();
    keyNodes.forEach((node) => {
      const modName = this.extractModuleName(node);
      if (!moduleMap.has(modName)) {
        moduleMap.set(modName, { nodes: [], files: new Set<string>() });
      }
      const item = moduleMap.get(modName)!;
      item.nodes.push(node);
      if (node.filePath) {
        item.files.add(node.filePath);
      }
    });

    // 2. Categorize modules into standard architectural layers
    const entrypointMods: string[] = [];
    const middlewareMods: string[] = [];
    const businessMods: string[] = [];
    const storageExportMods: string[] = [];

    moduleMap.forEach((data, modName) => {
      const role = this.determineLayerRole(modName, data.files);
      if (role === 'API / Entrypoint') {
        entrypointMods.push(modName);
      } else if (role === 'Middleware & Infra') {
        middlewareMods.push(modName);
      } else if (role === 'Database / Storage' || role === 'Export Engine / File Output') {
        storageExportMods.push(modName);
      } else {
        businessMods.push(modName);
      }
    });

    // 3. Build High-Level Master Mermaid Flowchart (TD)
    const flowchartLines: string[] = ['flowchart TD'];
    const nodeIdMap = new Map<string, string>();
    let nodeCounter = 1;

    moduleMap.forEach((data, moduleName) => {
      const cleanModuleName = moduleName.replace(/[^a-zA-Z0-9_]/g, '_');
      const layerRole = this.determineLayerRole(moduleName, data.files);
      flowchartLines.push(`    subgraph ${cleanModuleName}["${moduleName} (${layerRole})"]`);

      const topNodes = data.nodes
        .filter((n) => n.type !== 'External' && n.type !== 'Folder')
        .slice(0, 5);

      const nodesToDisplay = topNodes.length > 0 ? topNodes : data.nodes.slice(0, 3);

      nodesToDisplay.forEach((node) => {
        const cleanId = `N${nodeCounter++}`;
        nodeIdMap.set(node.id, cleanId);
        const displayName = path.basename(node.name, path.extname(node.name));
        const label = `${displayName} (${node.type})`;
        flowchartLines.push(`        ${cleanId}["${label}"]`);
      });

      flowchartLines.push(`    end`);
    });

    const addedEdges = new Set<string>();
    const flowEdges = meaningfulEdges.filter((e) => e.relationship !== 'IMPORTS');
    const edgesToRender = flowEdges.length > 0 ? flowEdges : meaningfulEdges;

    edgesToRender.forEach((edge) => {
      const sourceId = nodeIdMap.get(edge.source);
      const targetId = nodeIdMap.get(edge.target);

      if (sourceId && targetId && sourceId !== targetId) {
        const edgeKey = `${sourceId}->${targetId}`;
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          const rel = edge.relationship.replace(/_/g, ' ');
          flowchartLines.push(`    ${sourceId} -->|"${rel}"| ${targetId}`);
        }
      }
    });

    const masterMermaid = flowchartLines.join('\n');

    // 4. Build Realistic Architectural Master Mermaid Sequence Diagram
    const sequenceLines: string[] = [
      `sequenceDiagram`,
      `    autonumber`,
      `    actor Client as User / Client App`,
    ];

    const primaryEntry = entrypointMods[0] || 'Server';
    const primaryBiz = businessMods[0] || 'CoreService';
    const primaryExport = storageExportMods.find((m) => m.toLowerCase().includes('export')) || storageExportMods[0] || 'OutputEngine';
    const primaryStorage = storageExportMods.find((m) => !m.toLowerCase().includes('export')) || 'Storage';

    const entryAlias = primaryEntry.replace(/[^a-zA-Z0-9_]/g, '_');
    const bizAlias = primaryBiz.replace(/[^a-zA-Z0-9_]/g, '_');
    const exportAlias = primaryExport.replace(/[^a-zA-Z0-9_]/g, '_');
    const storageAlias = primaryStorage.replace(/[^a-zA-Z0-9_]/g, '_');

    sequenceLines.push(`    participant ${entryAlias} as ${primaryEntry} [API / Entrypoint]`);
    if (middlewareMods.length > 0) {
      const midAlias = middlewareMods[0].replace(/[^a-zA-Z0-9_]/g, '_');
      sequenceLines.push(`    participant ${midAlias} as ${middlewareMods[0]} [Middleware & Infra]`);
    }
    sequenceLines.push(`    participant ${bizAlias} as ${primaryBiz} [Core Business Engine]`);
    if (primaryStorage !== primaryExport) {
      sequenceLines.push(`    participant ${storageAlias} as ${primaryStorage} [Database / Storage]`);
    }
    sequenceLines.push(`    participant ${exportAlias} as ${primaryExport} [${projectAnalysis.outputTerm}]`);

    sequenceLines.push(``);
    sequenceLines.push(`    Client->>${entryAlias}: 1. Trigger Request / API Call`);
    if (middlewareMods.length > 0) {
      const midAlias = middlewareMods[0].replace(/[^a-zA-Z0-9_]/g, '_');
      sequenceLines.push(`    ${entryAlias}->>${midAlias}: 2. Validate Authentication & Request Middleware`);
      sequenceLines.push(`    ${midAlias}-->>${entryAlias}: 3. Context & Permission Approved`);
    }
    sequenceLines.push(`    ${entryAlias}->>${bizAlias}: 4. Forward Payload & Invoke Business Service`);
    if (primaryStorage !== primaryExport) {
      sequenceLines.push(`    ${bizAlias}->>${storageAlias}: 5. Query Domain Records / Data Store`);
      sequenceLines.push(`    ${storageAlias}-->>${bizAlias}: 6. Return Datasets / Records`);
    }
    sequenceLines.push(`    ${bizAlias}->>${exportAlias}: 7. Execute Domain Output Processing`);
    sequenceLines.push(`    ${exportAlias}-->>Client: 8. Deliver Final Output / ${projectAnalysis.outputTerm}`);

    const masterSequence = sequenceLines.join('\n');

    // 5. Dynamic Feature & Feature Catalog Extractor based on Project Category
    const featureCatalog = this.extractFeatureCatalog(fileList, projectAnalysis.category);

    // 6. Inter-Module Dependency Table Calculation
    const moduleDeps = new Map<string, Set<string>>();
    meaningfulEdges.forEach((edge) => {
      const sourceMod = this.findNodeModule(edge.source, keyNodes);
      const targetMod = this.findNodeModule(edge.target, keyNodes);
      if (sourceMod && targetMod && sourceMod !== targetMod) {
        if (!moduleDeps.has(sourceMod)) {
          moduleDeps.set(sourceMod, new Set<string>());
        }
        moduleDeps.get(sourceMod)!.add(targetMod);
      }
    });

    // 6. Build Level 0 E2E Document Markdown Content (Fully Dynamic & Universal)
    const docLines: string[] = [
      `# ${repoName} - System & Business Flow Overview`,
      ``,
      `> 💡 **Level 0 Onboarding & Architecture Summary**`,
      `>`,
      `> ${projectAnalysis.summaryText}`,
      ``,
      `---`,
      ``,
      `## 1. System Overview`,
      ``,
      `AST Knowledge Graph analysis indicates that **${repoName}** is a **${projectAnalysis.categoryTitle}** consisting of **${moduleMap.size}** primary modules and **${featureCatalog.length}** identified capability features.`,
      ``,
      `- System Type: **${projectAnalysis.categoryTitle}**`,
      `- Primary Modules: **${moduleMap.size}**`,
      `- Identified Features: **${featureCatalog.length}**`,
      `- Source Files: **${keyNodes.length}**`,
      ``,
      `---`,
      ``,
      `## 2. Master System Flowchart`,
      ``,
      `The following flowchart illustrates the high-level architectural relationships between primary system components in **${repoName}**:`,
      ``,
      `\`\`\`mermaid`,
      masterMermaid,
      `\`\`\``,
      ``,
      `---`,
      ``,
      `## 3. End-to-End Sequence Diagram`,
      ``,
      `The following sequence diagram outlines the end-to-end execution flow from user trigger to output delivery:`,
      ``,
      `\`\`\`mermaid`,
      masterSequence,
      `\`\`\``,
      ``,
      `---`,
    ];

    if (featureCatalog.length > 0) {
      docLines.push(`## 4. ${projectAnalysis.catalogTitle}`);
      docLines.push(``);
      docLines.push(`Catalog of identified features, components, and domain outputs generated by **${repoName}**:`);
      docLines.push(``);
      docLines.push(`| No | Feature / Domain Name | Service Source File | Output Format / Impact |`);
      docLines.push(`|----|-----------------------|---------------------|------------------------|`);

      featureCatalog.forEach((item, idx) => {
        docLines.push(`| ${idx + 1} | **${item.title}** | \`${item.filePath}\` | ${item.outputFormat} |`);
      });

      docLines.push(``);
      docLines.push(`---`);
      docLines.push(``);
    }

    docLines.push(`## 5. Primary Capability Modules & Core Files`);
    docLines.push(``);

    let modIndex = 1;
    moduleMap.forEach((data, moduleName) => {
      const role = this.determineLayerRole(moduleName, data.files);
      const description = this.generateModuleDescription(moduleName, data.files);

      docLines.push(`### 5.${modIndex++} Module: ${moduleName} (${role})`);
      docLines.push(`- **Core Purpose**: ${description}`);
      docLines.push(`- **Component Count**: ${data.nodes.length}`);
      if (data.files.size > 0) {
        const fileList = Array.from(data.files).slice(0, 5).map((f) => `\`${f}\``).join(', ');
        docLines.push(`- **Core Files / Entrypoints**: ${fileList}`);
      }
      docLines.push(``);
    });

    docLines.push(`---`);
    docLines.push(``);
    docLines.push(`## 6. Module Dependency Matrix`);
    docLines.push(``);
    docLines.push(`| Source Module | Layer Role | Target Dependency | Relationship Status |`);
    docLines.push(`|---------------|------------|-------------------|---------------------|`);

    if (moduleDeps.size > 0) {
      moduleDeps.forEach((targets, source) => {
        const role = this.determineLayerRole(source, moduleMap.get(source)?.files || new Set());
        targets.forEach((target) => {
          docLines.push(`| **${source}** | ${role} | **${target}** | Direct Connection |`);
        });
      });
    } else {
      moduleMap.forEach((data, source) => {
        const role = this.determineLayerRole(source, data.files);
        docLines.push(`| **${source}** | ${role} | Core System | Standalone Service |`);
      });
    }

    docLines.push(``);
    docLines.push(`---`);
    docLines.push(``);
    docLines.push(`*Level 0 System Documentation extracted automatically from AST Knowledge Graph analysis.*`);

    return {
      title: `${repoName} E2E Flow`,
      masterMermaid,
      masterSequence,
      markdownContent: docLines.join('\n'),
    };
  }

  /**
   * Automatic Project Domain Classifier
   * Analyzes Knowledge Graph nodes & files to identify the project category dynamically.
   */
  private analyzeProjectDomain(nodes: GraphNode[], files: string[]): ProjectAnalysis {
    const allText = (nodes.map((n) => n.name).join(' ') + ' ' + files.join(' ')).toLowerCase();

    let frontendScore = 0;
    let exportScore = 0;
    let apiScore = 0;
    let authScore = 0;
    let paymentScore = 0;
    let cliScore = 0;

    if (
      allText.includes('react') ||
      allText.includes('next') ||
      allText.includes('vue') ||
      allText.includes('svelte') ||
      allText.includes('angular') ||
      allText.includes('component') ||
      allText.includes('.tsx') ||
      allText.includes('.jsx') ||
      allText.includes('pages/') ||
      allText.includes('app/') ||
      allText.includes('router') ||
      allText.includes('ui')
    ) {
      frontendScore += 6;
    }

    if (allText.includes('report') || allText.includes('export') || allText.includes('excel') || allText.includes('xlsx') || allText.includes('pdf') || allText.includes('csv')) {
      exportScore += 5;
    }

    if (allText.includes('controller') || allText.includes('route') || allText.includes('endpoint') || allText.includes('gin') || allText.includes('echo') || allText.includes('express') || allText.includes('nest')) {
      apiScore += 4;
    }

    if (allText.includes('auth') || allText.includes('jwt') || allText.includes('sso') || allText.includes('oauth') || allText.includes('login')) {
      authScore += 4;
    }

    if (allText.includes('payment') || allText.includes('billing') || allText.includes('invoice') || allText.includes('transaction') || allText.includes('checkout')) {
      paymentScore += 4;
    }

    if (allText.includes('cli') || allText.includes('command') || allText.includes('cobra') || allText.includes('commander')) {
      cliScore += 4;
    }

    const maxScore = Math.max(frontendScore, exportScore, apiScore, authScore, paymentScore, cliScore);

    if (maxScore >= 4) {
      if (maxScore === frontendScore) {
        return {
          category: 'FRONTEND_WEB_APP',
          categoryTitle: 'Frontend Web & UI Application',
          summaryText: 'This document presents the UI architecture, Page/Component hierarchy, and execution flow from User Interface to API Requests.',
          catalogTitle: 'Identified Page & UI Component Catalog',
          outputTerm: 'UI View / User Render',
        };
      }
      if (maxScore === exportScore) {
        return {
          category: 'REPORT_EXPORT_SERVICE',
          categoryTitle: 'Report & Document Export Service',
          summaryText: 'This document presents the architecture, business report catalog, and end-to-end execution flow from entrypoints to document output.',
          catalogTitle: 'Identified Business Report & Document Output Catalog',
          outputTerm: 'Excel / File Output',
        };
      }
      if (maxScore === authScore) {
        return {
          category: 'AUTH_IDENTITY_SERVICE',
          categoryTitle: 'Authentication & Identity Service',
          summaryText: 'This document presents the security architecture, auth features, and end-to-end flow from auth endpoints to session grants.',
          catalogTitle: 'Identified Auth & Security Feature Catalog',
          outputTerm: 'JWT Token / Auth Context',
        };
      }
      if (maxScore === paymentScore) {
        return {
          category: 'PAYMENT_BILLING_SERVICE',
          categoryTitle: 'Payment & Transaction Engine',
          summaryText: 'This document presents the transaction architecture, payment features, and end-to-end flow from payment endpoints to settlement.',
          catalogTitle: 'Identified Payment & Transaction Feature Catalog',
          outputTerm: 'Payment Result / Settlement Payload',
        };
      }
      if (maxScore === apiScore) {
        return {
          category: 'REST_API_SERVICE',
          categoryTitle: 'REST API & Microservice Backend',
          summaryText: 'This document presents the service architecture, API endpoint catalog, and end-to-end flow from routes to response payloads.',
          catalogTitle: 'Identified API Endpoint & Feature Capability Catalog',
          outputTerm: 'JSON Response / API Payload',
        };
      }
      if (maxScore === cliScore) {
        return {
          category: 'CLI_SYSTEM_TOOL',
          categoryTitle: 'CLI & System Automation Tool',
          summaryText: 'This document presents the CLI architecture, command catalog, and end-to-end execution flow from entrypoint to output status.',
          catalogTitle: 'Identified CLI Command & Pipeline Feature Catalog',
          outputTerm: 'Execution Outcome / CLI Output',
        };
      }
    }

    return {
      category: 'GENERIC_APPLICATION',
      categoryTitle: 'Modular Application System',
      summaryText: 'This document presents the architecture and capability overview of the application system.',
      catalogTitle: 'Identified Feature Capability & Module Catalog',
      outputTerm: 'System Response / Data Output',
    };
  }

  private extractFeatureCatalog(files: string[], category: ProjectCategory): Array<{ title: string; filePath: string; outputFormat: string }> {
    const catalog: Array<{ title: string; filePath: string; outputFormat: string }> = [];

    files.forEach((file) => {
      const base = path.basename(file).toLowerCase();
      const nameNoExt = path.basename(file, path.extname(file)).toLowerCase();

      // Exclude infrastructure / generic filenames
      if (
        ['handler.go', 'route.go', 'model.go', 'repository.go', 'module.go', 'service.go', 'in.go', 'out.go', 'common.go', 'config.go', 'index.ts', 'main.ts', 'server.ts'].includes(base) ||
        nameNoExt.endsWith('_model') ||
        nameNoExt.endsWith('_repository') ||
        nameNoExt.includes('constanta') ||
        nameNoExt.includes('header_export')
      ) {
        return;
      }

      let isCandidate = false;
      let outputFormat = 'JSON / Response Payload';

      if (category === 'FRONTEND_WEB_APP') {
        if (
          file.includes('/pages/') ||
          file.includes('/components/') ||
          file.includes('/views/') ||
          file.includes('/app/') ||
          base.endsWith('.tsx') ||
          base.endsWith('.jsx') ||
          base.includes('page') ||
          base.includes('component') ||
          base.includes('view')
        ) {
          isCandidate = true;
          outputFormat = 'UI Component / Rendered View';
        }
      } else if (category === 'REPORT_EXPORT_SERVICE') {
        if (nameNoExt.includes('report') || nameNoExt.includes('export') || nameNoExt.includes('sale') || nameNoExt.includes('stock') || nameNoExt.includes('inventory') || nameNoExt.includes('transaction')) {
          isCandidate = true;
          outputFormat = 'Excel (.xlsx) / Document';
        }
      } else if (category === 'REST_API_SERVICE') {
        if (nameNoExt.includes('controller') || nameNoExt.includes('handler') || nameNoExt.includes('service') || nameNoExt.includes('api')) {
          isCandidate = true;
          outputFormat = 'REST Endpoint / JSON';
        }
      } else if (category === 'AUTH_IDENTITY_SERVICE') {
        if (nameNoExt.includes('auth') || nameNoExt.includes('jwt') || nameNoExt.includes('user') || nameNoExt.includes('login') || nameNoExt.includes('session')) {
          isCandidate = true;
          outputFormat = 'JWT Token / Auth Context';
        }
      } else if (category === 'PAYMENT_BILLING_SERVICE') {
        if (nameNoExt.includes('payment') || nameNoExt.includes('billing') || nameNoExt.includes('invoice') || nameNoExt.includes('transaction')) {
          isCandidate = true;
          outputFormat = 'Transaction Result / Callback';
        }
      } else {
        if (!nameNoExt.startsWith('.') && nameNoExt.length > 3) {
          isCandidate = true;
          outputFormat = 'Feature Component';
        }
      }

      if (isCandidate) {
        let cleanName = nameNoExt
          .replace(/_service$/, '')
          .replace(/_controller$/, '')
          .replace(/_handler$/, '')
          .replace(/_report$/, '')
          .replace(/_/g, ' ');

        cleanName = cleanName
          .split(' ')
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        catalog.push({
          title: cleanName,
          filePath: file,
          outputFormat,
        });
      }
    });

    return catalog.slice(0, 50); // Cap at top 50 features for doc clarity
  }

  private extractModuleName(node: GraphNode): string {
    const filePath = node.filePath || '';
    const parts = filePath.split(/[/\\]+/).filter(Boolean);

    const rootDirIndex = parts.findIndex((p) => ['src', 'lib', 'pkg', 'app', 'internal', 'modules'].includes(p));
    if (rootDirIndex !== -1 && rootDirIndex + 1 < parts.length - 1) {
      const folder = parts[rootDirIndex + 1];
      return folder.charAt(0).toUpperCase() + folder.slice(1);
    }

    if (parts.length >= 2) {
      const folder = parts[parts.length - 2];
      if (!['src', 'lib', 'pkg', 'app', 'internal', 'modules', 'dist', 'build'].includes(folder)) {
        return folder.charAt(0).toUpperCase() + folder.slice(1);
      }
    }

    return 'Core';
  }

  private determineLayerRole(moduleName: string, files: Set<string>): string {
    const lowerName = moduleName.toLowerCase();
    const allFilesStr = Array.from(files).join(' ').toLowerCase();

    if (
      lowerName.includes('mcp') ||
      lowerName.includes('api') ||
      lowerName.includes('controller') ||
      lowerName.includes('route') ||
      lowerName.includes('server') ||
      allFilesStr.includes('server') ||
      allFilesStr.includes('controller')
    ) {
      return 'API / Entrypoint';
    }

    if (
      lowerName.includes('middleware') ||
      lowerName.includes('jwt') ||
      lowerName.includes('logger') ||
      lowerName.includes('config') ||
      lowerName.includes('error')
    ) {
      return 'Middleware & Infra';
    }

    if (
      lowerName.includes('export') ||
      lowerName.includes('writer') ||
      lowerName.includes('generator') ||
      lowerName.includes('report') ||
      allFilesStr.includes('exporter') ||
      allFilesStr.includes('report')
    ) {
      return 'Export Engine / File Output';
    }

    if (
      lowerName.includes('storage') ||
      lowerName.includes('db') ||
      lowerName.includes('repository') ||
      lowerName.includes('model') ||
      allFilesStr.includes('repository')
    ) {
      return 'Database / Storage';
    }

    return 'Core Logic / Business Engine';
  }

  private generateModuleDescription(moduleName: string, files: Set<string>): string {
    const lowerName = moduleName.toLowerCase();
    const fileList = Array.from(files).map((f) => path.basename(f).toLowerCase());

    if (lowerName.includes('export') || fileList.some((f) => f.includes('report') || f.includes('export'))) {
      return 'Handles report generation, data formatting, and export file preparation.';
    }
    if (lowerName.includes('server') || lowerName.includes('route') || lowerName.includes('controller')) {
      return 'Manages HTTP server initialization, API endpoint routing, and request handling.';
    }
    if (lowerName.includes('user') || fileList.some((f) => f.includes('user'))) {
      return 'Manages user entities, authentication, and domain access control rules.';
    }
    if (lowerName.includes('middleware') || lowerName.includes('jwt')) {
      return 'Provides security filters, token validation, and request context logging.';
    }
    if (lowerName.includes('utils') || lowerName.includes('calculator')) {
      return 'Provides helper utilities for calculations, data formatting, and file processing.';
    }
    if (lowerName.includes('config') || lowerName.includes('logger')) {
      return 'Configures application runtime environments, system variables, and activity logging.';
    }

    return `Coordinates domain business logic and execution rules for the ${moduleName} module.`;
  }

  private findNodeModule(nodeId: string, nodes: GraphNode[]): string {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? this.extractModuleName(node) : '';
  }
}
