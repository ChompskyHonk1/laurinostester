export const metadata = {
  title: "Contact & Directions",
  description:
    "Visit or call Laurino's Tavern at 3668 Main Street, Brewster, MA 02631. Phone (508) 896-6135. Get directions, hours and answers about reservations, parties and takeout on Cape Cod.",
  alternates: {
    canonical: "/components/Contact",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/Contact",
    title: "Contact & Directions | Laurino's Tavern",
    description:
      "3668 Main Street, Brewster, MA 02631. Call (508) 896-6135 for reservations, parties and takeout.",
  },
};

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
