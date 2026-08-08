# Nexus MCP

Nexus turns codebases into structured Knowledge Graphs, Mermaid flowcharts, and Word (.docx) documentation. It runs as a Model Context Protocol (MCP) server for AI assistants like Claude Code, Antigravity, Cursor, and Windsurf.

---

## What It Does

- **AST Knowledge Graphing**: Indexes call graphs, dependencies, and file relationships using an embedded LadybugDB graph engine (`@ladybugdb/core`).
- **End-to-End System Diagrams**: Generates master Mermaid flowcharts (`flowchart TD`) and sequence diagrams covering system entrypoints to data outputs.
- **Domain Auto-Detection**: Classifies repositories (REST APIs, frontend apps, report services, auth services, CLI tools) and builds matching feature catalogs.
- **Word Document Export**: Exports documentation into `.docx` files with embedded flowcharts, callout boxes, and formatted tables without needing `pandoc` or `python`.
- **Anti-AI-Slop Generator**: Sanitizes robotic AI clichés and enforces direct, senior-engineer writing style.

---

## Setup

Add `@arstzy/nexus-mcp` to your MCP configuration:

### Claude Code CLI
```bash
claude mcp add nexus -- npx -y @arstzy/nexus-mcp
```

### Antigravity / Cursor / Windsurf (`mcp_config.json` or `.mcp.json`)
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

## Prompt Examples

You can control Nexus by asking your AI assistant in plain English:

### 1. Generate Full System Flowchart & Overview
> *"Nexus, generate the E2E flow documentation for this repository."*

*Nexus extracts the AST graph, creates master Mermaid diagrams, and writes `.nexus/e2e_flow.md`.*

---

### 2. Create Module Execution Plan
> *"Nexus, build an execution plan for the codebase."*

*Returns capability modules, component dependencies, file lists, and priority rankings.*

---

### 3. Generate Detailed Module Docs (AI Reasoning Loop)
> *"Nexus, write business flow docs for each module in the plan and save them."*

*Loops through capability modules, retrieves code context, and writes detailed module specifications into `.nexus/business/` and `.nexus/technical/`.*

---

### 4. Export Documentation to Word (.docx)
> *"Nexus, export the documentation package to Word format."*

*Finalizes the `.nexus` package and generates a single `documentation.docx` file.*

---

## MCP Tools Reference

| Tool | What It Does |
|:---|:---|
| `nexus_generate_e2e` | Builds master Mermaid flowchart, sequence diagram, and `.nexus/e2e_flow.md`. |
| `nexus_plan` | Returns module execution tasks, file dependencies, and complexity scores. |
| `nexus_get_module_context` | Fetches source code context for a specific module to keep context windows small. |
| `nexus_save_module_doc` | Saves technical and business markdown files into `.nexus`. |
| `nexus_finalize` | Writes `.nexus/metadata.json` to complete the package. |
| `nexus_export` | Exports `.nexus` packages to Word (`docx`) or Docusaurus. |

---

## License

[MIT](LICENSE)
