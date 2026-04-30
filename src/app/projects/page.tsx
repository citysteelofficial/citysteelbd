/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Projects — City Steel Corporation",
  description: "A portfolio of completed and ongoing industrial steel structure projects across Bangladesh.",
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const allProjects = projects || [];

  // Separate ongoing and completed
  const ongoing = allProjects.filter((p: any) => p.status === 'ONGOING');
  const completed = allProjects.filter((p: any) => p.status === 'COMPLETED');

  const showOngoing = !status || status === 'ongoing';
  const showCompleted = !status || status === 'completed';

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Projects"
        title="Recent Projects"
        description="Explore a selection of our recent industrial steel structure projects delivered across Bangladesh."
      />

      <section className="py-24">
        <div className="container-x">
          {showOngoing && ongoing.length > 0 && (
            <div className="mb-16">
              <h2 className="mb-8 font-display text-3xl font-bold uppercase tracking-widest text-primary border-b-2 border-primary inline-block pb-2">Ongoing Projects</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {ongoing.map((p: any) => (
                  <ProjectGalleryCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {showCompleted && completed.length > 0 && (
            <div>
              <h2 className="mb-8 font-display text-3xl font-bold uppercase tracking-widest text-primary border-b-2 border-primary inline-block pb-2">Completed Projects</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {completed.map((p: any) => (
                  <ProjectGalleryCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}

          {((showOngoing && ongoing.length === 0) && (showCompleted && completed.length === 0)) && (
            <div className="text-center py-20 text-muted-foreground">
              No projects available in this category at the moment. Check back soon!
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function ProjectGalleryCard({ project }: { project: any }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-xl bg-muted shadow-soft transition-all hover:shadow-elegant"
    >
      {project.image_url ? (
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-secondary px-4 text-center">
          {project.title}
        </div>
      )}
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
        <span className="text-white font-semibold tracking-wider text-sm uppercase px-4 text-center">
          View Details
        </span>
      </div>
    </Link>
  );
}
