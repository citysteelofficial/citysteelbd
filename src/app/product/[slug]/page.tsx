import { supabase } from '@/lib/supabase';
import { PageShell } from '@/components/site/PageShell';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('title, seo_title, seo_description, description')
    .eq('slug', slug)
    .single();
    
  if (!product) return { title: 'Product Not Found | City Steel Corporation' };

  return {
    title: product.seo_title || `${product.title} | City Steel Corporation`,
    description: product.seo_description || product.description,
  };
}

export default async function SingleProductPage({ params }: Props) {
  const { slug } = await params;
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  // Parse specifications
  let specs: Record<string, string> = {};
  if (product.specifications && typeof product.specifications === 'object') {
    specs = product.specifications;
  }
  const specEntries = Object.entries(specs);

  // Compile all images
  const allImages = [];
  if (product.image_url) allImages.push(product.image_url);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img: string) => {
      if (img !== product.image_url) allImages.push(img);
    });
  }

  return (
    <PageShell>
      {/* Breadcrumb Navigation */}
      <div className="bg-muted py-4 border-b border-border">
        <div className="container-x flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
          <Link href={`/products/${product.category}`} className="hover:text-primary transition-colors uppercase">
            {product.category?.replace('-', ' ')}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
          <span className="text-foreground font-medium truncate">{product.title}</span>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container-x">
          <Link 
            href={`/products/${product.category}`} 
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-10 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Category
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border shadow-soft">
                {allImages[0] ? (
                  <Image 
                    src={allImages[0]} 
                    alt={product.title} 
                    fill 
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                      <Image src={img} alt={`Thumbnail ${idx+1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Specifications */}
            <div className="flex flex-col">
              <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {product.category?.replace('-', ' ')}
              </div>
              <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl mt-2 mb-6">
                {product.title}
              </h1>
              
              {product.description && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Dynamic Specifications Block */}
              {specEntries.length > 0 && (
                <div className="mt-4 mb-10">
                  <h3 className="text-xl font-display font-bold uppercase mb-6 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-primary" />
                    Key Specifications
                  </h3>
                  <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-soft">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-border">
                        {specEntries.map(([key, value], idx) => (
                          <tr key={idx} className="hover:bg-muted/50 transition-colors">
                            <th className="px-6 py-4 font-semibold text-foreground w-1/3 bg-muted/30">
                              {key}
                            </th>
                            <td className="px-6 py-4 text-muted-foreground">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 text-base font-bold uppercase tracking-wide text-primary-foreground shadow-elegant transition-all hover:bg-primary/90 hover:-translate-y-1">
                  Request a Quote
                </Link>
                <a href="tel:+8801711787556" className="inline-flex h-14 items-center justify-center rounded-md border-2 border-primary/20 bg-transparent px-8 text-base font-bold uppercase tracking-wide text-foreground transition-all hover:border-primary hover:bg-primary/5">
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Bottom: Detailed Content */}
          {product.content && (
            <div className="mt-20 pt-16 border-t border-border">
              <h2 className="font-display text-3xl font-bold uppercase mb-10">Product Description</h2>
              <div 
                className="prose prose-lg dark:prose-invert max-w-4xl prose-headings:font-display prose-headings:uppercase prose-a:text-primary prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: product.content }}
              />
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
