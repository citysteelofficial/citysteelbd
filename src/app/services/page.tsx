import type { Metadata } from "next";
import { Factory, Building2, HardHat, Wrench, Shield, Cog, Hammer, Ruler } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";

export const metadata: Metadata = {
  title: "Services — City Steel Corporation",
  description: "Design, fabrication, erection, and full Design & Build packages for industrial steel structures.",
};

const services = [
  { Icon: Ruler, t: "Engineering & Design", d: "Structural analysis, 3D modeling, and detailed shop drawings." },
  { Icon: Factory, t: "Pre-Engineered Buildings", d: "End-to-end PEB design tailored to your industrial needs." },
  { Icon: Hammer, t: "Steel Fabrication", d: "In-house fabrication with strict QC at every weld." },
  { Icon: HardHat, t: "Erection & Installation", d: "Skilled erection crews and project management on-site." },
  { Icon: Wrench, t: "Design & Build", d: "Single-source responsibility from concept to handover." },
  { Icon: Cog, t: "Roofing & Cladding", d: "Insulated and standard panel systems for any envelope." },
  { Icon: Shield, t: "Quality Assurance", d: "ISO-aligned QA/QC across material, welds, and erection." },
  { Icon: Building2, t: "Renovation & Retrofit", d: "Strengthening and modernization of existing structures." },
];

export default function ServicesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Services"
        title="Design & Build Package"
        description="Comprehensive services from initial concept and engineering to fabrication, erection, and final delivery."
      />

      <section className="py-24">
        <div className="container-x grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ Icon, t, d }) => (
            <div
              key={t}
              className="group relative bg-background p-8 transition-all hover:bg-surface"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-gradient-primary shadow-red transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-3 font-display text-lg font-bold leading-tight">{t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
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
