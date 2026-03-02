---
title: "Info Disclosure Scanner"
tagline: "AI-powered scanner for information disclosure vulnerabilities"
description: "Uses Claude AI to detect sensitive information leakage in web applications. Checks 50+ sensitive paths, headers, JavaScript files, and error responses."
github: "https://github.com/Nancy-Chauhan/info-disclosure-scanner"
image: "/projects/info-scanner-screenshot.png"
featured: false
order: 7
techStack:
  - Python
  - Claude API
  - HTML Reports
steps:
  - title: "Scan"
    description: "Checks 50+ sensitive paths, response headers, JavaScript files, and error responses for information leakage."
  - title: "AI Analysis"
    description: "Claude AI analyzes findings to identify real information disclosure vulnerabilities with severity ratings."
  - title: "Report"
    description: "Generate HTML reports with risk scores and detailed findings. Also supports Markdown, JSON, and SARIF output."
---

## Overview

An AI-powered security scanner that detects sensitive information leakage in web applications using Claude AI. Finds exposed `.git` repos, `.env` files, database dumps, admin panels, stack traces, and secrets in JavaScript.

### What It Detects

| Severity | Examples |
|----------|----------|
| **High** | Exposed `.git` repos, `.env` files, database dumps, hardcoded passwords |
| **Medium** | Admin panels, stack traces, secrets in JavaScript, debug endpoints |
| **Low** | Server version disclosure, robots.txt, technology fingerprinting |
| **Info** | Missing security headers (CSP, HSTS, X-Frame-Options) |

### Demo with OWASP Juice Shop

```bash
docker run -d -p 3000:3000 bkimminich/juice-shop
python scanner.py http://localhost:3000 --html report.html
# Finds 80+ vulnerabilities
```
