// The /weddings page is a client component (styled-components + interactive
// accordion), so this server layout supplies the SEO head for the route.
// This is the primary landing page for the highest-value local searches:
// wedding venues near me, wedding reception venue Cape Cod, rehearsal dinners
// and private party space on Cape Cod.
export const metadata = {
  title: "Cape Cod Weddings, Receptions & Rehearsal Dinners",
  description:
    "Laurino's Tavern is a Cape Cod wedding and event venue in Brewster, MA. Private rooms and on-site catering for wedding receptions, rehearsal dinners, bridal showers, engagement parties and private events. Call (508) 896-6135.",
  keywords: [
    "Cape Cod wedding venue",
    "wedding venues near me",
    "wedding reception Cape Cod",
    "rehearsal dinner Cape Cod",
    "rehearsal dinner Brewster MA",
    "wedding venue Brewster MA",
    "Cape Cod wedding catering",
    "private party venue Cape Cod",
    "bridal shower Cape Cod",
    "engagement party venue Cape Cod",
    "event venue Barnstable County",
    "private event space Cape Cod",
  ],
  alternates: {
    canonical: "/weddings",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/weddings",
    title: "Cape Cod Weddings, Receptions & Rehearsal Dinners | Laurino's Tavern",
    description:
      "Private rooms, on-site catering and a full bar for weddings, rehearsal dinners and private events in Brewster, MA on Cape Cod.",
    images: [
      {
        url: "/weddingpic.jpg",
        width: 1200,
        height: 630,
        alt: "Wedding reception in the private event room at Laurino's Tavern in Brewster, MA",
      },
    ],
  },
};

export default function WeddingsLayout({ children }) {
  return <>{children}</>;
}
