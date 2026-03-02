---
title: "SecLoop"
tagline: "Autonomous security scanner & auto-fixer powered by LLM loops"
description: "Scan, fix, verify - in a loop until clean. SecLoop automates dependency scanning, secret detection, and SAST analysis with LLM-powered auto-patching."
featured: true
order: 4
github: "https://github.com/Nancy-Chauhan/secloop"
image: "/projects/secloop-architecture.svg"
techStack:
  - Python
  - pip-audit
  - semgrep
  - gitleaks
  - Claude API
steps:
  - title: "Scan"
    description: "Run security tools - pip-audit for dependency CVEs, semgrep/bandit for SAST (SQL injection, XSS, command injection), and gitleaks for hardcoded secrets."
  - title: "Fix"
    description: "LLM generates patches for each vulnerability found. Supports Python, Node.js, Go, Rust, and Ruby ecosystems."
  - title: "Test"
    description: "Verify nothing broke after patching."
  - title: "Repeat"
    description: "Loop until all vulnerabilities are fixed. Uses the Ralph Loop pattern - an iterative LLM loop for autonomous remediation."
---

## Overview

Security vulnerabilities pile up. Dependency updates break things. Manual fixes take hours. SecLoop automates it all - scan, fix, verify, in a loop until clean.

### Scanners

| Scanner | What it Detects | Tool |
|---------|-----------------|------|
| Dependencies | CVEs in packages | pip-audit, npm audit, cargo-audit |
| Secrets | API keys, passwords, tokens | gitleaks |
| SAST | SQL injection, XSS, command injection | semgrep, bandit |

### Usage

```bash
secloop audit ./my-project    # Run all scanners
secloop run ./my-project      # Auto-fix using LLM loops
secloop secrets . --history   # Scan git history for leaked secrets
```

Supports CI/CD with GitHub Actions and SARIF output for integration with GitHub Code Scanning.
