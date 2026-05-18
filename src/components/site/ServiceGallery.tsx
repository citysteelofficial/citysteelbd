"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X, Search } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string;
  images: string[];
}

interface GalleryItem {
  id: string;
  url: string;
  service: Service;
}

export function ServiceGallery({ services }: { services: Service[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Flatten all images from all services into a single array
  const galleryItems: GalleryItem[] = [];
  
  services.forEach((service) => {
    // Get all unique images for this service
    const serviceImages = new Set<string>();
    if (service.image_url) serviceImages.add(service.image_url);
    if (service.images && Array.isArray(service.images)) {
      service.images.forEach(img => serviceImages.add(img));
    }
    
    // Create a gallery item for each image
    Array.from(serviceImages).forEach((url, index) => {
      if (url) {
        galleryItems.push({
          id: `${service.id}-${index}`,
          url,
          service
        });
      }
    });
  });

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative block aspect-square cursor-pointer overflow-hidden rounded-xl bg-muted shadow-soft transition-all hover:shadow-elegant"
          >
            <Image
              src={item.url}
              alt={item.service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity">
          <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:flex-row">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Section */}
            <div className="relative h-64 w-full bg-black md:h-auto md:w-1/2 lg:w-3/5">
              <Image
                src={selectedItem.url}
                alt={selectedItem.service.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Content Section */}
            <div className="flex w-full flex-col overflow-y-auto p-6 md:w-1/2 lg:w-2/5 md:p-8">
              <h3 className="font-display text-2xl font-bold uppercase md:text-3xl">
                {selectedItem.service.title}
              </h3>
              
              <div className="mt-6 flex-1 space-y-4">
                {selectedItem.service.content ? (
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedItem.service.content }}
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedItem.service.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
