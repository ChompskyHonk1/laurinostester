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
      "Laurino's Tavern | Cape Cod Seafood, Parties & Catering in Brewster, MA",
    template: "%s | Laurino's Tavern",
  },
  description:
    "Family-run Cape Cod tavern in Brewster, MA serving fresh seafood, pizza and comfort food. Dine in, order takeout, or plan a private party with on-site catering and bar service. Call (508) 896-6135.",
  applicationName: "Laurino's Tavern",
  keywords: [
    "Cape Cod restaurant",
    "Brewster MA restaurant",
    "seafood Brewster",
    "Laurino's Tavern",
    "Cape Cod party venue",
    "Cape Cod catering",
    "private party space Cape Cod",
    "clam chowder Cape Cod",
    "pizza Brewster MA",
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
      "Laurino's Tavern | Cape Cod Seafood, Parties & Catering in Brewster, MA",
    description:
      "Fresh seafood, pizza and comfort food on Cape Cod. Plan a private party with on-site catering and bar service in Brewster, MA.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Laurino's Tavern private party room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laurino's Tavern | Cape Cod Seafood, Parties & Catering",
    description:
      "Fresh seafood, pizza and comfort food on Cape Cod. Plan a private party with on-site catering and bar service in Brewster, MA.",
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
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
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
