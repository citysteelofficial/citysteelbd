import type { Metadata } from "next";
import { ContactClient } from "@/components/site/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — City Steel Corporation",
  description: "Get in touch with City Steel Corporation for a quote, consultation, or partnership inquiry. Visit our office in Shyamoli, Dhaka.",
  openGraph: {
    title: "Contact City Steel Corporation",
    description: "Get in touch with City Steel Corporation.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
