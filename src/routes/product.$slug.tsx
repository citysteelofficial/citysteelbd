import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { PageShell } from '@/components/site/PageShell';
import { DetailLoadingSkeleton } from '@/components/site/LoadingSkeleton';
import { sanitizeHtml } from '@/lib/sanitize';
import { FileText, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/product/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (error || !data) throw notFound();
    return { product: data };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { product } = loaderData;
    return {
      meta: [
        { title: product.seo_title || `${product.title} | City Steel Corporation` },
        { name: 'description', content: product.seo_description || product.description || '' },
        { property: 'og:title', content: product.seo_title || product.title },
        { property: 'og:image', content: product.image_url || '' },
      ]
    };
  },
  component: ProductDetail,
  pendingComponent: DetailLoadingSkeleton,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const allImages = product.images?.length ? product.images : (product.image_url ? [product.image_url] : []);
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex(i => (i + 1) % allImages.length);
  const goPrev = () => setActiveIndex(i => (i - 1 + allImages.length) % allImages.length);

  return (
    <PageShell>
      <section className="bg-surface py-20">
        <div className="container-x">
          <div className="mb-8">
            <Link
              to="/products"
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div>
              {allImages.length > 0 ? (
                <div className="space-y-3">
                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-2xl bg-muted border border-border shadow-elegant aspect-[4/3]">
                    <img src={allImages[activeIndex]} alt={product.title} className="w-full h-full object-cover transition-all duration-300" />
                    {allImages.length > 1 && (
                      <>
                        <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                        <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"><ChevronRight className="h-5 w-5" /></button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">{activeIndex + 1} / {allImages.length}</div>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allImages.map((url: string, i: number) => (
                        <button key={i} onClick={() => setActiveIndex(i)} className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <img src={url} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground">No Image Available</div>
              )}
            </div>

            {/* Content Side */}
            <div className="flex flex-col">
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                  {product.category?.replace('-', ' ')}
                </span>
                <h1 className="font-display text-4xl font-bold lg:text-5xl text-foreground leading-tight mb-6">{product.title}</h1>
                {product.description && <p className="text-lg text-muted-foreground mb-8">{product.description}</p>}
              </div>
              {product.content && (
                <div className="prose prose-lg dark:prose-invert max-w-none text-foreground mb-12 border-t border-border pt-8" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.content) }} />
              )}
              <div className="mt-auto bg-card rounded-xl border border-border p-8 shadow-soft">
                <h3 className="text-xl font-bold mb-2">Interested in this product?</h3>
                <p className="text-muted-foreground mb-6">Get in touch with our team for specifications, pricing, and project integration details.</p>
                <Link to="/contact" search={{ subject: `Quote Request: ${product.title}` }} className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-8 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-[1.02] w-full sm:w-auto">
                  <FileText className="h-5 w-5" /> Get Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
