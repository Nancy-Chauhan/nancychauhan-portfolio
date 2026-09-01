---
title: "AgentJail"
tagline: "Policy guardrails for coding agents"
description: "A personal open-source product Nancy is actively building to stop dangerous coding-agent actions before they run, using deterministic local policy enforcement for files, shell commands, MCP tools, networks, and credentials."
github: "https://github.com/LuD1161/agentjail"
demo: "https://agentjail.io/"
featured: false
order: 0
techStack:
  - Go
  - Open Policy Agent
  - Rego
  - Landlock
  - Seatbelt
steps:
  - title: "Intercept"
    description: "Capture a coding agent's tool call before the requested shell command, file operation, MCP action, or network request executes."
  - title: "Evaluate"
    description: "Evaluate the action locally against deterministic policy-as-code rules using Open Policy Agent and Rego."
  - title: "Enforce"
    description: "Allow, deny, or require approval before execution, with OS-native sandboxing through Landlock on Linux and Seatbelt on macOS."
  - title: "Audit"
    description: "Record policy decisions and agent activity so teams can inspect what happened without relying on prompt-based guardrails."
---

## Overview

Nancy is actively building AgentJail as a personal open-source product for governing coding agents. It checks tool calls locally before they run and blocks dangerous actions using deterministic policy rather than instructions that a model can ignore.

AgentJail works with Claude Code, Codex CLI, and Cursor. Its controls cover sensitive file access, destructive shell commands, untrusted MCP tools, network egress, and cloud or database credentials.

## Why It Exists

Coding agents can access developer machines, credentials, repositories, and production systems. Prompt files are useful context, but they are not an enforcement boundary. AgentJail adds a policy layer outside the model so unsafe actions can be stopped before execution.

## Core Capabilities

- Local, offline policy evaluation with Open Policy Agent and Rego
- File, command, MCP, credential, and network controls
- OS-native sandboxing with Linux Landlock and macOS Seatbelt
- Default-deny policies and auditable decisions
- Support for Claude Code, Codex CLI, and Cursor

Learn more at [agentjail.io](https://agentjail.io/) or review the [open-source repository](https://github.com/LuD1161/agentjail).
