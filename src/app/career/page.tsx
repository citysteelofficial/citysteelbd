import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Career — City Steel Corporation",
  description: "Build your career with City Steel Corporation — join a team of skilled engineers, fabricators and project managers.",
};

const jobs = [
  { t: "Structural Design Engineer", loc: "Dhaka", type: "Full-time" },
  { t: "Site Supervisor", loc: "Chittagong", type: "Full-time" },
  { t: "Welding Technician", loc: "Gazipur", type: "Full-time" },
  { t: "Project Manager", loc: "Dhaka", type: "Full-time" },
  { t: "Quality Control Inspector", loc: "Narayanganj", type: "Full-time" },
  { t: "Sales Executive", loc: "Dhaka", type: "Full-time" },
];

export default function CareerPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Join the Team"
        title="Build Your Career"
        description="At City Steel Corporation, we don't just build structures — we build careers. Join a team driven by craftsmanship and innovation."
      />

      <section className="py-24">
        <div className="container-x">
          <h2 className="mb-10 font-display text-3xl font-bold uppercase tracking-wide">
            Open <span className="text-gradient-red">Positions</span>
          </h2>
          <div className="space-y-3">
            {jobs.map((j) => (
              <div
                key={j.t}
                className="group flex flex-wrap items-center justify-between gap-6 border border-border bg-surface p-6 transition-all hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-gradient-primary shadow-red">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">{j.t}</h3>
                    <div className="mt-1 flex flex-wrap gap-4 text-xs uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {j.loc}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> {j.type}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Apply <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
