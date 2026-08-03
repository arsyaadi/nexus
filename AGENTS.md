# OKF Development Agent

## Mission

Build OKF incrementally.

Prioritize correctness, simplicity, and maintainability over feature completeness.

The current objective is generating a valid `.okf` package.

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

- Repository analysis
- Planning
- Task execution
- Technical documentation (with Mermaid Sequence Diagrams)
- Draft business flow (with Mermaid Flowcharts)
- `.okf` generation
- Exporting (`docx`, `docusaurus` via `okf_export`)

Everything else belongs to future milestones.

---

# Core Workflow

Repository

↓

Knowledge Graph

↓

Planning (`okf_plan`)

↓

Module Execution (`okf_get_module_context` → `okf_save_module_doc`)

↓

Finalize `.okf` (`okf_finalize`)

↓

Export (`okf_export` → `docx` / `docusaurus`)

---

# Export Execution Rule

When the user asks to export or convert `.okf` to `docx` or `docusaurus`:

1. **ALWAYS** use the MCP tool `okf_export` (via `ServerName: "okf"`, `ToolName: "okf_export"`), OR run CLI: `node dist/index.js export . --format docx --out <dir>`.
2. **NEVER** run external conversion tools such as `pandoc`, `python`, or `libreoffice`.

---

Never skip the planning phase.

---

# Planning

Planning is required before any documentation generation.

Planner responsibilities:

- analyze graph
- identify logical modules
- group related nodes
- identify dependencies
- estimate complexity
- estimate priority
- generate execution tasks

Never organize tasks around folders.

Prefer business or technical capabilities.

Good examples:

- Buyback
- Invoice
- Inventory
- Approval
- LM Scan

Avoid:

- Controllers
- Services
- Models
- Repositories

---

# Execution

Each execution task should generate:

- Technical Documentation
- Draft Business Flow

for exactly one module.

Never generate the entire repository in one reasoning session.

---

# Context Strategy

Always minimize context.

Preferred workflow:

Knowledge Graph

↓

Relevant Nodes

↓

Relevant Files

↓

Reasoning

Avoid loading unrelated files.

---

# Technical Documentation

Technical documentation should explain:

- purpose
- architecture
- important classes
- dependencies
- data flow
- entry points
- integrations

Never copy source code unless absolutely necessary.

Explain implementation instead.

---

# Business Flow

Business flow is inferred.

Always mark business documentation as:

DRAFT

Never state inferred business rules as facts.

When confidence is low:

Explain uncertainty.

---

# Output

Generate:

.okf/

technical/

business/

metadata.json

Each module should produce:

technical/<module>.md

business/<module>.md

---

# Decision Making

When multiple implementations are possible:

Choose the simplest solution that satisfies the current milestone.

Avoid implementing future features.

---

# Out of Scope

Do not implement unless explicitly requested:

- Docusaurus
- PDF
- Mermaid
- UML
- HTML
- Web UI
- Chat UI
- Notion
- Confluence
- GitBook

These belong to future phases.

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
