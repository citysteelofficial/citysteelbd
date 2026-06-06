import { supabase } from '@/lib/supabase';
import { PageShell } from '@/components/site/PageShell';
import { sanitizeHtml } from '@/lib/sanitize';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

/**
 * Try to find a blog by slug. Handles the case where the slug was
 * stored with a "/blogs/" prefix in the database.
 */
async function findBlog(slug: string) {
  // First try exact match with the clean slug
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (blog) return blog;

  // Fallback: try with "/blogs/" prefix (legacy data)
  const { data: blogWithPrefix } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', `/blogs/${slug}`)
    .eq('is_published', true)
    .single();

  return blogWithPrefix || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await findBlog(slug);
  
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.seo_title || blog.title,
    description: blog.seo_description || `Read "${blog.title}" on City Steel Corporation Blog.`,
    keywords: blog.seo_keywords || '',
    alternates: {
      canonical: `https://citysteelbd.com/blogs/${slug}`,
    },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || '',
      images: blog.thumbnail_url ? [blog.thumbnail_url] : [],
      type: 'article',
      publishedTime: blog.created_at,
      authors: ['City Steel Corporation'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seo_title || blog.title,
      images: blog.thumbnail_url ? [blog.thumbnail_url] : [],
    },
  };
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const blog = await findBlog(slug);
  
  if (!blog) notFound();

  // JSON-LD Article structured data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    image: blog.thumbnail_url || '',
    datePublished: blog.created_at,
    author: { "@type": "Organization", name: "City Steel Corporation" },
    publisher: {
      "@type": "Organization",
      name: "City Steel Corporation",
      logo: { "@type": "ImageObject", url: "https://citysteelbd.com/logo.svg" },
    },
    mainEntityOfPage: `https://citysteelbd.com/blogs/${slug}`,
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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

