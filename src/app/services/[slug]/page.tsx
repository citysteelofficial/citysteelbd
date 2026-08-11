import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { ServiceGallery } from '@/components/site/ServiceGallery';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Services have no dedicated category table, so a category only "exists" if at
 * least one service is filed under it. Anything else must 404 rather than
 * render an empty page under an invented title (a soft 404 to search engines).
 */
async function getServicesByCategory(slug: string) {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false });

  return data ?? [];
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServicesByCategory(slug);

  if (services.length === 0) return { title: 'Category Not Found' };

  const categoryTitle = titleFromSlug(slug);

  return {
    title: `${categoryTitle} | City Steel Corporation`,
    description: `Explore our comprehensive ${categoryTitle.toLowerCase()} services for industrial steel structures.`,
    alternates: {
      canonical: `https://citysteelbd.com/services/${slug}`,
    },
  };
}

export const revalidate = 60;

export default async function ServiceCategoryPage({ params }: Props) {
  const { slug } = await params;
  const services = await getServicesByCategory(slug);

  if (services.length === 0) notFound();

  const categoryTitle = titleFromSlug(slug);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Services"
        title={categoryTitle}
        description={`Explore our comprehensive ${categoryTitle.toLowerCase()} solutions delivered by industry experts.`}
      />

      <section className="bg-surface py-24">
        <div className="container-x">
          <ServiceGallery services={services} />
        </div>
      </section>
    </PageShell>
  );
}
