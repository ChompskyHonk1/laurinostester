import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts, formatPostDate, SITE_URL } from "../blogData";
import { renderMarkdown } from "../markdown";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: true } };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = post.meta_description || post.excerpt || undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: "Laurino's Tavern",
      images: post.hero_image_url ? [{ url: post.hero_image_url }] : undefined,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.hero_image_url ? [post.hero_image_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.body_md);
  const all = await getPublishedPosts();
  const related = (all || []).filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.hero_image_url ? [post.hero_image_url] : undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    articleSection: post.category,
    keywords: Array.isArray(post.keywords) ? post.keywords.join(", ") : undefined,
    author: { "@type": "Organization", name: "Laurino's Tavern" },
    publisher: {
      "@type": "Restaurant",
      name: "Laurino's Tavern",
      url: SITE_URL,
      telephone: "+1-508-896-6135",
      address: {
        "@type": "PostalAddress",
        streetAddress: "3668 Main St",
        addressLocality: "Brewster",
        addressRegion: "MA",
        postalCode: "02631",
        addressCountry: "US",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="blog-wrap">
      <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {post.title}
      </nav>

      <article className="article">
        <span className="blog-card-cat">{post.category}</span>
        <h1 className="article-title">{post.title}</h1>
        <p className="article-meta">
          By the Laurino&apos;s Tavern kitchen, Brewster MA
          {post.published_at ? ` · ${formatPostDate(post.published_at)}` : ""}
        </p>

        {post.hero_image_url ? (
          <>
            <img
              className="article-hero"
              src={post.hero_image_url}
              alt={post.hero_image_alt || post.title}
            />
            {post.hero_image_credit ? (
              <p className="article-credit">
                Photo: {post.hero_image_source_url ? (
                  <a href={post.hero_image_source_url} target="_blank" rel="noopener noreferrer">
                    {post.hero_image_credit}
                  </a>
                ) : (
                  post.hero_image_credit
                )}
              </p>
            ) : null}
          </>
        ) : null}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="article-cta">
          <p>Planning something on Cape Cod? We host parties, rehearsal dinners and small weddings in Brewster.</p>
          <Link href="/parties">Book a party</Link>
        </div>
      </article>

      {related.length > 0 ? (
        <section style={{ marginTop: "3rem" }}>
          <div className="blog-head" style={{ borderBottom: "none", marginBottom: "1rem" }}>
            <h2 style={{ fontFamily: '"Aloja", Georgia, serif', color: "#3a5666", margin: 0 }}>
              Keep reading
            </h2>
          </div>
          <div className="blog-grid">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card">
                {p.hero_image_url ? (
                  <img
                    className="blog-card-img"
                    src={p.hero_image_url}
                    alt={p.hero_image_alt || p.title}
                    loading="lazy"
                  />
                ) : null}
                <div className="blog-card-body">
                  <span className="blog-card-cat">{p.category}</span>
                  <h3 className="blog-card-title">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </div>
  );
}
