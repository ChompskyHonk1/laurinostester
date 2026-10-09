export const metadata = {
  title: "Directions, Hours & Reservations",
  description:
    "Visit or call Laurino's Tavern at 3668 Main Street, Brewster, MA 02631. Phone (508) 896-6135. Get directions, hours and answers about reservations, takeout, parties and weddings on Cape Cod.",
  keywords: [
    "Laurino's Tavern directions",
    "restaurant Brewster MA",
    "Cape Cod restaurant hours",
    "Brewster MA restaurant phone",
    "restaurants near me Brewster",
    "reservations Cape Cod",
  ],
  alternates: {
    canonical: "/components/Contact",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/Contact",
    title: "Directions, Hours & Reservations | Laurino's Tavern",
    description:
      "3668 Main Street, Brewster, MA 02631. Call (508) 896-6135 for reservations, takeout, parties and weddings on Cape Cod.",
  },
};

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
