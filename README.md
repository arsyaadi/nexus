# OKF

> Turn source code into structured knowledge.

OKF is an AI-first knowledge extraction engine.

Instead of generating documentation directly, OKF extracts knowledge from an existing codebase and produces a structured `.okf` package.

The `.okf` package contains technical documentation and draft business documentation inferred from the implementation.

OKF is designed to work alongside AI coding agents such as Claude Code, Antigravity, Cursor, and other MCP-enabled tools.

---

## Why OKF?

Many software projects have little or no documentation.

Developers usually prioritize delivering features over writing documentation, leaving valuable business knowledge trapped inside the source code.

OKF aims to extract that knowledge automatically.

Rather than replacing human documentation, OKF produces high-quality drafts that teams can review and improve.

---

## Philosophy

OKF follows one simple principle:

> Extract knowledge, don't invent knowledge.

Technical documentation should be based only on observable implementation.

Business documentation should always be treated as inferred and reviewed by humans.

---

## Scope

Capabilities:

- Analyze repository using Codebase Memory
- Build execution plan
- Review execution plan
- Generate Technical Documentation
- Generate Draft Business Flow
- Produce `.okf`

Out of scope:

- Docusaurus
- PDF
- Mermaid
- UML
- Notion
- Confluence
- Web UI

---

## High Level Workflow

Repository

↓

Knowledge Graph

↓

Planning

↓

Human Review

↓

Execution

↓

.okf

---

## Output

.okf/

technical/

business/

metadata.json

---

## License

MIT
