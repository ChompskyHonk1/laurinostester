import Providers from "./Providers";

const SITE_URL = "https://laurinostavern.com";
const PHONE_E164 = "+1-508-896-6135";
const OG_IMAGE = "/parties/hero.jpg";

// Root metadata is server-rendered so every route has a real title,
// description, canonical and social card. The blog segment overrides the
// title/description via its own layout.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Laurino's Tavern | Cape Cod Seafood, Weddings & Parties in Brewster, MA",
    template: "%s | Laurino's Tavern",
  },
  description:
    "Family-run Cape Cod restaurant and wedding venue in Brewster, MA. Fresh seafood, pizza and comfort food, plus private party rooms, wedding receptions, rehearsal dinners and on-site catering. Dine in, order takeout, or book your event. Call (508) 896-6135.",
  applicationName: "Laurino's Tavern",
  keywords: [
    // Brand + local restaurant intent (win with on-page + Google Business Profile)
    "Laurino's Tavern",
    "Cape Cod restaurant",
    "restaurant Brewster MA",
    "seafood restaurant Cape Cod",
    "family restaurant Cape Cod",
    "fried clams Cape Cod",
    "lobster roll Cape Cod",
    "clam chowder Cape Cod",
    "pizza Brewster MA",
    "takeout Brewster MA",
    "restaurants near me Brewster",
    // Weddings and events (money keywords for the private rooms)
    "Cape Cod wedding venue",
    "wedding venues near me",
    "wedding reception venue Cape Cod",
    "rehearsal dinner Cape Cod",
    "rehearsal dinner Brewster MA",
    "Cape Cod wedding catering",
    "private party venue Cape Cod",
    "party room Brewster MA",
    "private dining room Cape Cod",
    "bridal shower Cape Cod",
    "engagement party venue Cape Cod",
    "birthday party restaurant Cape Cod",
    "corporate event venue Cape Cod",
    "Cape Cod catering",
  ],
  authors: [{ name: "Laurino's Tavern" }],
  creator: "Laurino's Tavern",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Laurino's Tavern",
    url: "/",
    locale: "en_US",
    title:
      "Laurino's Tavern | Cape Cod Seafood, Weddings & Parties in Brewster, MA",
    description:
      "Fresh seafood, pizza and comfort food on Cape Cod — plus private rooms for weddings, rehearsal dinners and parties with on-site catering and bar service in Brewster, MA.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Laurino's Tavern private party room in Brewster, MA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laurino's Tavern | Cape Cod Seafood, Weddings & Parties",
    description:
      "Fresh seafood, pizza and comfort food on Cape Cod — plus private rooms for weddings, rehearsal dinners and parties with on-site catering and bar service in Brewster, MA.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8B7355",
  colorScheme: "light",
};

// Structured data helps Google understand this is a local restaurant and can
// power rich results (hours, phone, menu) in search. Kept to facts we are
// confident about; no geo coordinates are asserted.
//
// The node is typed as both Restaurant and EventVenue because the private rooms
// host weddings, rehearsal dinners and parties — this is what lets Google match
// the site to "wedding venue near me" style local queries.
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "EventVenue"],
  "@id": `${SITE_URL}/#restaurant`,
  name: "Laurino's Tavern",
  url: `${SITE_URL}/`,
  telephone: PHONE_E164,
  image: `${SITE_URL}/Capecodmass.jpg`,
  priceRange: "$$",
  servesCuisine: ["Seafood", "Italian", "American", "Pizza"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "3668 Main Street",
    addressLocality: "Brewster",
    addressRegion: "MA",
    postalCode: "02631",
    addressCountry: "US",
  },
  // Towns and the county we actively serve. Local search rewards a business that
  // names its service area rather than relying on the postal address alone.
  areaServed: [
    { "@type": "AdministrativeArea", name: "Barnstable County, Massachusetts" },
    { "@type": "City", name: "Brewster" },
    { "@type": "City", name: "Orleans" },
    { "@type": "City", name: "Chatham" },
    { "@type": "City", name: "Harwich" },
    { "@type": "City", name: "Dennis" },
    { "@type": "City", name: "Yarmouth" },
    { "@type": "City", name: "Barnstable" },
    { "@type": "City", name: "Hyannis" },
    { "@type": "City", name: "Eastham" },
    { "@type": "City", name: "Wellfleet" },
    { "@type": "City", name: "Provincetown" },
    { "@type": "City", name: "Sandwich" },
    { "@type": "City", name: "Falmouth" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "11:30",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "21:00",
    },
  ],
  acceptsReservations: "True",
  hasMenu: `${SITE_URL}/components/menu`,
  // The event and catering services, exposed as an offer catalog so search
  // engines can surface the individual services we book.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Weddings, private events & catering",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Cape Cod wedding receptions",
          description:
            "Private rooms and on-site catering for wedding receptions on Cape Cod.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Rehearsal dinners",
          description:
            "Rehearsal dinners and wedding-week dinners in Brewster, MA.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private parties and event space",
          description:
            "Private party rooms for bridal showers, engagement parties, birthdays, anniversaries and corporate dinners.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Cape Cod catering and takeout",
          description:
            "On-site catering, drop-off trays and takeout for events on Cape Cod.",
        },
      },
    ],
  },
  sameAs: [
    "https://www.facebook.com/share/1DDB27X8jP/",
    "https://www.instagram.com/laurinoscape",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* The display face is used in above-the-fold headings; preload it so
            it is not discovered only after CSS parses. */}
        <link
          rel="preload"
          href="/Aloja%20Extended.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          // Static, trusted object — safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
