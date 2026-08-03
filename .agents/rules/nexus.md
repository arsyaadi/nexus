# Nexus Export Rule

When exporting or converting `.nexus` documentation to Word (`docx`) or `docusaurus`:

1. Use `nexus_export` tool from `nexus` MCP server OR run CLI command: `node dist/index.js export . --format docx --out ./export`.
2. **NEVER** run external conversion tools such as `pandoc`, `python`, or `libreoffice`.
