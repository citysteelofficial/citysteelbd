/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import Link from 'next/link';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${categoryTitle} | City Steel Corporation`,
    description: `Explore our comprehensive ${categoryTitle} services for industrial steel structures.`,
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { slug } = await params;
  
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false });

  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Services"
        title={categoryTitle}
        description={`Explore our comprehensive ${categoryTitle} solutions delivered by industry experts.`}
      />

      <section className="bg-surface py-24">
        <div className="container-x">
          {!services || services.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-border shadow-soft">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Services Available</h3>
              <p className="text-muted-foreground">We are currently updating our offerings for {categoryTitle}. Please check back later or contact us directly.</p>
              <Link href="/contact" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {services.map((service: any) => (
                <Link
                  key={service.id}
                  href={`/service/${service.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-muted shadow-soft transition-all hover:shadow-elegant"
                >
                  {service.image_url ? (
                    <Image
                      src={service.image_url}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary">
                      {service.title}
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                    <span className="text-white font-semibold tracking-wider text-sm uppercase px-4 text-center">
                      View Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
