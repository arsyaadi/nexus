# Nexus Principles

## Core Values

1. **Deterministic Over Probabilistic**: Prefer AST parsing over reasoning whenever deterministic analysis can answer the question.
2. **Factual Integrity**: Documentation must accurately reflect the codebase.
3. **Traceability**: Every output must map back to source symbols and files.
4. **Incremental Value**: Every milestone must deliver useful documentation.

---

## Technical Directives

- Maintain zero external service dependencies for code parsing.
- Keep output packages clean and reviewable.
- Generate valid Mermaid diagrams natively.
