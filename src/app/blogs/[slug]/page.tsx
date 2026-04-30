import { supabase } from '@/lib/supabase';
import { PageShell } from '@/components/site/PageShell';
import { sanitizeHtml } from '@/lib/sanitize';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.seo_title || `${blog.title} | City Steel Corporation`,
    description: blog.seo_description || '',
    keywords: blog.seo_keywords || '',
    openGraph: {
      title: blog.seo_title || blog.title,
      images: blog.thumbnail_url ? [blog.thumbnail_url] : [],
      type: 'article',
    },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  
  if (error || !blog) notFound();

  return (
    <PageShell>
      <section className="bg-surface py-24">
        <div className="container-x">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
                {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h1 className="font-display text-4xl font-bold lg:text-6xl mb-8 text-foreground leading-tight">
                {blog.title}
              </h1>
            </div>
            
            {blog.thumbnail_url && (
              <div className="relative mb-12 w-full h-[500px] overflow-hidden rounded-xl shadow-elegant">
                <Image 
                  src={blog.thumbnail_url} 
                  alt={blog.title} 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
