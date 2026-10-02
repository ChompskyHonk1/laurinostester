export const metadata = {
  title: "Menu",
  description:
    "Browse the Laurino's Tavern menu in Brewster, MA — fresh Cape Cod seafood, hand-tossed pizza, grinders, fried favorites, chowder and comfort food. Dine in or order takeout.",
  alternates: {
    canonical: "/components/menu",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/menu",
    title: "Menu | Laurino's Tavern",
    description:
      "Fresh Cape Cod seafood, pizza, grinders and comfort food in Brewster, MA.",
  },
};

export default function MenuLayout({ children }) {
  return <>{children}</>;
}
