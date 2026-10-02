export const metadata = {
  title: "Support & FAQ",
  description:
    "Answers to common questions about Laurino's Tavern in Brewster, MA — reservations, takeout, party and catering requests, hours and directions. Call (508) 896-6135 or send us a message.",
  alternates: {
    canonical: "/components/Support",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/Support",
    title: "Support & FAQ | Laurino's Tavern",
    description:
      "Reservations, takeout, party requests and hours — answers from Laurino's Tavern in Brewster, MA.",
  },
};

export default function SupportLayout({ children }) {
  return <>{children}</>;
}
