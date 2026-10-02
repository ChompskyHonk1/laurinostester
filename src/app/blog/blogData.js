// Server-side reads for the blog. Published posts only — the RLS policy only
// exposes `status = 'published'` to the anon key, so this is safe to fetch from
// the browser-facing URL. Cached with ISR.

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uumrgsdkeqagmkoedfow.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXJnc2RrZXFhZ21rb2VkZm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzYzODYsImV4cCI6MjA5NDI1MjM4Nn0.9M2eGZ1KwEw0Ooo-ligIpSbzzcTE8XUf3PLkisVwCt8";

export const SITE_URL = "https://laurinostavern.com";

const COLUMNS = [
  "id", "slug", "title", "meta_description", "excerpt", "body_md", "category",
  "keywords", "hero_image_url", "hero_image_alt", "hero_image_credit",
  "hero_image_source_url", "hero_image_license", "seo_score",
  "published_at", "updated_at",
].join(",");

async function rest(path) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getPublishedPosts() {
  return rest(
    `blog_posts?status=eq.published&select=${COLUMNS}&order=published_at.desc&limit=60`
  );
}

export async function getPostBySlug(slug) {
  const rows = await rest(
    `blog_posts?status=eq.published&slug=eq.${encodeURIComponent(slug)}&select=${COLUMNS}&limit=1`
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

export function formatPostDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}
