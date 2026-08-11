import type { Metadata } from "next";
import { ContactClient } from "@/components/site/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Get a Quote for Steel Structures",
  description: "Contact City Steel Corporation for a quote, consultation, or partnership inquiry. Office: Shyamoli, Dhaka. Call: +880 1711-787556. Factory: Hemayatpur, Savar.",
  alternates: { canonical: "https://citysteelbd.com/contact" },
  openGraph: {
    title: "Contact City Steel Corporation",
    description: "Get in touch for a quote on steel structures, PEB buildings, and industrial construction.",
  },
};

// The root layout builds the header menu from Supabase. Without a revalidate
// window this page stays frozen at build time and its navigation goes stale
// whenever the client adds a product category or service.
export const revalidate = 60;

export default function ContactPage() {
  return <ContactClient />;
}
