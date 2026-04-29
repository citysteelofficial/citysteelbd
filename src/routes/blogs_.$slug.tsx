import { createFileRoute, notFound } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { PageShell } from '@/components/site/PageShell';
import { DetailLoadingSkeleton } from '@/components/site/LoadingSkeleton';
import { sanitizeHtml } from '@/lib/sanitize';

export const Route = createFileRoute('/blogs_/$slug')({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_published', true)
      .single();
    
    if (error || !data) {
      throw notFound();
    }
    
    return { blog: data };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { blog } = loaderData;
    return {
      meta: [
        { title: blog.seo_title || `${blog.title} | City Steel Corporation` },
        { name: 'description', content: blog.seo_description || '' },
        { name: 'keywords', content: blog.seo_keywords || '' },
        { property: 'og:title', content: blog.seo_title || blog.title },
        { property: 'og:image', content: blog.thumbnail_url || '' },
        { property: 'og:type', content: 'article' }
      ]
    };
  },
  component: BlogDetails,
  pendingComponent: DetailLoadingSkeleton,
});

function BlogDetails() {
  const { blog } = Route.useLoaderData();

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
              <img 
                src={blog.thumbnail_url} 
                alt={blog.title} 
                className="mb-12 w-full h-[500px] object-cover rounded-xl shadow-elegant"
              />
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
