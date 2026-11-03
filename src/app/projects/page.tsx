/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";
import { ProjectsGalleryClient } from "@/components/site/ProjectsGalleryClient";

export const metadata: Metadata = {
  title: "Our Projects — Completed & Ongoing Steel Structures",
  description: "150+ completed and ongoing steel structure projects across Bangladesh: factories, warehouses and industrial buildings by City Steel Corporation.",
  alternates: { canonical: "https://citysteelbd.com/projects" },
  openGraph: {
    title: "Our Projects | City Steel Corporation",
    description: "A portfolio of completed and ongoing industrial steel structure projects across Bangladesh.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "City Steel Corporation — PEB & steel structure company in Bangladesh" }],
  },
};

export const revalidate = 60;

export default async function ProjectsPage() {
  // Fetch all projects from Supabase dynamically
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  const allProjects = projects || [];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Our Projects"
        title="Recent Projects"
        description="Explore a selection of our recent industrial steel structure projects delivered across Bangladesh."
      />

      <section className="py-24">
        <div className="container-x">
          <ProjectsGalleryClient projects={allProjects} />
        </div>
      </section>
    </PageShell>
  );
}

