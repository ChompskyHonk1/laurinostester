// The /parties page itself is a client component (it manages a multi-step
// form), so it cannot export metadata. This server layout supplies the SEO head
// for the route: title, description, canonical and social card.
export const metadata = {
  title: "Private Party & Wedding Venue in Brewster, MA",
  description:
    "Book a private party or catering order at Laurino's Tavern in Brewster, MA on Cape Cod. Rooms for wedding receptions, rehearsal dinners, bridal showers and birthdays, plus on-site catering and bar service. Send a request and a manager calls you back — call (508) 896-6135.",
  keywords: [
    "private party venue Cape Cod",
    "party room Brewster MA",
    "Cape Cod wedding venue",
    "wedding reception Cape Cod",
    "rehearsal dinner Cape Cod",
    "bridal shower Cape Cod",
    "engagement party venue Cape Cod",
    "private dining room Cape Cod",
    "corporate event venue Cape Cod",
    "Cape Cod catering",
  ],
  alternates: {
    canonical: "/parties",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/parties",
    title: "Private Party & Wedding Venue in Brewster, MA | Laurino's Tavern",
    description:
      "Private rooms, on-site catering, bar service and a full party menu on Cape Cod — for weddings, rehearsal dinners and private events. Send a request and a manager will confirm.",
    images: [
      {
        url: "/parties/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Laurino's Tavern private party room in Brewster, MA",
      },
    ],
  },
};

export default function PartiesLayout({ children }) {
  return <>{children}</>;
}
