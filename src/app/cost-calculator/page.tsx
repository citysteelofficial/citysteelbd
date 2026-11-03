import type { Metadata } from "next";
import { CostCalculator } from "@/components/site/CostCalculator";

export const metadata: Metadata = {
  title: "Steel Building Cost Calculator Bangladesh",
  description: "Estimate the cost of a PEB steel shed, mezzanine floor and foundation in Bangladesh per sq ft. Free instant estimate and quote from City Steel Corporation.",
  alternates: { canonical: "https://citysteelbd.com/cost-calculator" },
  openGraph: {
    title: "Steel Building Cost Calculator | City Steel Corporation",
    description: "Instant approximate cost for a PEB steel shed in Bangladesh.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "City Steel Corporation — PEB & steel structure company in Bangladesh" }],
  },
};

// Keeps the header menu fresh, like every other page (see HANDOVER.md §3).
export const revalidate = 60;

export default function CostCalculatorPage() {
  return <CostCalculator />;
}
