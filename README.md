# Vidya (विद्य)

> Standalone AI Knowledge Graph & Master End-to-End Flow Extraction Engine. Turn source code into structured knowledge packages (`.vidya`) and publishable documentation (Word `.docx` & Docusaurus).

**Vidya** (Sanskrit for *Clarity, Knowledge & Illumination*) is a **100% standalone**, AI-first knowledge extraction engine. Instead of generating raw, unorganized markdown files, Vidya analyzes codebases using a built-in AST knowledge graph analyzer (`LocalGraphProvider`), constructs **Master End-to-End System Flowcharts**, groups functionality into capability-based modules, and generates versionable `.vidya` packages complete with **Mermaid Process Diagrams** and **Business Specifications**.

Vidya operates as a **Model Context Protocol (MCP) Server** designed to work seamlessly alongside AI coding agents such as **Claude Code**, **Antigravity**, **Cursor**, and **Windsurf**.

---

## 🌟 Key Features

- 🏗️ **Built-in Standalone AST Engine (`LocalGraphProvider`)**: Zero external service dependencies! Parses TypeScript & JavaScript source code using TypeScript Compiler API out of the box.
- ⚡ **Single-Step Master E2E Flow Engine (`vidya_generate_e2e`)**: Analyzes the entire codebase Knowledge Graph and generates **ONE Master Mermaid E2E Flowchart** (`flowchart TD`) connecting all components from entry point to storage in ONE step.
- 📐 **Technical & Business Specifications**: Technical contracts with **Mermaid Sequence Diagrams** and standardized business flows with **Mermaid Flowcharts**.
- 🛡️ **Mermaid Auto-Injection Safeguard**: Guarantees valid visual Mermaid process diagrams in every documentation output.
- 📄 **Native Word Exporter (`.docx`)**: Converts `.vidya` packages into a single unified `documentation.docx` file. Natively parses inline formatting, markdown tables, callouts, and embeds visual PNG process flow diagrams with **zero external CLI dependencies** (no `pandoc` or `python` required).
- 🌐 **Docusaurus Exporter**: Exports `.vidya` packages into a ready-to-build Docusaurus documentation site with `docs/e2e-flow.md` auto-configured at the top of `sidebars.ts`.
- 🔌 **MCP First**: Complete suite of MCP tools (`vidya_generate_e2e`, `vidya_plan`, `vidya_get_module_context`, `vidya_save_module_doc`, `vidya_finalize`, `vidya_export`).

---

## 🛠️ Generation Modes

Vidya supports **two flexible generation modes**:

### Mode 1: Single Master E2E Flow (Recommended)
- **Tool**: `vidya_generate_e2e` / CLI `vidya run .`
- **Output**: Single unified file `.vidya/e2e_flow.md` exported as a single Word file `documentation.docx`.
- **Use Case**: Instantly extract a single Master Mermaid E2E Flowchart covering the entire system from start to finish in one step.

### Mode 2: Capability Module Deep-Dives
- **Tool**: `vidya_plan` + `vidya_save_module_doc`
- **Output**: Granular per-module specifications (`.vidya/technical/*.md` & `.vidya/business/*.md`).
- **Use Case**: Detailed architectural & business rules deep-dives for individual domain modules.

---

## 🛠️ Prerequisites & Requirements

1. **Node.js**: `v18.x` or higher.

---

## 🚀 Installation & Setup

### 1. Build Vidya Server
```bash
git clone https://github.com/arsyaadi/okf.git vidya
cd vidya
npm install
npm run build
```

### 2. Register Vidya MCP Server

#### **Claude Code**
```bash
claude mcp add vidya -- node /absolute/path/to/vidya/dist/mcp/index.js
```

#### **Antigravity / Cursor / Windsurf (`.mcp.json` / `mcp_config.json`)**
```json
{
  "mcpServers": {
    "vidya": {
      "command": "node",
      "args": ["/absolute/path/to/vidya/dist/mcp/index.js"]
    }
  }
}
```

---

## 💬 How to Use (AI Chat Examples)

Once the Vidya MCP Server is registered in your AI Host, you can trigger workflows using natural language:

### Example Prompts

#### **1. Single-Step E2E Flow Generation (Master Mermaid Diagram)**
> *"Run `vidya_generate_e2e` to extract a single Master E2E Mermaid Flowchart for this repository."*

#### **2. Full Module Knowledge Extraction**
> *"Analyze this repository and extract all capability knowledge into a `.vidya` package."*

#### **3. Export Documentation to Word (.docx)**
> *"Export the `.vidya` documentation package to Microsoft Word (`.docx`) in `./export`."*

#### **4. Export to Docusaurus Site**
> *"Export Vidya documentation to a Docusaurus site structure in `./docs-site`."*

---

## 🔄 AI Agent Workflow Architecture

```
                  ┌─► 1. `vidya_generate_e2e` (Generates Master E2E Mermaid Flowchart in ONE step)
                  │
AI Host Agent     ├─► 2. `vidya_plan` (Optional: Clusters Granular Capability Modules)
 (Claude / AGY)   │
                  ├─► 3. `vidya_save_module_doc` (Optional: Saves per-module deep dives)
                  │
                  └─► 4. `vidya_export` (Exports to Word `documentation.docx` or Docusaurus)
```

---

## 📂 Package & Export Structure

### 1. `.vidya` Package Directory Structure
```
.vidya/
├── e2e_flow.md          # Unified Master E2E Flow & Master Mermaid Flowchart
├── technical/
│   └── buyback.md       # Technical specification & Mermaid sequence diagram
├── business/
│   └── buyback.md       # Standardized business flow & Mermaid flowchart (marked DRAFT)
└── metadata.json        # Execution timestamp, version & module index
```

### 2. Export Output Structure
- **Word Format (`--format docx`)**:
  ```
  export/
  └── documentation.docx # Single Word document with Master E2E Flowchart PNG image
  ```
- **Docusaurus Format (`--format docusaurus`)**:
  ```
  export/
  ├── docs/
  │   ├── e2e-flow.md    # Primary Master E2E Flowchart page
  │   ├── technical/
  │   └── business/
  ├── sidebars.ts
  ├── docusaurus.config.ts
  └── package.json
  ```

---

## 🖥️ Standalone CLI Usage

Vidya includes a standalone CLI for manual testing and pipeline automation:

```bash
# Index target repository via built-in AST provider
vidya init /path/to/target-repo

# Generate Execution Plan
vidya plan /path/to/target-repo

# Run full workflow (Init → Master E2E Flow → Execute → .vidya)
vidya run /path/to/target-repo

# Export .vidya package to Word (.docx)
vidya export /path/to/target-repo --format docx --out ./export

# Export .vidya package to Docusaurus site
vidya export /path/to/target-repo --format docusaurus --out ./docs-site
```

---

## 🛠️ MCP Tools Reference

| MCP Tool | Description |
|---|---|
| `vidya_generate_e2e` | **Primary Single-Step Tool**: Analyzes repository and generates ONE Master E2E Mermaid Flowchart and unified `.vidya/e2e_flow.md` document in 1 step. |
| `vidya_plan` | Analyzes AST Knowledge Graph and returns module execution tasks. |
| `vidya_get_module_context` | Returns source code context for a specific module task. |
| `vidya_save_module_doc` | Saves technical & draft business markdown files for a module (with Mermaid auto-injection safeguard). |
| `vidya_finalize` | Finalizes `.vidya` package generation and writes `metadata.json`. |
| `vidya_export` | Exports `.vidya` package to single Word (`documentation.docx`) or Docusaurus format. |

---

## 📄 License

[MIT](LICENSE)
