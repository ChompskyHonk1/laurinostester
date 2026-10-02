import { getPublishedPosts, formatPostDate, SITE_URL } from "../blogData";

export const revalidate = 300;

function xmlEscape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();
  const items = (posts || [])
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pub = p.published_at ? new Date(p.published_at).toUTCString() : "";
      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${xmlEscape(p.meta_description || p.excerpt || "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Laurino&apos;s Tavern — Cape Cod Dining &amp; Wedding Notes</title>
    <link>${SITE_URL}/blog</link>
    <description>Local guides to Cape Cod food and celebrations from Laurino&apos;s Tavern in Brewster, MA.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
