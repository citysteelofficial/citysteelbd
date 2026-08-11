/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowRight, CalendarDays, DollarSign, Award } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";
import { sanitizeHtml } from "@/lib/sanitize";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Career — Job Openings at City Steel Corporation",
  description: "Join City Steel Corporation — explore current job openings for engineers, fabricators, project managers, and more. Build your career in the steel construction industry.",
  alternates: { canonical: "https://citysteelbd.com/career" },
  openGraph: {
    title: "Career Opportunities | City Steel Corporation",
    description: "Join a team driven by craftsmanship and innovation in industrial steel structures.",
  },
};

export default async function CareerPage() {
  const { data: jobs } = await supabase
    .from('job_circulars')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const activeJobs = (jobs || []).filter((j: any) => {
    // Also filter out expired jobs on the public side
    if (j.deadline && new Date(j.deadline) < new Date()) return false;
    return true;
  });

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

          {activeJobs.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-xl border border-border shadow-soft">
              <Briefcase className="mx-auto h-14 w-14 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Open Positions Right Now</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We currently don&apos;t have any open positions. Please check back later or send us your CV via the contact page.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 bg-gradient-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
              >
                Contact Us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeJobs.map((j: any) => (
                <div
                  key={j.id}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 border border-border bg-surface p-6 transition-all hover:border-primary"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-primary shadow-red">
                      <Briefcase className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{j.title}</h3>
                      {j.department && (
                        <div className="text-xs text-primary font-semibold uppercase tracking-wider mt-0.5">{j.department}</div>
                      )}
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> {j.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {j.job_type}
                        </span>
                        {j.experience && (
                          <span className="flex items-center gap-1.5">
                            <Award className="h-3 w-3" /> {j.experience}
                          </span>
                        )}
                        {j.salary_range && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" /> {j.salary_range}
                          </span>
                        )}
                        {j.deadline && (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3" /> Deadline: {new Date(j.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Description preview */}
                      {j.description && (
                        <div
                          className="mt-3 text-sm text-muted-foreground line-clamp-2 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(j.description) }}
                        />
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/contact?subject=${encodeURIComponent(`Job Application: ${j.title}`)}`}
                    className="inline-flex items-center gap-2 border border-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-primary hover:text-primary-foreground shrink-0 self-start md:self-center"
                  >
                    Apply <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
