/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  slug: string;
  status: 'COMPLETED' | 'ONGOING';
  location?: string;
  description?: string;
  image_url?: string;
  images?: string[];
}

interface ProjectsGalleryClientProps {
  projects: Project[];
}

type FilterType = 'ALL' | 'COMPLETED' | 'ONGOING';

export function ProjectsGalleryClient({ projects }: ProjectsGalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // Filter projects dynamically
  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="space-y-12">
      {/* Dynamic Aesthetic Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {[
          { label: 'All Projects', value: 'ALL' },
          { label: 'Completed Projects', value: 'COMPLETED' },
          { label: 'Ongoing Projects', value: 'ONGOING' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value as FilterType)}
            className={`relative overflow-hidden px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 md:px-8 md:py-3.5 ${
              activeFilter === tab.value
                ? 'bg-primary text-primary-foreground shadow-red scale-[1.03]'
                : 'bg-card border border-border text-foreground hover:border-primary/50 hover:bg-surface/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Dynamic Premium Project Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.slug}`}
              className="group relative block aspect-[16/10] overflow-hidden bg-muted border border-border/40 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant hover:border-primary/30"
            >
              {/* Main Project Image */}
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground bg-secondary px-6 text-center space-y-2">
                  <Building2 className="h-10 w-10 text-muted-foreground/50" />
                  <span className="font-semibold text-sm">{project.title}</span>
                </div>
              )}

              {/* Status Badge - Glassmorphism */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider backdrop-blur-md border ${
                    project.status === 'ONGOING'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      : 'bg-green-500/10 border-green-500/20 text-green-400'
                  }`}
                >
                  <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${project.status === 'ONGOING' ? 'bg-amber-500 animate-pulse' : 'bg-green-400'}`} />
                  {project.status}
                </span>
              </div>

              {/* Bottom Info Gradient Bar (Subtle & Highly Readable) */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 pt-16 flex flex-col justify-end transition-colors duration-300 group-hover:from-black/100">
                {/* Location (if exists) */}
                {project.location && (
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary mb-2 transition-transform duration-300">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{project.location}</span>
                  </div>
                )}

                {/* Company/Client Title */}
                <h3 className="font-display text-xl font-bold tracking-tight text-white leading-tight mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                  {project.title}
                </h3>

                {/* Short Description */}
                {project.description && (
                  <p className="text-xs text-[oklch(0.85_0_0)] leading-relaxed line-clamp-2 max-h-0 opacity-0 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-16 group-hover:opacity-100 group-hover:mb-3">
                    {project.description}
                  </p>
                )}

                {/* Slide-up Actions */}
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white transform translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span>Explore Case Study</span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-surface border border-dashed border-border rounded-xl">
          No projects available in this category at the moment.
        </div>
      )}
    </div>
  );
}
