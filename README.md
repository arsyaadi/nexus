# Nexus

Standalone AST Knowledge Graph & Master End-to-End Flow Extraction Engine. Turn source code into structured knowledge packages (`.nexus`) and publishable documentation (Word `.docx` & Docusaurus).

Nexus analyzes codebases using a built-in AST knowledge graph analyzer (`LocalGraphProvider`), constructs Master End-to-End System Flowcharts, groups functionality into capability-based modules, and generates versionable `.nexus` packages with Mermaid process diagrams and business specifications.

Nexus operates as a Model Context Protocol (MCP) Server for Claude Code, Antigravity, Cursor, and Windsurf.

---

## Features

- **Built-in Standalone AST Engine (`LocalGraphProvider`)**: Parses TypeScript & JavaScript source code using the TypeScript Compiler API with zero external service dependencies.
- **Single-Step Master E2E Flow Engine (`nexus_generate_e2e`)**: Analyzes the codebase Knowledge Graph and generates one Master Mermaid E2E Flowchart (`flowchart TD`) connecting all components in one step.
- **Technical & Business Specifications**: Technical contracts with Mermaid sequence diagrams and standardized business flows with Mermaid flowcharts.
- **Mermaid Auto-Injection Safeguard**: Ensures valid visual Mermaid process diagrams in all documentation outputs.
- **Native Word Exporter (`.docx`)**: Converts `.nexus` packages into a single `documentation.docx` file. Parses inline formatting, markdown tables, callouts, and embeds visual PNG process flow diagrams without external CLI dependencies (`pandoc` or `python`).
- **Docusaurus Exporter**: Exports `.nexus` packages into a ready-to-build Docusaurus documentation site with `docs/e2e-flow.md` auto-configured at the top of `sidebars.ts`.
- **MCP Integration**: Full suite of MCP tools (`nexus_generate_e2e`, `nexus_plan`, `nexus_get_module_context`, `nexus_save_module_doc`, `nexus_finalize`, `nexus_export`).

---

## MCP Server Setup

### Claude Code
```bash
claude mcp add nexus -- npx -y @arsyaadi/nexus-mcp
```

### Antigravity / Cursor / Windsurf (`.mcp.json` / `mcp_config.json`)
```json
{
  "mcpServers": {
    "nexus": {
      "command": "npx",
      "args": ["-y", "@arsyaadi/nexus-mcp"]
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
