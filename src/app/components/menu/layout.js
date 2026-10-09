export const metadata = {
  title: "Cape Cod Seafood & Pizza Menu",
  description:
    "Browse the Laurino's Tavern menu in Brewster, MA — fresh Cape Cod seafood, lobster rolls, fried clams, clam chowder, hand-tossed pizza, grinders and comfort food. Dine in or order takeout.",
  keywords: [
    "Laurino's Tavern menu",
    "Cape Cod seafood menu",
    "seafood restaurant Brewster MA",
    "lobster roll Cape Cod",
    "fried clams Cape Cod",
    "clam chowder Cape Cod",
    "pizza Brewster MA",
    "takeout Brewster MA",
    "Cape Cod restaurant menu",
  ],
  alternates: {
    canonical: "/components/menu",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/menu",
    title: "Cape Cod Seafood & Pizza Menu | Laurino's Tavern",
    description:
      "Fresh Cape Cod seafood, lobster rolls, fried clams, clam chowder, pizza, grinders and comfort food in Brewster, MA.",
  },
};

export default function MenuLayout({ children }) {
  return <>{children}</>;
}
