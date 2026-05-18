/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';
import { PageShell, PageHeader } from '@/components/site/PageShell';
import { ProductGrid } from '@/components/site/ProductGrid';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${categoryTitle} | City Steel Corporation`,
    description: `Browse our premium selection of ${categoryTitle} products for industrial steel structures.`,
  };
}

export default async function ProductCategoryPage({ params }: Props) {
  const { slug } = await params;
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false });

  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Products"
        title={categoryTitle}
        description={`Explore our high-quality ${categoryTitle} solutions designed for durability and performance in industrial applications.`}
      />

      <section className="bg-surface py-24">
        <div className="container-x">
          {!products || products.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-border shadow-soft">
              <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Products Available</h3>
              <p className="text-muted-foreground">We are currently updating our inventory for {categoryTitle}. Please check back later or contact us directly.</p>
              <Link href="/contact" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contact Us
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} />
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
