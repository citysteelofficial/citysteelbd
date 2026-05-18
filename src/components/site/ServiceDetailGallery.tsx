"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X, Search } from 'lucide-react';

interface ServiceDetailGalleryProps {
  images: string[];
  serviceTitle: string;
}

export function ServiceDetailGallery({ images, serviceTitle }: ServiceDetailGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(img)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-muted shadow-soft transition-all hover:shadow-elegant"
          >
            <Image
              src={img}
              alt={`${serviceTitle} Gallery Image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Search className="h-6 w-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeImage}
              alt={serviceTitle}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
