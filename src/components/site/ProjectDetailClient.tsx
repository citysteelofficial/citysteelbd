/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { FileText, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PageShell } from '@/components/site/PageShell';
import { sanitizeHtml } from '@/lib/sanitize';

interface Props {
  project: any;
}

export function ProjectDetailClient({ project }: Props) {
  const allImages = project.images?.length ? project.images : (project.image_url ? [project.image_url] : []);
  const [activeIndex, setActiveIndex] = useState(0);
  const goNext = () => setActiveIndex(i => (i + 1) % allImages.length);
  const goPrev = () => setActiveIndex(i => (i - 1 + allImages.length) % allImages.length);

  return (
    <PageShell>
      <section className="bg-surface py-20">
        <div className="container-x">
          <div className="mb-8">
            <Link href={`/projects?status=${project.status.toLowerCase()}`} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Gallery
            </Link>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              {allImages.length > 0 ? (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-2xl bg-muted border border-border shadow-elegant aspect-[4/3]">
                    <Image 
                      src={allImages[activeIndex]} 
                      alt={project.title} 
                      fill 
                      className="object-cover transition-all duration-300" 
                      priority
                    />
                    {allImages.length > 1 && (<>
                      <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-10"><ChevronLeft className="h-5 w-5" /></button>
                      <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center z-10"><ChevronRight className="h-5 w-5" /></button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full z-10">{activeIndex + 1} / {allImages.length}</div>
                    </>)}
                  </div>
                  {allImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {allImages.map((url: string, i: number) => (
                        <button key={i} onClick={() => setActiveIndex(i)} className={`relative flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <Image src={url} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground">No Image Available</div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="mb-6">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 ${project.status === 'ONGOING' ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}`}>
                  {project.status} PROJECT
                </span>
                <h1 className="font-display text-4xl font-bold lg:text-5xl text-foreground leading-tight mb-6">{project.title}</h1>
                {project.description && <p className="text-lg text-muted-foreground mb-8">{project.description}</p>}
              </div>
              {project.content && (<div className="prose prose-lg dark:prose-invert max-w-none text-foreground mb-12 border-t border-border pt-8" dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }} />)}
              <div className="mt-auto bg-card rounded-xl border border-border p-8 shadow-soft">
                <h3 className="text-xl font-bold mb-2">Want to build something similar?</h3>
                <p className="text-muted-foreground mb-6">Contact our team to discuss your structural steel building project requirements.</p>
                <Link href={`/contact?subject=Inquiry about project: ${project.title}`} className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-8 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-[1.02] w-full sm:w-auto">
                  <FileText className="h-5 w-5" /> Start a Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
