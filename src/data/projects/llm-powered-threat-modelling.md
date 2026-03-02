---
title: "LLM-Powered Threat Modelling"
tagline: "Self-serve threat modeling powered by large language models"
description: "A threat modeling platform that uses LLMs to analyze system designs and generate comprehensive STRIDE-based security assessments, with JIRA integration and shareable reports."
featured: true
order: 2
github: "https://github.com/Nancy-Chauhan/llm-powered-threat-modelling"
techStack:
  - React 18
  - TypeScript
  - Hono
  - Bun
  - PostgreSQL
  - Drizzle ORM
  - OpenAI / Claude API
  - Tailwind CSS
steps:
  - title: "Architecture Input"
    description: "Engineers provide system details through an intuitive interface - upload PRDs, architecture diagrams, screenshots, or import JIRA tickets with comments and attachments as context."
  - title: "LLM Analysis"
    description: "The architecture is processed through OpenAI or Anthropic models that decompose the system into components, identify assets, entry points, and trust boundaries."
  - title: "Threat Generation"
    description: "Threats are generated and categorized using the STRIDE methodology with Likelihood x Impact risk scoring. Each threat includes actionable mitigations with priority and effort estimates."
  - title: "Share & Export"
    description: "Generate public share links for stakeholders or export reports in Markdown and JSON formats. Integrate directly into issue trackers for engineering follow-up."
---

## Overview

A self-serve threat modeling platform that puts automated security analysis directly in the hands of engineering teams. By combining structured architecture inputs with LLM reasoning, the tool produces threat models that are both comprehensive and actionable.

### Key Features

- **JIRA Integration** - Import JIRA tickets with comments, links, and attachments as context
- **Upload Context** - Support for PRDs, architecture diagrams, screenshots, and text files
- **LLM-Powered Analysis** - Automatic threat generation using OpenAI or Anthropic
- **STRIDE Methodology** - Threats categorized by Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege
- **Risk Scoring** - Likelihood x Impact scoring with severity classification
- **Shareable Reports** - Generate public share links for stakeholders
