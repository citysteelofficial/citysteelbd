import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calculator, CheckCircle2, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AREAS, getArea } from '@/lib/areas';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { JsonLd, breadcrumbLd, ORG_REF } from '@/components/site/JsonLd';

interface Props {
  params: Promise<{ area: string }>;
}

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: 'Not Found' };
  return {
    title: area.seoTitle,
    description: area.seoDescription,
    alternates: { canonical: `https://citysteelbd.com/steel-building/${area.slug}` },
    openGraph: {
      title: `${area.seoTitle} | City Steel Corporation`,
      description: area.seoDescription,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'City Steel Corporation — PEB & steel structure company in Bangladesh' }],
    },
  };
}

type ProjectRow = { id: string; title: string; slug: string; location: string | null; image_url: string | null; description: string | null };

export default async function AreaPage({ params }: Props) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const { data } = await supabase
    .from('projects')
    .select('id, title, slug, location, image_url, description')
    .or(area.match.map((m) => `location.ilike.%${m}%`).join(','))
    .order('created_at', { ascending: false });
  const projects = (data || []) as ProjectRow[];

  const url = `https://citysteelbd.com/steel-building/${area.slug}`;

  return (
    <PageShell>
      <JsonLd
        data={[
          breadcrumbLd([['Home', '/'], [area.name, `/steel-building/${area.slug}`]]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `Steel building and PEB construction in ${area.name}`,
            serviceType: 'Pre-engineered steel building design, fabrication and erection',
            provider: ORG_REF,
            areaServed: { '@type': 'Place', name: `${area.name}, Bangladesh` },
            url,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: area.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      <PageHeader
        eyebrow={`Service Area · ${area.name}`}
        title={`Steel Building & PEB Construction in ${area.name}`}
        description={area.seoDescription}
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:col-span-2">
            {area.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="space-y-4 border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide">What we build in {area.name}</h2>
            <ul className="space-y-2 text-sm">
              {area.industries.map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{x}</li>
              ))}
            </ul>
            <Link href="/cost-calculator" className="mt-2 inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
              <Calculator className="h-4 w-4" /> Estimate your cost
            </Link>
            <a href="tel:+8801711787556" className="block text-center text-sm font-semibold text-primary">Call 01711-787556</a>
          </aside>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="bg-surface py-16 md:py-24">
          <div className="container-x">
            <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Our projects in {area.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <Link key={p.id} href={`/project/${p.slug}`} className="group block overflow-hidden border border-border bg-background shadow-soft transition hover:-translate-y-1 hover:border-primary/30">
                  <div className="relative aspect-[16/10] bg-muted">
                    {p.image_url && (
                      <Image src={p.image_url} alt={`${p.title} steel structure project`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold uppercase leading-tight">{p.title}</h3>
                    {p.location && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{p.location}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">View project <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container-x max-w-4xl">
          <h2 className="mb-8 font-display text-2xl font-bold uppercase tracking-wide md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {area.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">
                  <span className="mr-2 text-primary group-open:hidden">+</span>
                  <span className="mr-2 hidden text-primary group-open:inline">−</span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-5 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="mb-4 font-display text-lg font-bold uppercase tracking-wide">Other service areas</h2>
            <div className="flex flex-wrap gap-2">
              {AREAS.filter((a) => a.slug !== area.slug).map((a) => (
                <Link key={a.slug} href={`/steel-building/${a.slug}`} className="border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary">
                  {a.name}
                </Link>
              ))}
              <Link href="/service/peb-design-and-build" className="border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary">
                PEB Design &amp; Build
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
