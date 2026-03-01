---
title: "How to Kick Off Your Open Source Journey"
description: "A practical guide for developers looking to start contributing to open source, covering how to find projects, make your first contribution, build community relationships, and tips for programs like GSoC."
pubDate: 2019-06-10
tags: ["open-source", "community"]
---

Open source changed the trajectory of my career. My contributions to projects in the CNCF ecosystem opened doors to mentorship, conference speaking opportunities, and a global network of fellow engineers. But I remember how intimidating it felt to get started — staring at a massive codebase, not knowing where to begin, wondering if my contribution would be good enough.

If that sounds familiar, this post is for you. I want to share the practical steps I took to start contributing to open source and the lessons I learned along the way.

## Finding the Right Project

The biggest mistake beginners make is trying to contribute to the most popular or impressive project they can find. A repository with 50,000 stars and hundreds of active contributors is probably not the best place to start. Instead, look for projects where:

**You are a user.** The best first contributions come from actual pain points. If a tool you use daily has a confusing error message, missing documentation, or a bug that annoys you, that is your starting point. You already understand the context.

**The community is welcoming.** Look for signals: a CONTRIBUTING.md file, a code of conduct, responsive maintainers, and labels like "good first issue" or "help wanted." Check the issue tracker and pull requests — are maintainers kind and constructive in their feedback, or dismissive?

**The codebase is manageable.** A smaller project where you can understand the architecture is more rewarding than a massive one where you can only change a single line without understanding the context.

**The technology aligns with your interests.** If you want to learn Go, contribute to a Go project. If you are interested in Kubernetes, explore the CNCF landscape. Alignment between your learning goals and the project's stack makes the work enjoyable.

### Where to Look

- **GitHub Explore:** Browse trending repositories and topics
- **Good First Issues:** Websites like goodfirstissue.dev aggregate beginner-friendly issues
- **CNCF Landscape:** If you are interested in cloud native, the CNCF landscape (landscape.cncf.io) maps hundreds of projects across categories
- **Hacktoberfest:** Even outside October, projects tagged for Hacktoberfest tend to be welcoming to newcomers
- **Your dependencies:** Look at the open source libraries your work projects depend on

## Making Your First Contribution

Your first contribution does not need to be a feature or a bug fix. In fact, some of the most valuable contributions are non-code:

### Documentation

Documentation is chronically undervalued and undermaintained. If you struggled to set up a project, write the guide you wish existed. If an API is poorly documented, improve the docs. Maintainers love documentation contributions because they rarely have time to write them.

```markdown
## Before
Run the setup script.

## After
Run the setup script to initialize the development environment:
\```bash
./scripts/setup.sh
\```
This installs dependencies, creates the database, and starts the development server
on port 3000. You can verify the setup by visiting http://localhost:3000.
```

### Bug Reports

A well-written bug report is a contribution in itself. Include:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Your environment (OS, language version, project version)
- Relevant logs or error messages

### Code Contributions

When you are ready for code contributions, start small:

1. **Find an issue.** Look for issues labeled "good first issue" or "help wanted." Read through the issue and its comments to understand the context.

2. **Claim the issue.** Leave a comment saying you would like to work on it. This prevents duplicate effort and gives the maintainer a chance to provide guidance.

3. **Understand the development setup.** Read the CONTRIBUTING.md file. Set up the development environment. Run the tests. Make sure everything passes before you change anything.

4. **Make the change.** Keep it focused. One issue, one pull request. Do not combine multiple unrelated changes.

5. **Write tests.** If the project has tests, write tests for your change. This demonstrates that your code works and protects against regressions.

6. **Submit the pull request.** Write a clear description of what you changed and why. Reference the issue number. Be prepared for feedback and iteration.

## The Pull Request Process

Submitting a PR can feel vulnerable — you are putting your code in front of experienced maintainers for review. Here are some tips:

**Follow the project's conventions.** Match the code style, commit message format, and PR template. If the project uses conventional commits, follow that format. If they squash-merge, do not worry about having a clean commit history.

**Be patient.** Maintainers are often volunteers with limited time. If your PR sits for a week without review, a polite ping is fine. If it sits for a month, the project may be understaffed — do not take it personally.

**Accept feedback graciously.** Code review is not personal criticism. If a maintainer asks for changes, they are helping you learn their codebase and engineering standards. Ask questions if feedback is unclear.

**Do not disappear.** If you opened a PR and the maintainer requested changes, respond in a reasonable time. Abandoned PRs waste maintainer time and create clutter.

## Building Relationships

Open source is as much about community as it is about code. Building relationships with maintainers and other contributors opens opportunities you cannot predict.

- **Join community channels.** Most projects have a Slack, Discord, or mailing list. Introduce yourself and participate in discussions.
- **Attend community meetings.** Many CNCF projects have regular community calls that are open to anyone. Listening in is a great way to understand project direction and priorities.
- **Be consistent.** One-off contributions are fine, but sustained contributions build trust. A maintainer who sees you consistently showing up is more likely to invite you into deeper collaboration.
- **Help others.** Answer questions in issue trackers and chat channels. Review other people's PRs (even informal reviews are valuable). Triage issues.

## Google Summer of Code (GSoC) and Similar Programs

Structured programs like GSoC, LFX Mentorship, and Outreachy are excellent on-ramps to open source. Here are my tips for applying:

**Start early.** Do not wait for the application period to begin. Start contributing to your target project months in advance. Applicants who already have merged PRs have a significant advantage.

**Choose a project that excites you.** GSoC is a multi-month commitment. If the project does not genuinely interest you, motivation will be a problem.

**Write a strong proposal.** A good proposal demonstrates understanding of the problem, breaks the work into clear milestones, identifies risks, and shows that you have already engaged with the codebase. Generic proposals that could apply to any project will not stand out.

**Communicate proactively.** During the program, communicate regularly with your mentor. Share progress updates, ask for help when stuck, and be honest about blockers. Mentors would rather help you early than discover problems at the end of a milestone.

**Contribute beyond your project.** Review issues, help other contributors, and participate in community discussions. This shows that you are invested in the project, not just completing a program.

## Overcoming Imposter Syndrome

Almost everyone feels unqualified when starting in open source. I certainly did. Here is what helped me:

- **Remember that everyone started somewhere.** The maintainer reviewing your PR was once a beginner too.
- **Small contributions are real contributions.** Fixing a typo in documentation is valuable. Do not compare yourself to people who have been contributing for years.
- **The worst that happens is feedback.** If your PR is not accepted, you still learned something. Many rejected PRs lead to conversations that teach you more than the code itself.
- **Visibility is earned gradually.** You do not need to make a splash. Show up, do good work, and the recognition follows naturally.

Open source is one of the most meritocratic spaces in tech. Your background, credentials, and job title matter less than the quality of your contributions and the way you engage with the community. Start small, be consistent, and enjoy the journey.
