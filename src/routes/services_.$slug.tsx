import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { PageLoadingSkeleton } from '@/components/site/LoadingSkeleton';
import type { Service } from '@/types/supabase';
import { Link } from '@tanstack/react-router';
import { FileText, Settings } from 'lucide-react';

export const Route = createFileRoute('/services_/$slug')({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('category', params.slug)
      .order('created_at', { ascending: false });
      
    // Create a pretty title from the slug (e.g. architectural-design -> Architectural Design)
    const categoryTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return { services: data || [], categoryTitle, categorySlug: params.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { categoryTitle } = loaderData;
    return {
      meta: [
        { title: `${categoryTitle} | City Steel Corporation` },
        { name: 'description', content: `Explore our comprehensive ${categoryTitle} services for industrial steel structures.` },
        { property: 'og:title', content: `${categoryTitle} | City Steel` },
      ]
    };
  },
  component: ServiceCategory,
  pendingComponent: PageLoadingSkeleton,
});

function ServiceCategory() {
  const { services, categoryTitle } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Services"
        title={categoryTitle}
        description={`Explore our comprehensive ${categoryTitle} solutions delivered by industry experts.`}
      />

      <section className="bg-surface py-24">
        <div className="container-x">
          {services.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-border shadow-soft">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Services Available</h3>
              <p className="text-muted-foreground">We are currently updating our offerings for {categoryTitle}. Please check back later or contact us directly.</p>
              <Link to="/contact" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {services.map((service: Service) => (
                <Link
                  key={service.id}
                  to={`/service/$slug`}
                  params={{ slug: service.slug }}
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-muted shadow-soft transition-all hover:shadow-elegant"
                >
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
