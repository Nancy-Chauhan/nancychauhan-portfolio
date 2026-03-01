---
title: "Preflight"
tagline: "Claude Code plugin for security-first codebase scanning"
description: "A Claude Code extension that scans codebases for security issues, misconfigurations, and compliance gaps before code ships to production."
featured: true
order: 3
techStack:
  - TypeScript
  - Claude API
  - AST Parsing
  - Node.js
steps:
  - title: "Codebase Scan"
    description: "Preflight performs a deep scan of the codebase using AST parsing to build a structural understanding of the code. It identifies security-sensitive patterns including authentication flows, data handling, API endpoints, and infrastructure-as-code configurations."
  - title: "Analysis"
    description: "Scanned code structures are analyzed by Claude to detect security vulnerabilities, misconfigurations, and compliance gaps. The analysis goes beyond pattern matching by understanding code semantics, data flow, and the broader context of how components interact."
  - title: "Reporting"
    description: "Findings are presented directly within the Claude Code interface with clear severity ratings, affected code locations, and actionable fix suggestions. Reports can be exported for compliance documentation and integrated into CI/CD gates to prevent insecure code from reaching production."
---

## Overview

Security scanning tools often produce noisy results that developers learn to ignore. Preflight takes a different approach by combining static analysis through AST parsing with the contextual understanding of Claude, Anthropic's AI model. This combination allows the tool to identify real security issues with high precision while filtering out false positives that plague traditional scanners.

As a Claude Code plugin, Preflight integrates directly into the developer workflow. Engineers can run security scans as part of their normal coding session, getting immediate feedback on potential issues before code leaves their machine. The tool understands the difference between a test fixture and production code, between an intentional security decision and an oversight, resulting in findings that developers actually want to act on.

Preflight covers a broad range of security concerns including injection vulnerabilities, authentication and authorization flaws, secrets exposure, insecure cryptographic usage, and infrastructure misconfigurations. Each finding includes not just the problem description but a concrete remediation suggestion that Claude generates based on the specific codebase context. This makes fixing issues as straightforward as reviewing and applying the suggested change.
