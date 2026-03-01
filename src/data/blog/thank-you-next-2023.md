---
title: "Thank You, Next — 2023"
description: "A year-in-review reflecting on starting at Cornell University, co-founding Women in Cloud Native, contributing to LocalStack, and the big move to the United States."
pubDate: 2023-12-31
tags: ["year-in-review", "personal"]
---

2023 was the year everything changed. I moved across the world to start graduate school at Cornell University, co-founded the Women in Cloud Native initiative, contributed to LocalStack, and navigated the enormous transition of building a new life in the United States. It was challenging, exhilarating, and transformative.

## The Big Move

In August, I packed my life into two suitcases and flew from India to Ithaca, New York. I had never lived outside of India before, and the move was equal parts exciting and terrifying. The logistics alone were overwhelming — visa paperwork, finding housing from 8,000 miles away, figuring out a completely different banking system, and adjusting to a climate where winter actually means something.

The cultural adjustment was real. Small things threw me off — the grocery stores, the quiet of a small American college town after years in bustling Indian cities, the social norms around conversation. But larger things grounded me — the warmth of the Cornell community, the universal language of code, and the shared experience of being an international student surrounded by others going through the same transition.

By the end of the semester, Ithaca had started to feel like home. Not in the way India feels like home — that is a different, deeper thing — but in the way a place can become familiar and comforting when you build routines and relationships within it.

## Starting at Cornell

Cornell's Computer Science program is rigorous, and the first semester did not ease me into it gently. I took courses in distributed systems, algorithms, and machine learning, each demanding in its own way.

The distributed systems course was immediately relevant to my industry experience. Having worked with Kubernetes, observability tools, and cloud infrastructure professionally, I had practical intuition about many of the concepts. But the course gave me the theoretical foundations I had been missing — formal models of consistency, rigorous proofs about consensus, and a deeper understanding of the trade-offs that underpin the systems I had used in production.

The algorithms course was humbling. My industry background had given me a working knowledge of data structures and algorithms, but the mathematical rigor of a graduate-level course was a step up. I spent more time on problem sets than I care to admit, but the payoff was a much stronger foundation in computational thinking.

What surprised me most about Cornell was the collaborative culture. I expected an intensely competitive environment, but my classmates were generous with their time and knowledge. Study groups formed organically, and people helped each other without keeping score. That spirit made the heavy workload manageable.

## Women in Cloud Native

One of the initiatives I am most proud of in 2023 is co-founding Women in Cloud Native. The idea grew out of conversations at CNCF community events where women consistently reported feeling isolated or underrepresented in the cloud native ecosystem.

Women in Cloud Native aims to create a supportive space for women and non-binary individuals working in cloud native technologies. We organize:

- **Monthly meetups** (virtual) featuring technical talks by women in the community
- **Mentorship pairings** connecting experienced engineers with newcomers
- **Conference networking events** at KubeCon and other CNCF events
- **A resource library** of talks, blog posts, and learning paths curated by community members

The response was beyond what we expected. Within a few months, we had hundreds of members across multiple countries. The stories people shared — about feeling seen for the first time in a tech community, about finding mentors, about gaining the confidence to submit a conference talk — reminded me why community work matters.

Diversity in open source is not just a social good; it is a technical imperative. Diverse teams build better software because they bring different perspectives, catch different edge cases, and challenge assumptions that homogeneous groups miss. Initiatives like Women in Cloud Native help create the pipeline for that diversity.

## LocalStack Contributions

On the technical side, 2023 was the year I started contributing to LocalStack, a project that provides a local emulation of AWS cloud services for development and testing. LocalStack is one of those tools that, once you start using it, you wonder how you ever developed without it. Instead of deploying to AWS for every test, you can run your entire stack locally with realistic AWS API behavior.

My contributions focused on improving the developer experience around specific service emulations. I worked on:

- **Bug fixes in the SQS and SNS emulations**, ensuring that message ordering and delivery semantics matched AWS behavior more closely
- **Documentation improvements**, particularly around setting up LocalStack in CI/CD pipelines
- **Integration test coverage**, adding tests that validated the behavior of emulated services against the AWS specification

Contributing to LocalStack taught me a lot about how AWS services actually work under the hood. When you are implementing an emulation of an API, you need to understand every parameter, every error code, and every edge case. It is one of the most effective ways to deeply learn a technology.

The LocalStack community was also welcoming and well-organized. Issues were clearly labeled, maintainers were responsive, and the contribution process was smooth. It is a model for how to run an open source project.

## Staying Connected to Cloud Native

Even while adjusting to graduate school, I stayed active in the cloud native community:

- I attended KubeCon North America virtually and wrote summary posts about the talks that resonated most
- I continued participating in CNCF Special Interest Groups, particularly around observability
- I gave a guest lecture at Cornell on cloud native observability, introducing my classmates to Prometheus, Grafana, and distributed tracing
- I mentored two newcomers through their first CNCF contributions

Maintaining these connections while navigating a full-time graduate program required intentional time management. I set aside specific blocks each week for community work and was honest with myself about when I needed to pull back. The community was understanding — one of the benefits of open source is that there is no obligation to contribute on someone else's schedule.

## Lessons from the Year

A few things I learned (or relearned) in 2023:

**Transitions are harder than they look.** Moving to a new country, starting a rigorous academic program, and adjusting to a completely different lifestyle all at once is a lot. I underestimated the emotional and cognitive toll. Giving yourself grace during transitions is not weakness — it is survival.

**Theoretical knowledge and practical experience complement each other beautifully.** My industry experience made academic concepts concrete, and academic rigor made my practical skills more principled. If you have the opportunity to combine both, take it.

**Community is portable.** The cloud native community welcomed me in India, and it welcomed me just the same from Ithaca. Geographic boundaries matter less than shared purpose.

**Say yes to things that scare you.** Moving to the US, applying to Cornell, co-founding an initiative — each of these scared me. Each of them turned out to be one of the best decisions of the year.

## Looking Ahead

2024 will bring the second year of my Master's program, a summer internship, deeper involvement in the CNCF as I pursue the Ambassador program, and hopefully more contributions to the cloud native ecosystem. I am entering the year with a stronger foundation, a clearer sense of direction, and an enormous amount of gratitude for the people and communities that made 2023 possible.

Thank you, 2023. You were not easy, but you were exactly what I needed.
