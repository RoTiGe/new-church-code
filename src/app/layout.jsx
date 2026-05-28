import { DM_Serif_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://aeg-koeln.de";
const SITE_NAME = "Ethiopian Evangelical Church of Cologne Mülheim";
const DEFAULT_DESCRIPTION =
  "Ethiopian Evangelical Church in Cologne Mülheim — Sunday worship, youth and children's ministries, prayer, and Bible-centered community in Köln.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Ethiopian church Cologne",
    "Äthiopische Gemeinde Köln",
    "Ethiopian Evangelical Church",
    "Köln Mülheim church",
    "Ethiopian worship Germany",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["de_DE", "am_ET"],
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/images/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: SITE_NAME,
  alternateName: "Äthiopische Evangelische Gemeinde Köln Mülheim e.V.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/hero.jpg`,
  description: DEFAULT_DESCRIPTION,
  telephone: "+49 15566 758443",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Regentenstraße 78-80",
    postalCode: "51063",
    addressLocality: "Köln",
    addressRegion: "NRW",
    addressCountry: "DE",
  },
  areaServed: { "@type": "City", name: "Köln" },
  inLanguage: ["en", "de", "am"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${sourceSans.variable}`}>
      <body className="overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
        />
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
