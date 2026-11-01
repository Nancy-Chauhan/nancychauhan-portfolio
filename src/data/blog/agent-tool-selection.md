---
title: "Agent Tool Selection: The Tool Your Agent Almost Called"
description: "Putting a decision model in front of an agent's tools and trusting its pick only above a confidence threshold cut empty or unfinished replies from 21 to 3 across 300 turns."
pubDate: 2026-10-26
tags: ["ai-agents", "agent-observability"]
image: "/blog/agent-tool-selection.png"
externalUrl: "https://www.linkedin.com/pulse/agent-tool-selection-your-almost-called-nancy-chauhan-87h3c"
---

A decision model scores every available tool, and Phoenix traces each pick as a DECISION span. Low-confidence picks (below ~0.7) went wrong about one time in three, so below that threshold the chat model picks the tool itself.
