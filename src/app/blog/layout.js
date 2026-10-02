import "./blog.css";

export const metadata = {
  metadataBase: new URL("https://laurinostavern.com"),
  title: {
    default: "Cape Cod Dining & Wedding Notes | Laurino's Tavern",
    template: "%s | Laurino's Tavern",
  },
  description:
    "Local guides to eating, drinking and celebrating on Cape Cod from Laurino's Tavern in Brewster, MA — seafood, seasonal dining, rehearsal dinners and small weddings.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/blog",
    locale: "en_US",
  },
};

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
