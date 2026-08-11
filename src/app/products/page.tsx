import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Products — Industrial Steel Building Components",
  description: "Browse premium steel building products: steel columns, beams, purlins, rafters, roof and deck sheets, sliding doors, and more from City Steel Corporation.",
  alternates: { canonical: "https://citysteelbd.com/products" },
  openGraph: {
    title: "Our Products | City Steel Corporation",
    description: "A complete range of steel building components engineered for industrial performance and longevity.",
  },
};

export const revalidate = 60;

export default async function ProductsPage() {
  const { data: categories } = await supabase
    .from("product_categories")
    .select("title, slug")
    .order("created_at", { ascending: true });

  const items = categories || [];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Products"
        title="Highest Quality Products"
        description="A complete range of steel building components engineered for industrial performance and longevity."
      />

      <section className="py-24">
        {items.length === 0 ? (
          <div className="container-x">
            <div className="rounded-xl border border-border bg-surface py-20 text-center shadow-soft">
              <h2 className="mb-2 text-xl font-bold">Product Catalogue Coming Soon</h2>
              <p className="text-muted-foreground">
                We are currently updating our catalogue. Please contact us directly for product details.
              </p>
            </div>
          </div>
        ) : (
          <div className="container-x grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group relative bg-background p-10 transition-all hover:bg-surface"
              >
                <div className="mb-6 font-display text-6xl font-black text-primary/20 transition-colors group-hover:text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mb-3 font-display text-2xl font-bold uppercase leading-tight">
                  {c.title}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  View Products
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
        )}

        <div className="container-x mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
          >
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
