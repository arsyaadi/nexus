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
- Technical documentation
- Draft business flow
- `.okf` generation

Everything else belongs to future milestones.

---

# Core Workflow

Repository

↓

Knowledge Graph

↓

Planning

↓

User Review

↓

Execution

↓

.okf

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
