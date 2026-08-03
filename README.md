# OKF (Open Knowledge Format)

> Turn source code into structured knowledge packages (`.okf`).

OKF is an AI-first knowledge extraction engine. Instead of generating raw, unorganized documentation, OKF extracts architectural & capability knowledge from an existing codebase using graph analysis and produces a versionable, structured `.okf` package.

OKF operates as a **Model Context Protocol (MCP) Server** designed to work seamlessly alongside AI coding agents such as **Claude Code**, **Antigravity**, **Cursor**, and other MCP-enabled environments.

---

## Prerequisites & Requirements

Before using OKF, ensure you have installed and configured:

1. **Node.js**: `v18.x` or higher.
2. **Codebase Memory MCP**: OKF depends on [`codebase-memory-mcp`](https://github.com/DeusData/codebase-memory-mcp) to build AST-based knowledge graphs of target repositories.
   - Install `codebase-memory-mcp` globally or ensure it is available on your system `PATH`:
     ```bash
     codebase-memory-mcp
     ```

---

## Installation & Setup

### 1. Build OKF Server
Clone the repository and build the TypeScript project:
```bash
git clone https://github.com/your-username/okf.git
cd okf
npm install
npm run build
```

### 2. Register OKF MCP Server in your AI Host

#### **Claude Code**
Add OKF to Claude Code via CLI:
```bash
claude mcp add okf -- node /absolute/path/to/okf/dist/mcp/index.js
```

#### **Antigravity / Cursor / Windsurf (`mcp_config.json` / `.mcp.json`)**
Add the `okf` server entry to your MCP configuration file:
```json
{
  "mcpServers": {
    "codebase-memory-mcp": {
      "command": "codebase-memory-mcp"
    },
    "okf": {
      "command": "node",
      "args": ["/absolute/path/to/okf/dist/mcp/index.js"]
    }
  }
}
```

---

## How to Use (Chat Examples with AI Agent)

Once the OKF MCP Server is registered in your AI Host (Antigravity, Claude Code, Cursor), you interact with OKF **directly in natural language chat**. You do not need external API keys—the host AI uses its own LLM reasoning to execute tasks.

### Example Prompts:

#### **Full Knowledge Extraction**
> *"Analyze this repository and extract all knowledge into a `.okf` documentation package."*

#### **Planning Only**
> *"Use OKF to generate an Execution Plan for capability modules in this codebase."*

#### **Targeted Repository Analysis**
> *"Run OKF on `/path/to/target-repo` to generate technical documentation and draft business flows."*

---

## Interactive AI Agent Workflow

When you prompt your AI Host, OKF coordinates the extraction through these steps:

```
                  ┌─► 1. `okf_plan` (Queries Graph & Clusters Capabilities)
                  │
AI Host Agent     ├─► 2. Presents Execution Plan to User in Chat for Approval
 (Claude / AGY)   │
                  ├─► 3. User Approves ("Looks good, proceed!")
                  │
                  ├─► 4. Loop Modules:
                  │      ├── `okf_get_module_context` (Fetches minimal code context)
                  │      ├── AI Agent Reasons & Generates Docs
                  │      └── `okf_save_module_doc` (Saves markdown files)
                  │
                  └─► 5. `okf_finalize` (Generates `.okf/metadata.json`)
```

---

## Output Package Structure

OKF generates the following structure inside `.okf/` at the root of the target repository:

```
.okf/
├── technical/
│   ├── invoice.md       # Factual technical specification & architecture
│   └── inventory.md
├── business/
│   ├── invoice.md       # Inferred business flows & rules (marked DRAFT)
│   └── inventory.md
└── metadata.json        # Execution timestamp, version & completed module index
```

---

## Standalone CLI Usage (Optional)

OKF also includes an optional CLI for manual testing and verification:

```bash
# Index target repository via Codebase Memory MCP
okf init /path/to/target-repo

# Generate Execution Plan only
okf plan /path/to/target-repo

# Run complete workflow
okf run /path/to/target-repo
```

---

## License

[MIT](LICENSE)
