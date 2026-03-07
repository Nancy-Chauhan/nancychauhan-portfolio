---
title: "Enforcing Coding Best Practices with Automation"
description: "A practical guide to automating code quality enforcement using linters, pre-commit hooks, CI checks, and code review automation tools."
pubDate: 2021-09-10
tags: ["developer-experience", "tooling"]
image: "/blog/ci-best-practices.webp"
externalUrl: "https://faun.pub/enforcing-coding-best-practices-using-ci-b3287e362202"
---

Every engineering team has coding standards — naming conventions, formatting rules, architectural patterns, security practices. The challenge is not defining these standards but enforcing them consistently. Relying on manual code reviews to catch style violations and common mistakes is expensive, error-prone, and frustrating for both reviewers and authors. The solution is automation.

In this post, I will walk through the layers of automated enforcement that I have found most effective, from local development tools to CI pipelines and beyond.

## The Layers of Enforcement

Think of code quality enforcement as a series of concentric circles, each catching issues at a different stage:

1. **Editor/IDE integration** — Instant feedback as you type
2. **Pre-commit hooks** — Catch issues before code enters version control
3. **CI checks** — Enforce standards on every pull request
4. **Automated code review** — Provide contextual feedback at the PR level

Each layer catches a different class of issues, and together they create a robust safety net.

## Linters and Formatters

Linters and formatters are the foundation. A linter analyzes code for potential errors, style violations, and anti-patterns. A formatter automatically rewrites code to match a consistent style.

### Language-Specific Tools

**Go:** The Go ecosystem has this figured out better than most. `gofmt` (and its stricter cousin `goimports`) formats code, and there is essentially zero debate about style because the entire community uses the same formatter. `golangci-lint` aggregates dozens of linters into a single tool:

```yaml
# .golangci.yml
linters:
  enable:
    - errcheck
    - gosimple
    - govet
    - ineffassign
    - staticcheck
    - unused
    - misspell
    - gocyclo

linters-settings:
  gocyclo:
    min-complexity: 15
```

**JavaScript/TypeScript:** ESLint is the standard linter, and Prettier is the standard formatter. The key insight is to let Prettier handle formatting and ESLint handle logic errors — do not configure ESLint formatting rules when using Prettier:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

**Python:** `black` is the opinionated formatter (similar to `gofmt` in philosophy), `isort` handles import ordering, `flake8` or `ruff` handles linting, and `mypy` provides type checking. `ruff` has been gaining popularity rapidly because it reimplements many Python linting tools in Rust and runs orders of magnitude faster.

**Java:** Checkstyle enforces coding standards, SpotBugs finds potential bugs, and google-java-format handles formatting. For Kotlin, `ktlint` and `detekt` fill similar roles.

### The Key Principle

The most important rule with formatters is: **make them non-negotiable and automatic.** If formatting is a manual step that developers can skip, it will be inconsistent. If it runs automatically on save or on commit, it becomes invisible infrastructure that nobody thinks about.

## Pre-Commit Hooks

Pre-commit hooks run automatically before a `git commit` is created. They are your last line of defense before code enters the repository. The `pre-commit` framework (https://pre-commit.com) makes managing hooks straightforward:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict
      - id: detect-private-key
      - id: no-commit-to-branch
        args: ['--branch', 'main']

  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.40.0
    hooks:
      - id: eslint
        types: [javascript, tsx, typescript]
```

### What to Include in Pre-Commit Hooks

Good candidates for pre-commit hooks:

- **Formatters** (black, prettier, gofmt) — fast and deterministic
- **Simple linters** — syntax errors, import ordering
- **Secret detection** — tools like `detect-secrets` or `gitleaks` to prevent accidental credential commits
- **File hygiene** — trailing whitespace, end-of-file newlines, merge conflict markers

Bad candidates:

- **Full test suites** — too slow; save for CI
- **Complex static analysis** — tools that take minutes to run will frustrate developers
- **Anything requiring network access** — hooks should work offline

### Handling Resistance

Some developers dislike pre-commit hooks because they slow down the commit workflow. Here are strategies I have found effective:

1. **Keep hooks fast.** If hooks take more than 10 seconds, developers will find ways to bypass them (`--no-verify`). Audit hook performance regularly.
2. **Only run hooks on changed files.** The `pre-commit` framework does this by default, but custom hooks may not.
3. **Provide an escape hatch.** Document that `--no-verify` exists for emergencies, but make it clear that CI will catch anything hooks would have caught.

## CI Checks

CI (Continuous Integration) checks are the authoritative enforcement layer. Unlike pre-commit hooks, they cannot be bypassed. Every pull request must pass CI before merging.

### Essential CI Checks

**Linting and formatting verification:**
```yaml
# GitHub Actions example
- name: Check formatting
  run: |
    black --check .
    isort --check-only .

- name: Lint
  run: |
    ruff check .
    mypy src/
```

**Security scanning:**
```yaml
- name: Security scan
  run: |
    bandit -r src/
    safety check
    trivy fs .
```

**Dependency auditing:**
```yaml
- name: Audit dependencies
  run: |
    npm audit --production
    # or: pip-audit
    # or: go vuln check
```

**Test coverage thresholds:**
```yaml
- name: Run tests with coverage
  run: |
    pytest --cov=src --cov-fail-under=80
```

### Branch Protection Rules

CI checks are only as strong as your branch protection rules. In GitHub, configure these on your main branch:

- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require a minimum number of approving reviews
- Dismiss stale reviews when new commits are pushed
- Require signed commits (for sensitive projects)

This ensures that no code reaches your main branch without passing through your automated gates.

## Automated Code Review

Beyond linting, there are tools that provide higher-level feedback on pull requests:

**SonarQube/SonarCloud** performs deep static analysis and tracks technical debt over time. It can comment directly on PRs with issues like duplicated code, cognitive complexity, and security vulnerabilities.

**CodeClimate** provides maintainability ratings and can block PRs that decrease the overall code quality score.

**Danger** (https://danger.systems) is a framework for writing custom PR automation rules in Ruby, JavaScript, or Swift:

```javascript
// dangerfile.js
const { danger, warn, fail } = require('danger');

// Warn if PR is too large
if (danger.github.pr.additions + danger.github.pr.deletions > 500) {
  warn('This PR is quite large. Consider breaking it into smaller PRs.');
}

// Require changelog updates for feature PRs
const hasChangelog = danger.git.modified_files.includes('CHANGELOG.md');
if (!hasChangelog) {
  warn('No CHANGELOG entry found. Please add one if this is user-facing.');
}

// Fail if tests are missing for new source files
const newSrcFiles = danger.git.created_files.filter(f => f.startsWith('src/'));
const newTestFiles = danger.git.created_files.filter(f => f.includes('.test.'));
if (newSrcFiles.length > 0 && newTestFiles.length === 0) {
  fail('New source files were added without corresponding test files.');
}
```

## Building a Culture Around Automation

Tools alone are not enough. The way you introduce and maintain automated enforcement matters:

1. **Start gradually.** Do not dump 50 linting rules on an existing codebase. Start with a handful of critical rules, fix existing violations, and add more over time.

2. **Auto-fix when possible.** If a tool can fix an issue automatically, prefer that over just reporting it. Developers are more accepting of "I fixed this for you" than "you did this wrong."

3. **Document the why.** For every rule or check, explain why it exists. A linting rule without context feels arbitrary; a rule with a link to a past incident or security advisory feels reasonable.

4. **Treat tooling as code.** Configuration files for linters, CI pipelines, and pre-commit hooks should be reviewed with the same rigor as application code. They are part of your infrastructure.

5. **Measure and iterate.** Track false positive rates. If a rule generates more noise than value, reconsider it. The goal is to catch real issues, not to create busywork.

Automated enforcement frees up human reviewers to focus on what they do best: evaluating design decisions, questioning assumptions, and sharing knowledge. Let the machines handle the style guide.
