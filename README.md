# Nexus

Standalone AST Knowledge Graph & Master End-to-End Flow Extraction Engine. Turn source code into structured knowledge packages (`.nexus`), interactive visual graphs (`nexus ui`), and publishable documentation (Word `.docx` & Docusaurus).

Nexus analyzes codebases using a built-in High-Performance AST Knowledge Graph Analyzer (`SqliteGraphProvider`), constructs Master End-to-End System Flowcharts, groups functionality into capability-based modules, and provides an interactive Web Graph Studio.

Nexus operates as a CLI tool and a Model Context Protocol (MCP) Server for Claude Code, Antigravity, Cursor, and Windsurf.

---

## Features

- **SQLite Graph Engine (`SqliteGraphProvider`)**: Fast, zero-C++ native compilation overhead graph storage using Node 22 `node:sqlite`. Persists knowledge graphs in `$HOME/.nexus/graphs/` with automatic SHA-256 project registry tracking.
- **Interactive Web Graph Studio (`nexus ui`)**: Launches a 60FPS Cytoscape-powered Web UI on `http://localhost:3333` featuring:
  - **Neon Glow & Multi-Color Edge Palette**: Distinct glowing visual edge colors for `CALLS`, `EXTENDS`, `IMPLEMENTS`, and `IMPORTS` relationships.
  - **Neighborhood Focus Dimming**: Clicking or searching any node dims un-related nodes to 12% opacity so component dependency flows are instantly clear.
  - **Continuous Galaxy Meteor Drift**: Smooth organic floating drift physics bringing concentric galaxy orbits to life.
  - **Draggable Glassmorphic HUD Widgets**: Header, Toolbar, and Inspector Drawer cards can be freely dragged around the viewport.
  - **Multi-Project Switcher**: Dropdown selector to switch between any indexed repository seamlessly.
- **Multi-Language Deep AST Extractor**: Parses TypeScript, JavaScript, Go, Python, Java, Rust, PHP, C/C++, C#, Ruby, and Swift.
- **Single-Step Master E2E Flow Engine (`nexus_generate_e2e`)**: Analyzes the codebase Knowledge Graph and generates a Master Mermaid E2E Flowchart (`flowchart TD`) with subgraph module boundaries in one step.
- **Native Word Exporter (`.docx`)**: Converts `.nexus` packages into a single `documentation.docx` file with inline callouts, markdown tables, and embedded Mermaid process diagrams without external dependencies (`pandoc` or `python`).
- **Docusaurus Exporter**: Exports `.nexus` packages into a ready-to-build Docusaurus documentation site with `docs/e2e-flow.md` auto-configured at the top of `sidebars.ts`.
- **MCP Integration**: Full suite of MCP tools (`nexus_generate_e2e`, `nexus_plan`, `nexus_get_module_context`, `nexus_save_module_doc`, `nexus_finalize`, `nexus_export`).

---

## Interactive Web UI Visualizer

Launch the Web UI Visualizer on any repository:

```bash
npx nexus-mcp ui /path/to/target-repo
```

Then open your browser at **`http://localhost:3333`**.

---

## MCP Server Setup

### Claude Code
```bash
claude mcp add nexus -- npx -y @arstzy/nexus-mcp
```

### Antigravity / Cursor / Windsurf (`.mcp.json` / `mcp_config.json`)
```json
{
  "mcpServers": {
    "nexus": {
      "command": "npx",
      "args": ["-y", "@arstzy/nexus-mcp"]
    }
  }
}
```

---

## Generation Modes

### Mode 1: Single Master E2E Flow
- **Tool**: `nexus_generate_e2e` / CLI `npx nexus-mcp run .`
- **Output**: Single `.nexus/e2e_flow.md` file exported as `documentation.docx`.
- **Use Case**: Extracts a single Master Mermaid E2E Flowchart covering the system end-to-end.

### Mode 2: Capability Module Deep-Dives
- **Tool**: `nexus_plan` + `nexus_save_module_doc`
- **Output**: Per-module specifications (`.nexus/technical/*.md` & `.nexus/business/*.md`).
- **Use Case**: Architectural & business rules deep-dives for individual domain modules.

---

## CLI Usage

```bash
# Index target repository
npx nexus-mcp init /path/to/target-repo

# Launch Interactive Web Graph Studio (http://localhost:3333)
npx nexus-mcp ui /path/to/target-repo

# Generate execution plan
npx nexus-mcp plan /path/to/target-repo

# Run full workflow
npx nexus-mcp run /path/to/target-repo

# Export package to Word (.docx)
npx nexus-mcp export /path/to/target-repo --format docx --out ./export

# Export package to Docusaurus site
npx nexus-mcp export /path/to/target-repo --format docusaurus --out ./docs-site
```

---

## MCP Tools Reference

| Tool | Description |
|---|---|
| `nexus_generate_e2e` | Primary single-step tool. Generates Master E2E Mermaid Flowchart and `.nexus/e2e_flow.md`. |
| `nexus_plan` | Analyzes AST Knowledge Graph and returns module execution tasks. |
| `nexus_get_module_context` | Returns source code context for a module task. |
| `nexus_save_module_doc` | Saves technical & business markdown files for a module. |
| `nexus_finalize` | Finalizes `.nexus` package and writes `metadata.json`. |
| `nexus_export` | Exports package to Word (`docx`) or Docusaurus. |

---

## License

[MIT](LICENSE)
