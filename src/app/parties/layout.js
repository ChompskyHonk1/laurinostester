// The /parties page itself is a client component (it manages a multi-step
// form), so it cannot export metadata. This server layout supplies the SEO head
// for the route: title, description, canonical and social card.
export const metadata = {
  title: "Party & Catering in Brewster, MA",
  description:
    "Plan a private party or catering pickup at Laurino's Tavern in Brewster, MA. Browse rooms, build a menu wish list, add bar and tablecloths, and send a request — a manager calls you back to confirm. Call (508) 896-6135.",
  alternates: {
    canonical: "/parties",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/parties",
    title: "Party & Catering in Brewster, MA | Laurino's Tavern",
    description:
      "Private rooms, on-site catering, bar service and a full party menu on Cape Cod. Send a request and a manager will confirm.",
    images: [
      {
        url: "/parties/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Laurino's Tavern private party room",
      },
    ],
  },
};

export default function PartiesLayout({ children }) {
  return <>{children}</>;
}
