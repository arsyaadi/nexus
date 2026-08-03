# OKF (Open Knowledge Format)

> Turn source code into structured, reviewable knowledge packages (`.okf`) and publishable documentation (Word `.docx` & Docusaurus).

OKF is a **100% standalone**, AI-first knowledge extraction engine. Instead of generating raw, unorganized markdown files, OKF analyzes codebases using a built-in AST knowledge graph analyzer (`LocalGraphProvider`), groups functionality into capability-based modules, and generates versionable `.okf` packages complete with **Mermaid Sequence Diagrams** and **Business Flow Specifications**.

OKF operates as a **Model Context Protocol (MCP) Server** designed to work seamlessly alongside AI coding agents such as **Claude Code**, **Antigravity**, **Cursor**, and **Windsurf**.

---

## 🌟 Key Features

- 🏗️ **Built-in Standalone AST Engine (`LocalGraphProvider`)**: Zero external dependencies! Parses TypeScript & JavaScript source code using TypeScript Compiler API out of the box.
- 📐 **Technical Documentation**: Detailed technical specifications with **Mermaid Sequence Diagrams** (`sequenceDiagram`) detailing caller-callee interactions.
- 📋 **Standardized Business Flow**: Inferred business rules, **Mermaid Flowcharts** (`flowchart TD`), actors matrix, prerequisites, step-by-step process breakdowns, and cross-module impact analysis.
- 📄 **Native Word Exporter (`.docx`)**: Converts `.okf` packages into `technical.docx` and `business.docx`. Natively parses inline formatting, markdown tables, callouts, and renders process flow tables & visual PNG diagrams—with **zero external CLI dependencies** (no `pandoc` or `python` required).
- 🌐 **Docusaurus Exporter**: Exports `.okf` packages into a ready-to-build Docusaurus documentation site with auto-generated `sidebars.ts` and `docusaurus.config.ts`.
- 🔌 **MCP First**: Complete suite of MCP tools (`okf_plan`, `okf_get_module_context`, `okf_save_module_doc`, `okf_finalize`, `okf_export`).

---

## 🛠️ Prerequisites & Requirements

1. **Node.js**: `v18.x` or higher. (Zero external service dependencies required).

---

## 🚀 Installation & Setup

### 1. Build OKF Server
```bash
git clone https://github.com/arsyaadi/okf.git
cd okf
npm install
npm run build
```

### 2. Register OKF MCP Server

#### **Claude Code**
```bash
claude mcp add okf -- node /absolute/path/to/okf/dist/mcp/index.js
```

#### **Antigravity / Cursor / Windsurf (`.mcp.json` / `mcp_config.json`)**
```json
{
  "mcpServers": {
    "okf": {
      "command": "node",
      "args": ["/absolute/path/to/okf/dist/mcp/index.js"]
    }
  }
}
```

---

## 💬 How to Use (AI Chat Examples)

Once the OKF MCP Server is registered in your AI Host, you can trigger workflows using natural language:

### Example Prompts

#### **1. Full Knowledge Extraction**
> *"Analyze this repository and extract all capability knowledge into a `.okf` package."*

#### **2. Export Documentation**
> *"Export the `.okf` documentation package to Microsoft Word (`.docx`) in `./export`."*
> *"Export OKF documentation to a Docusaurus site structure in `./docs-site`."*

#### **3. Combined Extraction & Export**
> *"Analyze this codebase, generate `.okf` documentation, and export it into `.docx` format."*

---

## 🔄 Interactive AI Agent Workflow

```
                  ┌─► 1. `okf_plan` (Analyzes AST & Clusters Capabilities)
                  │
AI Host Agent     ├─► 2. Presents Execution Plan to User for Approval
 (Claude / AGY)   │
                  ├─► 3. User Approves ("Looks good, proceed!")
                  │
                  ├─► 4. Loop Modules:
                  │      ├── `okf_get_module_context` (Fetches minimal code context)
                  │      ├── AI Agent Reasons & Generates Standardized Docs
                  │      └── `okf_save_module_doc` (Saves markdown files)
                  │
                  ├─► 5. `okf_finalize` (Generates `.okf/metadata.json`)
                  │
                  └─► 6. `okf_export` (Exports to Word `.docx` or Docusaurus)
```

---

## 📂 Package & Export Structure

### 1. `.okf` Package Directory Structure
```
.okf/
├── technical/
│   ├── buyback.md       # Technical specification & Mermaid sequence diagram
│   └── invoice.md
├── business/
│   ├── buyback.md       # Standardized business flow & Mermaid flowchart (marked DRAFT)
│   └── invoice.md
└── metadata.json        # Execution timestamp, version & module index
```

### 2. Export Output Structure
- **Word Format (`--format docx`)**:
  ```
  export/
  ├── technical.docx    # Styled Word document for technical specifications
  └── business.docx     # Styled Word document for business flows & PNG diagrams
  ```
- **Docusaurus Format (`--format docusaurus`)**:
  ```
  export/
  ├── docs/
  │   ├── technical/
  │   └── business/
  ├── sidebars.ts
  ├── docusaurus.config.ts
  └── package.json
  ```

---

## 🖥️ Standalone CLI Usage

OKF includes a standalone CLI for manual testing and pipeline automation:

```bash
# Index target repository via built-in AST provider
okf init /path/to/target-repo

# Generate Execution Plan
okf plan /path/to/target-repo

# Run full workflow (Init → Plan → Execute → .okf)
okf run /path/to/target-repo

# Export .okf package to Word (.docx)
okf export /path/to/target-repo --format docx --out ./export

# Export .okf package to Docusaurus site
okf export /path/to/target-repo --format docusaurus --out ./docs-site
```

---

## 🛠️ MCP Tools Reference

| MCP Tool | Description |
|---|---|
| `okf_plan` | Analyzes AST Knowledge Graph and returns module execution tasks. |
| `okf_get_module_context` | Returns source code context for a specific module task. |
| `okf_save_module_doc` | Saves technical & draft business markdown files for a module. |
| `okf_finalize` | Finalizes `.okf` package generation and writes `metadata.json`. |
| `okf_export` | Exports `.okf` package to Word (`docx`) or Docusaurus format. |

---

## 📄 License

[MIT](LICENSE)
