import type { Metadata } from "next";
import Link from "next/link";
import { Factory, Building2, HardHat, Wrench, Shield, Cog, Hammer, Ruler, ArrowUpRight } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Services — Steel Structure Design, Fabrication & Erection",
  description: "Steel structure services from City Steel Corporation: structural design & drawing, architectural design, civil construction, steel building product supply, interior solutions, and complete Design & Build packages across Bangladesh.",
  alternates: { canonical: "https://citysteelbd.com/services" },
  openGraph: {
    title: "Our Services | City Steel Corporation",
    description: "Design, fabrication, erection, and full Design & Build packages for industrial steel structures.",
  },
};

export const revalidate = 60;

// Icons are assigned by position so every service gets a stable, distinct mark
// without requiring the client to pick one in the admin panel.
const ICONS = [Ruler, Factory, Hammer, HardHat, Wrench, Cog, Shield, Building2];

const COLUMNS = 4;

export default async function ServicesPage() {
  const { data } = await supabase
    .from("services")
    .select("title, slug, description")
    .order("created_at", { ascending: false });

  const services = (data || []).map((s) => ({
    ...s,
    title: (s.title || "").trim(),
  }));

  // The grid uses a 1px gap over a border-coloured background to get seamless
  // dividers, so an incomplete final row needs filler cells to stay clean.
  const fillerCount = services.length % COLUMNS === 0 ? 0 : COLUMNS - (services.length % COLUMNS);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Services"
        title="Design & Build Package"
        description="Comprehensive services from initial concept and engineering to fabrication, erection, and final delivery."
      />

      <section className="py-24">
        {services.length === 0 ? (
          <div className="container-x">
            <div className="rounded-xl border border-border bg-surface py-20 text-center shadow-soft">
              <h2 className="mb-2 text-xl font-bold">Services Coming Soon</h2>
              <p className="text-muted-foreground">
                Please contact us directly to discuss your project requirements.
              </p>
            </div>
          </div>
        ) : (
          <div className="container-x grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Link
                  key={s.slug}
                  href={`/service/${s.slug}`}
                  className="group relative bg-background p-8 transition-all hover:bg-surface"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center bg-gradient-primary shadow-red transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="mb-3 font-display text-lg font-bold leading-tight">{s.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.description?.trim()
                      ? s.description
                      : `Professional ${s.title.toLowerCase()} delivered by City Steel Corporation's in-house engineering team.`}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Learn More
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <div key={`filler-${i}`} className="hidden bg-background lg:block" />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface py-24">
        <div className="container-x">
          <div className="mb-12 text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Our Process
            </div>
            <h2 className="font-display text-5xl font-bold">From <span className="text-gradient-red">Concept</span> to Steel</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", t: "Consult", d: "Understand requirements and site conditions." },
              { n: "02", t: "Design", d: "Engineer the most efficient solution." },
              { n: "03", t: "Fabricate", d: "Precision-build in our facility." },
              { n: "04", t: "Erect", d: "Install on-site safely and on schedule." },
            ].map((s) => (
              <div key={s.n} className="border-l-2 border-primary bg-background p-8">
                <div className="font-display text-5xl font-black text-gradient-red">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
