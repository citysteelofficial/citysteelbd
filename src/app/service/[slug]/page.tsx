/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { ServiceDetailGallery } from '@/components/site/ServiceDetailGallery';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await supabase
    .from('services')
    .select('seo_title, seo_description, title, description')
    .eq('slug', slug)
    .single();
    
  if (!service) return { title: 'Service Not Found' };

  return {
    title: service.seo_title || `${service.title} | City Steel Corporation`,
    description: service.seo_description || service.description,
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug } = await params;
  
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!service) {
    notFound();
  }

  // Parse images if needed
  const images = service.images || (service.image_url ? [service.image_url] : []);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Service Details"
        title={service.title}
        description={service.description}
      />

      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="space-y-16">
            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-4xl leading-relaxed">
              {service.content ? (
                <div dangerouslySetInnerHTML={{ __html: service.content }} />
              ) : (
                <p className="text-lg text-muted-foreground">
                  {service.description}
                </p>
              )}
            </div>

            {/* Full-width Image Gallery */}
            {images.length > 0 && (
              <div className="border-t border-border pt-12">
                <h3 className="font-display text-2xl font-bold uppercase tracking-wider mb-8 text-foreground flex items-center gap-2">
                  <span className="h-px w-8 bg-primary" /> Service Gallery
                </h3>
                <ServiceDetailGallery images={images} serviceTitle={service.title} />
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
