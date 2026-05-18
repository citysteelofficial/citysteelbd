/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
          <Link 
            href={`/services/${service.category}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              {images.length > 0 ? (
                <>
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted shadow-soft">
                    <Image
                      src={images[0]}
                      alt={service.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {images.slice(1).map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                  No images available
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {service.content ? (
                <div dangerouslySetInnerHTML={{ __html: service.content }} />
              ) : (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
