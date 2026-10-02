import { getPublishedPosts, SITE_URL } from "./blog/blogData";

export const revalidate = 3600;

export default async function sitemap() {
  const staticPaths = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/parties", priority: 0.9, freq: "weekly" },
    { path: "/blog", priority: 0.8, freq: "weekly" },
    { path: "/components/menu", priority: 0.8, freq: "weekly" },
    { path: "/components/catering", priority: 0.7, freq: "monthly" },
    { path: "/components/Contact", priority: 0.6, freq: "monthly" },
    { path: "/components/Support", priority: 0.5, freq: "monthly" },
  ].map((s) => ({
    url: `${SITE_URL}${s.path}`,
    lastModified: new Date(),
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  let posts = [];
  try {
    const rows = await getPublishedPosts();
    posts = (rows || []).map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || Date.now()),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    posts = [];
  }

  return [...staticPaths, ...posts];
}
