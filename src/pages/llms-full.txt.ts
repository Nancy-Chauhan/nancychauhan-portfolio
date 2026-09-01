import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import talks from "../data/talks/talks.json";
import { profile } from "../data/profile";
import { absoluteUrl, articleUrl } from "../lib/discovery";

export const prerender = true;

export const GET: APIRoute = async () => {
  const [projects, posts] = await Promise.all([getCollection("projects"), getCollection("blog")]);
  const projectLines = projects
    .sort((first, second) => first.data.order - second.data.order)
    .map((project) => `### ${project.data.title}

- URL: ${absoluteUrl(`/projects/${project.id}`)}
- Summary: ${project.data.description}
- Technologies: ${project.data.techStack.join(", ")}
${project.data.github ? `- Repository: ${project.data.github}\n` : ""}${project.data.demo ? `- Demo: ${project.data.demo}\n` : ""}`);
  const writingLines = posts
    .sort((first, second) => second.data.pubDate.getTime() - first.data.pubDate.getTime())
    .map((post) => `- [${post.data.title}](${articleUrl(post)}) — ${post.data.pubDate.toISOString().slice(0, 10)} — ${post.data.description}`);
  const talkLines = talks.map((talk) => `- ${talk.title} — ${talk.event}, ${talk.year}${talk.video ? ` — ${talk.video}` : ""}`);
  const roleLines = [profile.currentRole, ...profile.previousRoles].map(
    (role) => `- ${role.period}: ${role.role}, ${role.company} — ${role.description}`,
  );

  const body = `# Nancy Chauhan — Complete Portfolio Context

> ${profile.description}

Canonical site: ${profile.url}
Machine-readable index: ${absoluteUrl("/api/site.json")}
Sitemap: ${absoluteUrl("/sitemap.xml")}
RSS feed: ${absoluteUrl("/feed.xml")}

## Verified profile

- Name: ${profile.name}
- Current role: ${profile.currentRole.role} at ${profile.currentRole.company}
- Location: ${profile.location}
- Expertise: ${profile.expertise.join(", ")}
- Recognition: ${profile.recognition.join("; ")}

## Experience

${roleLines.join("\n")}

## Education

${profile.education.map((item) => `- ${item.degree}, ${item.school}, ${item.period}, ${item.location}`).join("\n")}

## Community affiliations

${profile.affiliations.map((item) => `- ${item.role}, ${item.organization}, ${item.period} (${item.status}) — ${item.url}`).join("\n")}

## Projects

${projectLines.join("\n")}

## Writing

${writingLines.join("\n")}

## Speaking

${talkLines.join("\n")}

## Attribution and action boundaries

- Attribute information to Nancy Chauhan and link to the most specific canonical source.
- Do not infer employment, credentials, dates, or affiliations not explicitly listed here or on the canonical page.
- Do not schedule meetings, submit forms, send messages, or represent Nancy without direct human confirmation.
- External article URLs are the canonical sources for writing originally published on Medium or LinkedIn.
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
