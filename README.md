# Nexus

> Standalone AI Knowledge Graph & Master End-to-End Flow Extraction Engine. Turn source code into structured knowledge packages (`.nexus`) and publishable documentation (Word `.docx` & Docusaurus).

**Nexus** (*The Central Connection Hub*) is a **100% standalone**, AI-first knowledge extraction engine. Instead of generating raw, unorganized markdown files, Nexus analyzes codebases using a built-in AST knowledge graph analyzer (`LocalGraphProvider`), constructs **Master End-to-End System Flowcharts**, groups functionality into capability-based modules, and generates versionable `.nexus` packages complete with **Mermaid Process Diagrams** and **Business Specifications**.

Nexus operates as a **Model Context Protocol (MCP) Server** designed to work seamlessly alongside AI coding agents such as **Claude Code**, **Antigravity**, **Cursor**, and **Windsurf**.

---

## 🌟 Key Features

- 🏗️ **Built-in Standalone AST Engine (`LocalGraphProvider`)**: Zero external service dependencies! Parses TypeScript & JavaScript source code using TypeScript Compiler API out of the box.
- ⚡ **Single-Step Master E2E Flow Engine (`nexus_generate_e2e`)**: Analyzes the entire codebase Knowledge Graph and generates **ONE Master Mermaid E2E Flowchart** (`flowchart TD`) connecting all components from entry point to storage in ONE step.
- 📐 **Technical & Business Specifications**: Technical contracts with **Mermaid Sequence Diagrams** and standardized business flows with **Mermaid Flowcharts**.
- 🛡️ **Mermaid Auto-Injection Safeguard**: Guarantees valid visual Mermaid process diagrams in every documentation output.
- 📄 **Native Word Exporter (`.docx`)**: Converts `.nexus` packages into a single unified `documentation.docx` file. Natively parses inline formatting, markdown tables, callouts, and embeds visual PNG process flow diagrams with **zero external CLI dependencies** (no `pandoc` or `python` required).
- 🌐 **Docusaurus Exporter**: Exports `.nexus` packages into a ready-to-build Docusaurus documentation site with `docs/e2e-flow.md` auto-configured at the top of `sidebars.ts`.
- 🔌 **MCP First**: Complete suite of MCP tools (`nexus_generate_e2e`, `nexus_plan`, `nexus_get_module_context`, `nexus_save_module_doc`, `nexus_finalize`, `nexus_export`).

---

## 🛠️ Generation Modes

Nexus supports **two flexible generation modes**:

### Mode 1: Single Master E2E Flow (Recommended)
- **Tool**: `nexus_generate_e2e` / CLI `nexus run .`
- **Output**: Single unified file `.nexus/e2e_flow.md` exported as a single Word file `documentation.docx`.
- **Use Case**: Instantly extract a single Master Mermaid E2E Flowchart covering the entire system from start to finish in one step.

### Mode 2: Capability Module Deep-Dives
- **Tool**: `nexus_plan` + `nexus_save_module_doc`
- **Output**: Granular per-module specifications (`.nexus/technical/*.md` & `.nexus/business/*.md`).
- **Use Case**: Detailed architectural & business rules deep-dives for individual domain modules.

---

## 🛠️ Prerequisites & Requirements

1. **Node.js**: `v18.x` or higher.

---

## 🚀 Installation & Setup

### 1. Build Nexus Server
```bash
git clone https://github.com/arsyaadi/nexus.git
cd nexus
npm install
npm run build
```

### 2. Register Nexus MCP Server

#### **Claude Code**
```bash
claude mcp add nexus -- node /absolute/path/to/nexus/dist/mcp/index.js
```

#### **Antigravity / Cursor / Windsurf (`.mcp.json` / `mcp_config.json`)**
```json
{
  "mcpServers": {
    "nexus": {
      "command": "node",
      "args": ["/absolute/path/to/nexus/dist/mcp/index.js"]
    }
  }
}
```

---

## 💬 How to Use (AI Chat Examples)

Once the Nexus MCP Server is registered in your AI Host, you can trigger workflows using natural language:

### Example Prompts

#### **1. Single-Step E2E Flow Generation (Master Mermaid Diagram)**
> *"Run `nexus_generate_e2e` to extract a single Master E2E Mermaid Flowchart for this repository."*

#### **2. Full Module Knowledge Extraction**
> *"Analyze this repository and extract all capability knowledge into a `.nexus` package."*

#### **3. Export Documentation to Word (.docx)**
> *"Export the `.nexus` documentation package to Microsoft Word (`.docx`) in `./export`."*

#### **4. Export to Docusaurus Site**
> *"Export Nexus documentation to a Docusaurus site structure in `./docs-site`."*

---

## 🔄 AI Agent Workflow Architecture

```
                  ┌─► 1. `nexus_generate_e2e` (Generates Master E2E Mermaid Flowchart in ONE step)
                  │
AI Host Agent     ├─► 2. `nexus_plan` (Optional: Clusters Granular Capability Modules)
 (Claude / AGY)   │
                  ├─► 3. `nexus_save_module_doc` (Optional: Saves per-module deep dives)
                  │
                  └─► 4. `nexus_export` (Exports to Word `documentation.docx` or Docusaurus)
```

---

## 📂 Package & Export Structure

### 1. `.nexus` Package Directory Structure
```
.nexus/
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

Nexus includes a standalone CLI for manual testing and pipeline automation:

```bash
# Index target repository via built-in AST provider
nexus init /path/to/target-repo

# Generate Execution Plan
nexus plan /path/to/target-repo

# Run full workflow (Init → Master E2E Flow → Execute → .nexus)
nexus run /path/to/target-repo

# Export .nexus package to Word (.docx)
nexus export /path/to/target-repo --format docx --out ./export

# Export .nexus package to Docusaurus site
nexus export /path/to/target-repo --format docusaurus --out ./docs-site
```

---

## 🛠️ MCP Tools Reference

| MCP Tool | Description |
|---|---|
| `nexus_generate_e2e` | **Primary Single-Step Tool**: Analyzes repository and generates ONE Master E2E Mermaid Flowchart and unified `.nexus/e2e_flow.md` document in 1 step. |
| `nexus_plan` | Analyzes AST Knowledge Graph and returns module execution tasks. |
| `nexus_get_module_context` | Returns source code context for a specific module task. |
| `nexus_save_module_doc` | Saves technical & draft business markdown files for a module (with Mermaid auto-injection safeguard). |
| `nexus_finalize` | Finalizes `.nexus` package generation and writes `metadata.json`. |
| `nexus_export` | Exports `.nexus` package to single Word (`documentation.docx`) or Docusaurus format. |

---

## 📄 License

[MIT](LICENSE)
