import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { articleUrl, escapeXml, SITE_URL } from "../lib/discovery";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog")).sort(
    (first, second) => second.data.pubDate.getTime() - first.data.pubDate.getTime(),
  );

  const items = posts.map((post) => {
    const url = articleUrl(post);
    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
      ${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nancy Chauhan — Writing</title>
    <link>${SITE_URL}</link>
    <description>Technical writing and reflections by Nancy Chauhan.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
