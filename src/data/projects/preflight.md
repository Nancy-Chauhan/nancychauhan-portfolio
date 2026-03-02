---
title: "Preflight"
tagline: "Know exactly where your system breaks before you ship."
description: "A Claude Code plugin that reads your codebase, traces every service call, and simulates what happens when real users hit your system. Finds bottlenecks, cost cliffs, and rate limits."
featured: true
order: 3
github: "https://github.com/Nancy-Chauhan/preflight"
image: "/projects/preflight-overview.png"
techStack:
  - Claude Code Plugin
  - TypeScript
  - 40+ Service Integrations
steps:
  - title: "Read & Trace"
    description: "Preflight reads your code with Claude's built-in tools. It traces every API route, cron job, and webhook to the services it calls. Completely read-only - nothing installed, no code executed."
  - title: "Detect & Simulate"
    description: "Detects multipliers ('for each user, call LLM once and send one email'), finds hard caps, concurrency limits, and timeout values. Simulates daily volume at your target user count."
  - title: "Report"
    description: "Generates detailed reports with severity-rated findings. Export as Markdown, HTML, or PDF. Finds rate limits, tier thresholds, data growth projections, and cascading failure points."
---

## Overview

Preflight is a Claude Code plugin that reads your codebase, traces every service call, and simulates what happens when real users hit your system. It finds the bottlenecks, cost cliffs, rate limits, and breaking points you'd otherwise discover in production.

### What It Finds

- "Your Stripe webhook handler isn't idempotent - a retry will charge the customer twice"
- "Your image upload accepts files up to 50MB but Cloudflare Workers has a 25MB request body limit"
- "At 500 orders/day you'll make 1,500 Stripe API calls - that hits the 100/sec rate limit during flash sales"
- "Your Vercel Hobby plan has a 10s function timeout but your PDF generation takes 40 seconds"

### Coverage

Covers 40+ services across AI/LLM, databases, email, hosting, auth, payments, storage, analytics, and messaging. Optimized for Next.js, Express, Django, FastAPI, Rails, Go, and Rust frameworks.
