import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProjectDetailClient } from '@/components/site/ProjectDetailClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();
  
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.seo_title || `${project.title} | City Steel Corporation`,
    description: project.seo_description || project.description || '',
    openGraph: {
      title: project.seo_title || project.title,
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
  
  if (error || !project) notFound();

  return <ProjectDetailClient project={project} />;
}
