import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";

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
};

export const metadata: Metadata = {
  title: "City Steel Corporation | Premium Industrial Steel Structures",
  description: "City Steel Corporation delivers premium pre-engineered steel buildings, trusses, and industrial structures across Bangladesh.",
  authors: [{ name: "City Steel BD" }],
  openGraph: {
    title: "City Steel Corporation",
    description: "Premium industrial steel structures in Bangladesh.",
    type: "website",
    url: "https://citysteelbd.com",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch menu data for Header (SSR)
  const [categoriesRes, servicesRes] = await Promise.all([
    supabase.from('product_categories').select('title, slug').order('created_at', { ascending: true }),
    supabase.from('services').select('title, slug').order('created_at', { ascending: false })
  ]);

  const productsMenu = categoriesRes.data || [];
  const servicesMenu = servicesRes.data || [];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${oswald.variable} ${inter.variable}`}>
        <Header productsMenu={productsMenu} servicesMenu={servicesMenu} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
