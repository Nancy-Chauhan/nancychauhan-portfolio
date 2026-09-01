export const SITE_URL = "https://nancychauhan.com";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).href;
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function articleUrl(post: { id: string; data: { canonicalUrl?: string; externalUrl?: string } }) {
  return post.data.canonicalUrl ?? post.data.externalUrl ?? absoluteUrl(`/blog/${post.id}`);
}
