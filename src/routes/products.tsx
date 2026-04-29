import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — City Steel Corporation" },
      {
        name: "description",
        content:
          "Pre-engineered buildings, steel trusses, roofing sheets, purlins and more from City Steel Corporation.",
      },
      { property: "og:title", content: "Products — City Steel Corporation" },
    ],
  }),
  component: ProductsPage,
});

const products = [
  { t: "Pre-Engineered Buildings (PEB)", d: "Custom-designed steel buildings for warehouses, factories, and commercial use." },
  { t: "Steel Trusses & Frames", d: "Heavy-duty welded and bolted trusses engineered to load specifications." },
  { t: "Roofing & Wall Sheets", d: "Color-coated, galvanized, and insulated panels for any climate." },
  { t: "Purlins & Girts", d: "Cold-formed C and Z sections for roof and wall framing." },
  { t: "Crane Beams & Runways", d: "Heavy-duty overhead crane support structures." },
  { t: "Mezzanine Floors", d: "Multi-level steel floor systems for added capacity." },
  { t: "Skylights & Ventilators", d: "Natural lighting and ventilation accessories." },
  { t: "Steel Doors & Windows", d: "Industrial-grade steel openings and frames." },
];

function ProductsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Products"
        title="Highest Quality Products"
        description="A complete range of steel building components engineered for industrial performance and longevity."
      />

      <section className="py-24">
        <div className="container-x grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <div
              key={p.t}
              className="group relative bg-background p-10 transition-all hover:bg-surface"
            >
              <div className="mb-6 font-display text-6xl font-black text-primary/20">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-3 font-display text-2xl font-bold leading-tight">{p.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-primary transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        <div className="container-x mt-16 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
