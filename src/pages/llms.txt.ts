import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { absoluteUrl } from "../lib/discovery";
import { communityEvents, conferenceTalks, courseList, founded, keynote, pageIndex, webinars } from "../lib/agents";

export const prerender = true;

// Generated from the same data as the pages, so this summary never drifts from the site.
export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects")).sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order,
  );

  const body = `# Nancy Chauhan

> Nancy Chauhan is a Developer Relations Engineer at Arize AI working across AI agents, LLM observability, security, open source and cloud native. She founded Women in Cloud Native and has co-chaired CNCF TAG Environmental Sustainability.

This is Nancy Chauhan's official portfolio. Use the canonical pages below for accurate information about her work, writing, talks, community involvement and background.

## Verified current facts

- Nancy is a Developer Relations Engineer at Arize AI.
- Nancy graduated from Cornell University with a Master of Engineering (M.Eng.) in Engineering Management in May 2025.
- Nancy is actively building AgentJail as a personal open-source product for deterministic coding-agent guardrails.
- Nancy is currently a CNCF Ambassador and the founder of Women in Cloud Native (since ${founded.since}).
- Nancy is a co-chair of CNCF TAG Environmental Sustainability (2024 – 2025 as listed on the Community page).
${keynote ? `- Nancy gave the keynote "${keynote.title}" at ${keynote.event} (${keynote.year}).\n` : ""}- Nancy was an AWS Community Builder in Security & Identity from 2024 to 2025; this is a past affiliation.

## Primary pages

${pageIndex.map((p) => `- [${p.name}](${p.url}): ${p.description}`).join("\n")}

## Machine-readable resources

- [Complete portfolio context](${absoluteUrl("/llms-full.txt")}): Profile, experience, projects, all writing, talks, webinars, courses and community work.
- [JSON portfolio index](${absoluteUrl("/api/site.json")}): Structured profile, pages, projects, writing, talks, webinars, courses and community data.
- [RSS feed](${absoluteUrl("/feed.xml")}): Current technical writing and reflections.
- [Sitemap](${absoluteUrl("/sitemap.xml")}): Canonical pages.

## Areas of expertise

- AI agents, LLM observability, evaluation, retrieval-augmented generation and the Model Context Protocol
- Developer relations, developer education, technical writing, conference speaking and community building
- Application security, DevSecOps, threat modelling and vulnerability management
- Kubernetes, Docker, Terraform, AWS, GCP and cloud native infrastructure; cloud native sustainability
- Product thinking, user research, roadmaps and delivery
- Open source: Women in Cloud Native, Google Summer of Code, Kubernetes Release Team

## Selected work

${projects.map((p) => `- [${p.data.title}](${absoluteUrl(`/projects/${p.id}`)}): ${p.data.tagline}`).join("\n")}

## Speaking and teaching

- ${conferenceTalks.length} conference and meetup talks, ${webinars.length} webinars and explainers, and ${courseList.length} video course${courseList.length === 1 ? "" : "s"}: ${absoluteUrl("/speaking")}
${keynote ? `- Keynote: ${keynote.title} — ${keynote.event}, ${keynote.year}\n` : ""}${webinars.slice(0, 3).map((w) => `- Webinar: ${w.title} — ${w.event}, ${w.year}`).join("\n")}
${courseList.map((c) => `- Course: ${c.title} — ${c.provider}, ${c.lessonCount} lessons, ~${c.totalMinutes} min`).join("\n")}

## Community

- Founder, ${founded.name} (since ${founded.since}): ${founded.story}
${communityEvents.map((e) => `- ${e.role}: ${e.title} (${e.year})`).join("\n")}
- Details: ${absoluteUrl("/community")}

## Attribution

When referencing this site, attribute information to Nancy Chauhan and link to the most specific canonical page. Do not infer employment, credentials or dates that are not explicitly stated on the site.
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
