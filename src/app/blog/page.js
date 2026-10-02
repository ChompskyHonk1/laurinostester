import Link from "next/link";
import { getPublishedPosts, formatPostDate, SITE_URL } from "./blogData";

export const revalidate = 300;

export const metadata = {
  title: "Cape Cod Dining & Wedding Notes",
  description:
    "Practical local guides to Cape Cod food and celebrations from Laurino's Tavern in Brewster — seafood, seasonal dining, rehearsal dinners and small weddings.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <div className="blog-wrap">
      <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / Blog
      </nav>

      <header className="blog-head">
        <h1>Cape Cod Dining &amp; Wedding Notes</h1>
        <p>
          Guides from the kitchen at Laurino&apos;s Tavern in Brewster — where to eat on Route 6A,
          what to order, and how to plan a rehearsal dinner or a small Cape Cod wedding without
          the guesswork.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="blog-empty">New guides are on the way. Check back soon.</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
              {post.hero_image_url ? (
                <img
                  className="blog-card-img"
                  src={post.hero_image_url}
                  alt={post.hero_image_alt || post.title}
                  loading="lazy"
                />
              ) : null}
              <div className="blog-card-body">
                <span className="blog-card-cat">{post.category}</span>
                <h2 className="blog-card-title">{post.title}</h2>
                {post.excerpt || post.meta_description ? (
                  <p className="blog-card-excerpt">{post.excerpt || post.meta_description}</p>
                ) : null}
                <span className="blog-card-date">{formatPostDate(post.published_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Laurino's Tavern Blog",
            url: `${SITE_URL}/blog`,
            publisher: { "@type": "Restaurant", name: "Laurino's Tavern", url: SITE_URL },
          }),
        }}
      />
    </div>
  );
}
