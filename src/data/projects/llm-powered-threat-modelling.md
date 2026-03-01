---
title: "LLM-Powered Threat Modelling"
tagline: "Self-serve threat modeling powered by large language models"
description: "An automated threat modeling tool that leverages LLMs to analyze system architectures and generate comprehensive threat models, enabling engineering teams to self-serve security assessments."
featured: true
order: 1
techStack:
  - TypeScript
  - Node.js
  - OpenAI API
  - React
  - PostgreSQL
github: "https://github.com/nancychauhan"
steps:
  - title: "Architecture Input"
    description: "Engineers provide system architecture details through an intuitive interface, including data flow diagrams, component descriptions, and trust boundaries. The tool accepts multiple input formats such as structured YAML, diagram imports, and free-text descriptions."
  - title: "LLM Analysis"
    description: "The architecture input is processed through a pipeline of LLM prompts that decompose the system into analyzable components. The model identifies assets, entry points, and trust boundaries, building an internal representation of the threat surface."
  - title: "Threat Generation"
    description: "Using the analyzed architecture, the LLM generates a comprehensive list of threats mapped to industry frameworks like STRIDE and OWASP Top 10. Each threat is scored by likelihood and impact, with contextual reasoning provided for every finding."
  - title: "Report & Remediation"
    description: "A detailed threat model report is generated with actionable remediation guidance for each identified threat. Reports can be exported in multiple formats and integrated directly into issue trackers for engineering follow-up."
---

## Overview

Traditional threat modeling is a manual, time-intensive process that requires dedicated security expertise and often becomes a bottleneck in fast-moving engineering organizations. LLM-Powered Threat Modelling changes this by putting the power of automated security analysis directly in the hands of engineering teams. By combining structured architecture inputs with the reasoning capabilities of large language models, the tool produces threat models that are both comprehensive and actionable.

The system works by first ingesting architecture descriptions in flexible formats, then running them through a carefully engineered chain of LLM prompts. Each prompt stage focuses on a different aspect of the analysis — from identifying assets and trust boundaries to generating specific attack scenarios and mapping them to established threat frameworks. This multi-stage approach ensures depth and consistency in the output while keeping the analysis grounded in recognized security standards.

The result is a self-serve platform where any engineering team can generate a threat model in minutes rather than weeks. The generated reports include prioritized threats, detailed attack narratives, and concrete remediation steps that teams can immediately act on. By lowering the barrier to threat modeling, the tool helps organizations shift security left and embed threat analysis into their standard development workflow.
