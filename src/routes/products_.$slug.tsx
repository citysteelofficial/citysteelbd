import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { PageLoadingSkeleton } from '@/components/site/LoadingSkeleton';
import type { Product } from '@/types/supabase';
import { Link } from '@tanstack/react-router';
import { ShoppingCart, FileText } from 'lucide-react';

export const Route = createFileRoute('/products_/$slug')({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', params.slug)
      .order('created_at', { ascending: false });
      
    // Create a pretty title from the slug (e.g. steel-column -> Steel Column)
    const categoryTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return { products: data || [], categoryTitle, categorySlug: params.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { categoryTitle } = loaderData;
    return {
      meta: [
        { title: `${categoryTitle} | City Steel Corporation` },
        { name: 'description', content: `Browse our premium selection of ${categoryTitle} products for industrial steel structures.` },
        { property: 'og:title', content: `${categoryTitle} | City Steel` },
      ]
    };
  },
  component: ProductCategory,
  pendingComponent: PageLoadingSkeleton,
});

function ProductCategory() {
  const { products, categoryTitle } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Products"
        title={categoryTitle}
        description={`Explore our high-quality ${categoryTitle} solutions designed for durability and performance in industrial applications.`}
      />

      <section className="bg-surface py-24">
        <div className="container-x">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-border shadow-soft">
              <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Products Available</h3>
              <p className="text-muted-foreground">We are currently updating our inventory for {categoryTitle}. Please check back later or contact us directly.</p>
              <Link to="/contact" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product: Product) => (
                <Link
                  key={product.id}
                  to={`/product/$slug`}
                  params={{ slug: product.slug }}
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-muted shadow-soft transition-all hover:shadow-elegant"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary">
                      {product.title}
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

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
