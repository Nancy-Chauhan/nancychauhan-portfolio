import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { absoluteUrl, escapeXml, SITE_URL } from "../lib/discovery";

export const prerender = true;

export const GET: APIRoute = async () => {
  const [projects, posts] = await Promise.all([getCollection("projects"), getCollection("blog")]);
  const staticPages = ["/", "/about", "/projects", "/speaking"];

  const urls = [
    ...staticPages.map((path) => ({ location: absoluteUrl(path) })),
    ...projects.map((project) => ({ location: absoluteUrl(`/projects/${project.id}`) })),
    ...posts
      .filter((post) => {
        const canonical = post.data.canonicalUrl ?? post.data.externalUrl;
        return !canonical || canonical.startsWith(SITE_URL);
      })
      .map((post) => ({
        location: absoluteUrl(`/blog/${post.id}`),
        lastModified: (post.data.updatedDate ?? post.data.pubDate).toISOString().slice(0, 10),
      })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ location, lastModified }) => `  <url>
    <loc>${escapeXml(location)}</loc>${lastModified ? `
    <lastmod>${lastModified}</lastmod>` : ""}
  </url>`)
  .join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
