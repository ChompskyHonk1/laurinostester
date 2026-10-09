export const metadata = {
  title: "Cape Cod Wedding & Party Catering",
  description:
    "On-site and drop-off catering from Laurino's Tavern in Brewster, MA. Custom menus, hot chafing trays, salads, pizza, bar service and dessert for weddings, rehearsal dinners, graduation and family events on Cape Cod.",
  keywords: [
    "Cape Cod catering",
    "wedding catering Cape Cod",
    "Cape Cod wedding catering",
    "rehearsal dinner catering Cape Cod",
    "party catering Brewster MA",
    "drop-off catering Cape Cod",
    "event catering Barnstable County",
    "graduation party catering Cape Cod",
  ],
  alternates: {
    canonical: "/components/catering",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/components/catering",
    title: "Cape Cod Wedding & Party Catering | Laurino's Tavern",
    description:
      "Custom Cape Cod catering with hot trays, salads, pizza and bar service from Laurino's Tavern in Brewster, MA — for weddings, rehearsal dinners and family events.",
  },
};

export default function CateringLayout({ children }) {
  return <>{children}</>;
}
