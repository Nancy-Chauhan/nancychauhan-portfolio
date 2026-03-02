---
title: "SkillFeed"
tagline: "Stop reading duplicate articles. Get the one brief that matters."
description: "An AI-powered newsletter aggregator that ingests 100+ sources, categorizes with Claude AI, and delivers one personalized daily brief to developers at 8 AM in their local timezone."
featured: true
order: 1
github: "https://github.com/Nancy-Chauhan/skillfeed"
image: "/projects/skillfeed-architecture.svg"
techStack:
  - Next.js 16
  - TypeScript
  - Supabase
  - Claude API
  - Resend
  - Tailwind CSS v4
  - Bun
steps:
  - title: "Ingest"
    description: "65 RSS feeds and 35 email newsletters arrive via AgentMail webhooks (Svix-verified). Articles enter an async queue with exponential backoff retry."
  - title: "Categorize"
    description: "Claude AI extracts title, summary, takeaway, level, roles, keywords, and URL from each article."
  - title: "Match & Schedule"
    description: "Every hour, a cron finds users where it's 8 AM in their timezone. A Supabase function matches the top 15 unread articles from the last 7 days to each user's profile."
  - title: "Compose & Deliver"
    description: "Claude generates a personalized newsletter with 'why it matters' context. Resend delivers the email with open/click tracking and one-click unsubscribe."
---

## Overview

SkillFeed is an AI-powered newsletter aggregator that delivers one personalized daily brief to developers. It ingests content from 100+ sources (65 RSS feeds and 35 email newsletters), categorizes articles using Claude AI, and matches them to each user's skills, role, and career goals.

### Key Features

- **AI-Powered Curation** - Claude categorizes articles by role, level, and keywords, then composes personalized newsletters with "why it matters" context
- **Smart Matching** - Supabase Database Function matches articles using role overlap, level compatibility, and keyword intersection
- **Timezone-Aware Delivery** - Newsletters arrive at 8 AM in each user's local timezone
- **Multi-Source Ingestion** - Pulls from 65 RSS feeds and 35 email newsletters via AgentMail webhooks
- **Engagement Tracking** - Open rates, click tracking, and per-article feedback
- **One-Click Unsubscribe** - JWT-based unsubscribe with `List-Unsubscribe` header support
