# Nexus Development Agent

## Mission

Build Nexus incrementally.

Prioritize correctness, simplicity, and maintainability over feature completeness.

The current objective is generating a valid `.nexus` package and Master E2E Flow documentation.

Nothing else.

---

# Development Principles

Always prefer:

- Small commits
- Small prompts
- Small contexts
- Small components

Avoid overengineering.

Avoid speculative architecture.

Future phases should never complicate the current implementation.

---

# Current Scope

Implement only:

- Repository analysis & AST Knowledge Graph
- Single-step Master E2E Flow generation (`nexus_generate_e2e`)
- Planning (`nexus_plan`)
- Task execution
- Technical documentation (with Mermaid Sequence Diagrams)
- Draft business flow (with Mermaid Flowcharts)
- `.nexus` package generation
- Exporting (`docx`, `docusaurus` via `nexus_export`)

Everything else belongs to future milestones.

---

# Core Workflow

Repository

↓

Knowledge Graph

↓

Master E2E Flow (`nexus_generate_e2e`) OR Planning (`nexus_plan`)

↓

Module Execution (`nexus_get_module_context` → `nexus_save_module_doc`)

↓

Finalize `.nexus` (`nexus_finalize`)

↓

Export (`nexus_export` → `docx` / `docusaurus`)

---

# Export Execution Rule

When the user asks to export or convert `.nexus` to `docx` or `docusaurus`:

1. **ALWAYS** use the MCP tool `nexus_export` (via `ServerName: "nexus"`, `ToolName: "nexus_export"`), OR run CLI: `node dist/index.js export . --format docx --out <dir>`.
2. **NEVER** run external conversion tools such as `pandoc`, `python`, or `libreoffice`.

---

Never skip the planning phase.

---

# Code Style

Prefer:

- composition
- modularity
- readability

Avoid:

- unnecessary abstraction
- deep inheritance
- large files
- tightly coupled components

---

# AI Philosophy

Extract.

Do not invent.

Prefer evidence over assumptions.

Prefer deterministic workflows over reasoning whenever possible.

Reason only when deterministic analysis cannot provide the answer.

Always maximize traceability.
