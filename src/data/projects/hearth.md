---
title: "Hearth"
tagline: "Decision-model browser agent for rental search."
description: "An AI browser agent where a TypeSafe decision model, not the chat model, picks each next action as it drives a real Chrome across Craigslist, Facebook Marketplace, Redfin and Zillow, and returns one honest shortlist. You watch every click. It only reads pages: it never messages sellers or starts transactions."
featured: true
order: 0
github: "https://github.com/Nancy-Chauhan/hearth-jev-rental-search"
image: "/projects/hearth-backdrop.jpg"
video: "/projects/hearth-demo.mp4"
techStack:
  - Python
  - JavaScript
  - Browser Use / Jev Ultrafast
  - TypeSafe decision model
  - Chrome DevTools Protocol
steps:
  - title: "Ask"
    description: "Type or speak a search like 'studio in Oakland under $2,500, near BART'. Hearth turns it into filters for location, budget, home type, recency and marketplaces."
  - title: "Decide"
    description: "At every step, a TypeSafe decision model scores the possible next actions and picks one with a confidence score. Searches fan out across marketplaces, and every decision shows up in a live activity rail with its cost and duration."
  - title: "Drive"
    description: "Hearth opens one tab per marketplace in a dedicated Chrome and carries out each decision with real clicks you can watch."
  - title: "Handle walls honestly"
    description: "On a bot check, sign-in wall or rate limit, Hearth reports it, keeps what it already collected and moves on. It never solves CAPTCHAs or enters credentials."
  - title: "Shortlist"
    description: "Returns a first match, a shortlist and a report of up to 18 listings with photo, rent, facts and a direct link. A tick means the listing proved a detail; a question mark means it didn't say."
---

## Overview

Hearth is an AI agent that searches four rental marketplaces (Craigslist, Facebook Marketplace, Redfin and Zillow) from one plain-language request. It drives a real Chrome browser so you can watch every click, and it merges everything into a single shortlist.

## Architecture

<div class="diagram-scroll">
  <a href="/projects/hearth-architecture.svg" target="_blank" rel="noopener noreferrer">
    <img src="/projects/hearth-architecture.svg" alt="Hearth architecture: the Hearth UI talks to a local Python server whose agent loop observes the page, asks the TypeSafe decision model for an operation and target, guards, and acts over CDP through browser-harness on a dedicated Chrome that opens Craigslist, Facebook Marketplace, Redfin and Zillow" width="1700" height="1370" loading="lazy" decoding="async" />
  </a>
</div>
<p class="diagram-hint">Swipe to see the whole diagram, or tap to open it full size.</p>

### Decisions, not guesses

Hearth separates *deciding* from *talking*. A dedicated [TypeSafe](https://docs.typesafe.ai/patterns/fan-out) decision model picks each browser action and returns a probability for every option, so each choice is scored, traceable and cheap (a whole search costs a fraction of a cent). It's the same pattern behind [Agent Tool Selection: The Tool Your Agent Almost Called](https://www.linkedin.com/pulse/agent-tool-selection-your-almost-called-nancy-chauhan-87h3c), where confidence-gated decisions cut empty or unfinished agent replies from 21 to 3.

### Read-only by design

- Never messages a seller, saves a listing or starts a transaction
- Only clicks controls it can see; never enters credentials or creates accounts
- Says when a source stopped early instead of pretending the search finished
- Runs entirely on your machine, with the API key kept in `.env`

### Built on

Hearth is built on [Jev Ultrafast](https://github.com/browser-use/jev-ultrafast) by Browser Use, with decisions from [TypeSafe](https://docs.typesafe.ai/patterns/fan-out).
