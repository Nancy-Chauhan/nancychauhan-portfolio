import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { profile } from "../../data/profile";
import { absoluteUrl, articleUrl } from "../../lib/discovery";
import { allTalks, communityEvents, courseList, founded, keynote, pageIndex, talkCategory } from "../../lib/agents";

export const prerender = true;

export const GET: APIRoute = async () => {
  const [projects, posts] = await Promise.all([getCollection("projects"), getCollection("blog")]);
  const body = {
    schemaVersion: "1.0",
    canonicalUrl: profile.url,
    profile,
    pages: pageIndex,
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
    talks: allTalks.map((original) => {
      const { highlight, homeOrder, ...talk } = original;
      return { ...talk, category: talkCategory(original), keynoteHighlight: original === keynote || undefined, speaker: profile.name };
    }),
    courses: courseList.map(({ lessons, ...course }) => ({
      ...course,
      instructor: profile.name,
      lessons: lessons.map((l) => ({ ...l, url: `https://www.youtube.com/watch?v=${l.id}` })),
    })),
    community: {
      page: absoluteUrl("/community"),
      founded: { ...founded, image: absoluteUrl(founded.image) },
      events: communityEvents.map(({ sortDate, image, imageAlt, ...event }) => ({ ...event, date: sortDate, image: absoluteUrl(image) })),
    },
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
