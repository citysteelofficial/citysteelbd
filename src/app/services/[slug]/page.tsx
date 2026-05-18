/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { ServiceGallery } from '@/components/site/ServiceGallery';
import Link from 'next/link';
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
            <ServiceGallery services={services} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
