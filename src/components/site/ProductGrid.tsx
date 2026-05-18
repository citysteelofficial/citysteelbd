"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  category: string;
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-background rounded-xl border border-border shadow-soft">
        <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-xl font-bold mb-2">No Products Found</h3>
        <p className="text-muted-foreground">We couldn't find any products in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group flex flex-col overflow-hidden rounded-xl bg-background border border-border shadow-soft hover:shadow-elegant transition-all duration-300"
        >
          {/* Image Container */}
          <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </Link>

          {/* Content Container */}
          <div className="flex flex-1 flex-col p-5">
            <Link href={`/product/${product.slug}`} className="block">
              <h3 className="font-display text-xl font-bold uppercase hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h3>
            </Link>
            
            {product.description && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3 flex-1">
                {product.description}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-border">
              <Link 
                href={`/product/${product.slug}`}
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/btn"
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
