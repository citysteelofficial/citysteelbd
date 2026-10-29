import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

import { Oswald, Inter } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b91c1c",
};

const SITE_URL = "https://citysteelbd.com";
const SITE_NAME = "City Steel Corporation";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "City Steel Corporation | Steel Structure Company in Dhaka",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Leading pre-engineered building (PEB) and steel structure company in Bangladesh. Factory, warehouse, and commercial building design, fabrication, and erection. Based in Shyamoli, Dhaka with 150+ completed projects.",
  keywords: [
    "steel structure Bangladesh",
    "pre-engineered building",
    "PEB Bangladesh",
    "steel fabrication",
    "industrial steel structure",
    "City Steel Corporation",
    "steel truss",
    "roofing sheet",
    "purlin",
    "steel beam",
    "steel column",
    "warehouse construction",
    "factory construction Bangladesh",
    "steel building Dhaka",
    "City Steel BD",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "UKC7sQXi_DKihfL_WzDzxVxO88Bm0gTgO4sqe4S4K20",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium Industrial Steel Structures`,
    description:
      "Design, fabrication, and erection of world-class pre-engineered steel buildings across Bangladesh. 150+ projects completed.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Building the Backbone of Modern Industry`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Steel Structures`,
    description:
      "Pre-engineered steel buildings, trusses & industrial structures in Bangladesh.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data for Organization
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "City Steel Corporation specializes in design, manufacture, supply, and erection of pre-engineered steel buildings and industrial steel structures across Bangladesh.",
  foundingDate: "2015",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7/6, Garden Street, Ring Road, Shyamoli",
    addressLocality: "Dhaka",
    postalCode: "1207",
    addressCountry: "BD",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+880-1711-787556",
      contactType: "sales",
      areaServed: "BD",
      availableLanguage: ["Bengali", "English"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+880-1711-991775",
      contactType: "customer service",
      areaServed: "BD",
    },
  ],
  email: "citysteel.corporation@gmail.com",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61573880256953",
  ],
};

// JSON-LD for Local Business
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  image: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
  telephone: "+880-1711-787556",
  email: "citysteel.corporation@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7/6, Garden Street, Ring Road, Shyamoli",
    addressLocality: "Dhaka",
    postalCode: "1207",
    addressRegion: "Dhaka Division",
    addressCountry: "BD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.7743,
    longitude: 90.3651,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "Bangladesh",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch menu data for Header (SSR)
  const [categoriesRes, servicesRes] = await Promise.all([
    supabase
      .from("product_categories")
      .select("title, slug")
      .order("created_at", { ascending: true }),
    supabase
      .from("services")
      .select("title, slug")
      .order("created_at", { ascending: false }),
  ]);

  const productsMenu = categoriesRes.data || [];
  const servicesMenu = servicesRes.data || [];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body
        className={`antialiased ${oswald.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        {/* ============================================
            Google Analytics (GA4)
            ============================================ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D2RXQZ3S1K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D2RXQZ3S1K');
          `}
        </Script>

        <Header productsMenu={productsMenu} servicesMenu={servicesMenu} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
