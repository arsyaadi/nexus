# Vidya Development Agent

## Mission

Build Vidya incrementally.

Prioritize correctness, simplicity, and maintainability over feature completeness.

The current objective is generating a valid `.vidya` package and Master E2E Flow documentation.

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
- Single-step Master E2E Flow generation (`vidya_generate_e2e`)
- Planning (`vidya_plan`)
- Task execution
- Technical documentation (with Mermaid Sequence Diagrams)
- Draft business flow (with Mermaid Flowcharts)
- `.vidya` package generation
- Exporting (`docx`, `docusaurus` via `vidya_export`)

Everything else belongs to future milestones.

---

# Core Workflow

Repository

↓

Knowledge Graph

↓

Master E2E Flow (`vidya_generate_e2e`) OR Planning (`vidya_plan`)

↓

Module Execution (`vidya_get_module_context` → `vidya_save_module_doc`)

↓

Finalize `.vidya` (`vidya_finalize`)

↓

Export (`vidya_export` → `docx` / `docusaurus`)

---

# Export Execution Rule

When the user asks to export or convert `.vidya` to `docx` or `docusaurus`:

1. **ALWAYS** use the MCP tool `vidya_export` (via `ServerName: "vidya"`, `ToolName: "vidya_export"`), OR run CLI: `node dist/index.js export . --format docx --out <dir>`.
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
