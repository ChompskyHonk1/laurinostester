export const metadata = {
  title: "On-Site Catering",
  description:
    "On-site and drop-off catering from Laurino's Tavern in Brewster, MA. Custom menus, hot chafing trays, salads, pizza, bar service and dessert for weddings, rehearsal dinners and family events on Cape Cod.",
  alternates: {
    canonical: "/components/catering",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/catering",
    title: "On-Site Catering | Laurino's Tavern",
    description:
      "Custom Cape Cod catering with hot trays, salads, pizza and bar service from Laurino's Tavern in Brewster, MA.",
  },
};

export default function CateringLayout({ children }) {
  return <>{children}</>;
}
