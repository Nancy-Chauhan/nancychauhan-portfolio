---
title: "MCP Agent OS"
tagline: "Production-ready MCP architecture reference implementation"
description: "Demonstrates the MCP chaining pattern: an Agent OS that consumes multiple external MCP servers and exposes itself as an MCP server for downstream clients."
featured: false
order: 5
github: "https://github.com/Nancy-Chauhan/mcp-agent-os"
image: "/projects/mcp-agent-os-architecture.png"
techStack:
  - Python
  - Agno Framework
  - FastAPI
  - SQLite
  - Anthropic API
  - Arize OpenTelemetry
steps:
  - title: "MCP Consumer"
    description: "Connects to external MCP servers - GitHub, Phoenix Docs, and Search - using HTTP and command-based transports."
  - title: "Agent OS"
    description: "Orchestrates specialized agents with session memory (SQLite-backed) and full observability via Arize OpenTelemetry tracing."
  - title: "MCP Provider"
    description: "Exposes the Agent OS as an MCP endpoint at http://localhost:7777/mcp for downstream clients."
  - title: "Multi-Team Clients"
    description: "Specialized clients for PM, DevRel, Sales, and Engineering teams - each querying the same Agent OS with different perspectives."
---

## Overview

A production-ready MCP architecture reference implementation demonstrating how to build AI agents that consume and expose Model Context Protocol servers. This project demonstrates the MCP chaining pattern.

### Features

| Feature | Description |
|---------|-------------|
| MCP Consumer | Connects to GitHub, Phoenix Docs, and Search MCP servers |
| MCP Provider | Exposes Agent OS as an MCP endpoint |
| Arize Tracing | Full observability with OpenTelemetry integration |
| Multi-Team Support | Specialized clients for PM, DevRel, Sales, and Engineering |
| Session Memory | SQLite-backed conversation history and summaries |
