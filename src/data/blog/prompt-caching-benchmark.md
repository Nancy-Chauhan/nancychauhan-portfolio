---
title: "Prompt Caching Benchmark: High Cache Reuse Doesn't Always Mean Lower Cost"
description: "Benchmarking four models on multi-turn shopping-assistant conversations: the model with the highest cache reuse wasn't the cheapest, because output tokens drove most of the spend."
pubDate: 2026-10-21
tags: ["llm-cost", "agent-observability"]
image: "/blog/prompt-caching-benchmark.png"
externalUrl: "https://www.linkedin.com/pulse/prompt-caching-benchmark-high-cache-reuse-doesnt-always-nancy-chauhan-dy8gc"
---

Claude reused 89.8% of prompt tokens from cache yet had the highest estimated cost, mostly from output. Cache reuse rose with conversation length for all four models.
