---
title: "Thank You, Next — 2024"
description: "A year-in-review reflecting on my Cornell journey, internship at Exostellar, becoming a CNCF Ambassador, and contributions to the cloud native community."
pubDate: 2024-12-31
tags: ["year-in-review", "personal"]
---

2024 has been a year of deepening — deepening my technical skills at Cornell, deepening my connection to the cloud native community, and deepening my understanding of what I want my career to look like. Here is the full reflection.

## Cornell: Year Two

The second year of my Master's program at Cornell was markedly different from the first. Where Year One was about adjusting to a new country, a new academic system, and an intense pace of learning, Year Two was about applying that foundation. I chose courses that aligned with my long-term interests: advanced distributed systems, cloud computing, and a seminar on the practical applications of large language models.

The distributed systems course, in particular, was transformative. We implemented consensus protocols from scratch, built a distributed key-value store, and debugged race conditions that only manifested under specific timing conditions. It was the kind of work that makes you appreciate why distributed systems engineering is so hard — and so rewarding.

My research work focused on optimizing resource scheduling in Kubernetes environments, exploring how machine learning models could predict workload patterns and preemptively scale resources. This work connected directly to my industry experience and gave me a framework for thinking about the intersection of ML and infrastructure.

## Exostellar Internship

During the summer, I interned at Exostellar, a company building cloud optimization technology. My project involved working on their intelligent workload management platform, which dynamically migrates and schedules compute workloads across cloud instances to minimize cost while maintaining performance SLAs.

The engineering challenges were fascinating. I worked on the scheduling algorithm that decides when and where to migrate workloads, accounting for factors like spot instance pricing, data locality, network latency, and application-specific constraints. The system needed to make decisions in real time while handling the complexity of multi-cloud environments.

Beyond the technical work, the internship reinforced my appreciation for the gap between academic research and production systems. Papers describe algorithms in clean, deterministic environments. Production systems deal with partial failures, noisy data, and the thousand edge cases that papers gloss over. Bridging that gap is where the real engineering happens.

## CNCF Ambassador

One of the proudest moments of 2024 was being selected as a CNCF Ambassador. The Cloud Native Computing Foundation has been central to my professional development since my earliest open source contributions, and being recognized as an ambassador felt like a milestone.

As an ambassador, my role is to promote cloud native technologies and help grow the community. In practice, this meant:

- **Organizing meetups** at Cornell, bringing the cloud native conversation to an academic audience that is eager to learn but often disconnected from industry practices
- **Mentoring newcomers** to the CNCF ecosystem, helping them navigate the landscape of projects and find contribution opportunities
- **Speaking at events** about cloud native observability and developer experience, sharing practical insights from both my industry and academic work
- **Writing and sharing content** about cloud native technologies, making complex topics accessible to a broader audience

The CNCF community continues to inspire me. The people I have met through this ecosystem — maintainers, contributors, advocates — are some of the most generous and technically rigorous engineers I know. They freely share knowledge, mentor newcomers, and build tools that power a significant portion of the internet's infrastructure.

## Conference Talks and Community

2024 was an active year on the speaking circuit:

I gave a talk at a CNCF community event on "Observability for the Next Generation of Cloud Native Applications," exploring how observability practices need to evolve as architectures become more complex with service meshes, serverless functions, and AI-powered components.

I also participated in panel discussions on diversity in open source, sharing my experience as a woman in cloud native and the importance of creating welcoming spaces for underrepresented groups. The Women in Cloud Native initiative, which I have been involved with since 2023, continued to grow, and seeing new faces at our events was incredibly rewarding.

At KubeCon North America, I attended as a CNCF Ambassador and spent most of my time in the contributor summit and hallway conversations. The contributor summit is one of my favorite events because it brings together the people who build the tools with the people who use them, creating feedback loops that improve both the technology and the community.

## Technical Growth

Outside of coursework and the internship, I continued to grow technically through:

**Open source contributions.** I maintained my involvement with projects in the observability and developer tooling spaces. Contributing to open source while being a full-time student is challenging, but even small, consistent contributions keep you connected to the community and the codebase.

**Reading and writing.** I read extensively about distributed systems, consensus algorithms, and the emerging field of AI infrastructure. Writing blog posts and talk proposals forced me to organize my thoughts and identify gaps in my understanding.

**Building side projects.** I experimented with building a Kubernetes operator for managing ML training jobs, which combined my interests in cloud native infrastructure and machine learning. The project is not production-ready, but the learning was invaluable.

## Personal Life

Living in Ithaca for a second year felt more like home. I discovered hiking trails I had missed in the first year, became a regular at my favorite coffee shop downtown, and built a small but close-knit group of friends. Cornell's campus is stunning in every season, and I made a point to appreciate it more this year, knowing it was my last.

I also traveled more — visiting friends across the East Coast and attending conferences that took me to new cities. Travel has always been a source of energy for me, and after the relative isolation of Ithaca, getting out into the world felt essential.

## Looking Ahead

As I write this at the end of 2024, I am in the final stretch of my Master's program with graduation on the horizon in May 2025. The job search is in full swing, and I am excited about the opportunities ahead. I want to work at the intersection of AI and infrastructure — building the systems that make AI applications reliable, observable, and scalable.

Whatever 2025 brings, I know it will be built on the foundation that 2024 provided. Thank you to Cornell, to Exostellar, to the CNCF community, and to everyone who made this year what it was. Onward.
