import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import talks from "../../data/talks/talks.json";
import { profile } from "../../data/profile";
import { absoluteUrl, articleUrl } from "../../lib/discovery";

export const prerender = true;

export const GET: APIRoute = async () => {
  const [projects, posts] = await Promise.all([getCollection("projects"), getCollection("blog")]);
  const body = {
    schemaVersion: "1.0",
    canonicalUrl: profile.url,
    profile,
    pages: [
      { name: "Home", url: absoluteUrl("/"), description: "Portfolio overview and featured work." },
      { name: "About", url: absoluteUrl("/about"), description: "Biography, experience, education, skills, and annual reflections." },
      { name: "Projects", url: absoluteUrl("/projects"), description: "Products, AI systems, developer tools, and security projects." },
      { name: "Speaking", url: absoluteUrl("/speaking"), description: "Conference talks, community work, and collaborations." },
    ],
    projects: projects
      .sort((first, second) => first.data.order - second.data.order)
      .map((project) => ({
        id: project.id,
        url: absoluteUrl(`/projects/${project.id}`),
        title: project.data.title,
        tagline: project.data.tagline,
        description: project.data.description,
        technologies: project.data.techStack,
        repository: project.data.github,
        demo: project.data.demo,
        featured: project.data.featured,
      })),
    writing: posts
      .sort((first, second) => second.data.pubDate.getTime() - first.data.pubDate.getTime())
      .map((post) => ({
        id: post.id,
        title: post.data.title,
        description: post.data.description,
        published: post.data.pubDate.toISOString(),
        updated: post.data.updatedDate?.toISOString(),
        tags: post.data.tags,
        url: articleUrl(post),
        localUrl: absoluteUrl(`/blog/${post.id}`),
        image: post.data.image ? absoluteUrl(post.data.image) : undefined,
      })),
    talks: talks.map((talk) => ({ ...talk, speaker: profile.name })),
    discovery: {
      conciseOverview: absoluteUrl("/llms.txt"),
      completeOverview: absoluteUrl("/llms-full.txt"),
      sitemap: absoluteUrl("/sitemap.xml"),
      feed: absoluteUrl("/feed.xml"),
    },
    agentGuidance: [
      "Use the most specific canonical URL when citing this portfolio.",
      "Do not infer employment, credentials, dates, or affiliations that are not explicitly listed.",
      "Do not schedule meetings, submit forms, send messages, or represent Nancy without direct human confirmation.",
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
