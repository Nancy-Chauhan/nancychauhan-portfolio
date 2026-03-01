---
title: "Thank You, Next — 2025"
description: "A year-in-review reflecting on graduating from Cornell, joining Agno, speaking at KubeCon EU, working on AI agents, and life in New York City."
pubDate: 2025-12-31
tags: ["year-in-review", "personal"]
---

Another year wraps up, and what a year it has been. 2025 was a year of transitions — finishing one chapter and starting an entirely new one. I graduated from Cornell, dove into the world of AI agents, spoke at KubeCon EU, and settled into New York City as my home base. Here is the full story.

## Graduating from Cornell

In May, I walked across the stage at Cornell University and officially earned my Master's degree in Computer Science. It still feels surreal. Two years earlier, I had moved across the world from India to Ithaca, New York, uncertain about whether I was making the right choice. Looking back, it was one of the best decisions I have ever made.

Cornell challenged me in ways I did not anticipate. The coursework in distributed systems and machine learning pushed my technical boundaries, but the real growth was in learning to think rigorously about problems. The research environment taught me to question assumptions, read papers critically, and articulate ideas clearly. I also had the privilege of being surrounded by brilliant classmates from diverse backgrounds who broadened my perspective on technology and its impact.

I want to thank my professors, advisors, and the Cornell CS community for an incredible two years. Special gratitude to the friends who made Ithaca winters bearable — you know who you are.

## Joining Agno

After graduation, I joined Agno, a startup working at the intersection of AI and developer tools. The company is building infrastructure for AI agents — software that can autonomously plan and execute multi-step tasks. It is a space that barely existed a few years ago but is now one of the most active areas in tech.

My role bridges backend engineering and developer advocacy. On the engineering side, I work on the agent runtime — the system that orchestrates tool calls, manages context, and handles the complex state machines that underpin agent behavior. On the advocacy side, I write technical content, create demos, and engage with the developer community to help people understand what agents can do and how to build them.

What excites me most about this work is the potential to fundamentally change how developers interact with software. Agents are not just chatbots — they are systems that can read codebases, run tests, deploy infrastructure, and iterate on solutions. We are still in the early days, but the progress in 2025 has been remarkable.

## KubeCon EU

One of the highlights of the year was speaking at KubeCon + CloudNativeCon Europe in London. I presented a talk on building observable AI agent systems using cloud native infrastructure — covering how to apply the observability patterns we have developed for microservices (distributed tracing, structured logging, metrics) to the new world of agent orchestration.

The talk drew a packed room, and the questions afterward were some of the most engaging I have experienced at a conference. The cloud native community is genuinely curious about how AI fits into the infrastructure they have built, and the conversations I had in the hallway track were even more valuable than the talk itself.

KubeCon EU also gave me the chance to reconnect with friends from the CNCF community who I had not seen in person since before my time at Cornell. The cloud native community continues to be one of the most welcoming and technically rigorous groups in tech, and I am grateful to be part of it.

## AI and Agents

2025 was undeniably the year of AI agents. The leap from large language models that generate text to systems that can take actions, use tools, and reason through multi-step problems has been dramatic. I spent much of the year thinking about and building in this space.

Some of the themes that stood out to me:

**Tool use became table stakes.** Every major model provider now supports function calling, and the ecosystem of tools and integrations has exploded. The challenge shifted from "can the model call a tool?" to "how do we orchestrate complex tool chains reliably?"

**Reliability is the hard problem.** Getting an agent to work 80% of the time is straightforward. Getting it to work 99% of the time is an order of magnitude harder. Error handling, retry logic, and graceful degradation are the unsexy but critical engineering challenges.

**Evaluation is still unsolved.** How do you test an agent? Unit tests do not capture the non-deterministic nature of LLM outputs, and end-to-end tests are expensive and slow. The industry is still figuring out the right abstractions for agent testing.

**The infrastructure layer is emerging.** Just as Kubernetes emerged as the orchestration layer for containers, we are seeing the beginning of an infrastructure layer for agents — registries for tools, protocols for agent-to-agent communication, and observability standards for agent behavior.

## Life in New York City

After two years in Ithaca, moving to New York City was a shock to the system — in the best way. The energy of the city is infectious. I live in Brooklyn and commute to Manhattan, and I have fallen in love with the rhythm of NYC life.

The tech community here is vibrant. I have attended meetups at every scale — from intimate gatherings of 15 people in a coworking space to multi-hundred-person events at company headquarters. The diversity of industries represented in NYC tech is unique. In a single week, I might meet engineers working on fintech, media, fashion tech, and biotech. It broadens your thinking about what technology can be.

I also joined a running club, explored far too many ramen shops, and discovered that Central Park is as magical as everyone says. New York has a way of making you feel both small and powerful at the same time.

## Looking Ahead to 2026

As I look forward, I am excited about several things:

- Deepening my work on AI agent infrastructure at Agno
- Speaking at more conferences and sharing what I am learning
- Writing more technical content — this blog has been neglected, and I want to change that
- Continuing to contribute to the cloud native community
- Running the Brooklyn Half Marathon in the spring

2025 was a year of new beginnings, and I feel like I am just getting started. Thank you to everyone who was part of this journey — mentors, colleagues, friends, and the open source community. Here is to 2026.
