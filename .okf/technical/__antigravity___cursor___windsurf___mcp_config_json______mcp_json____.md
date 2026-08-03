# Technical Specification: **Antigravity / Cursor / Windsurf (`mcp_config.json` / `.mcp.json`)**

## 1. Overview
Technical specification and architectural contract for ****Antigravity / Cursor / Windsurf (`mcp_config.json` / `.mcp.json`)****.

---

## 2. Technical Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Client as Caller / EntryPoint
    participant Module as **Antigravity / Cursor / Windsurf (`mcp_config.json` / `.mcp.json`)**
    participant Engine as Internal Logic / Provider
    participant Storage as FileSystem / Data Store

    Client->>Module: Invoke **Antigravity / Cursor / Windsurf (`mcp_config.json` / `.mcp.json`)** capability
    Module->>Engine: Process request parameters
    Engine->>Storage: Read/Write module state
    Storage-->>Engine: State response
    Engine-->>Module: Execution result
    Module-->>Client: Return outcome / data
```

---

## 3. Related Components

### Knowledge Graph Nodes (1)
- `51`

### Source Files (1)
- ``

---

## 4. Architecture & Execution Details
*Implementation details extracted from Knowledge Graph analysis.*

- **Module Scope**: **Antigravity / Cursor / Windsurf (`mcp_config.json` / `.mcp.json`)**
- **Data Mutability**: State updates written via OKF Storage adapter.
- **Dependencies**: Interacts with related graph components.