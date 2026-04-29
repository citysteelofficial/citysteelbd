import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { PageLoadingSkeleton } from "@/components/site/LoadingSkeleton";
import { supabase } from "@/lib/supabase";
import type { Blog } from "@/types/supabase";

export const Route = createFileRoute("/blogs")({
  loader: async () => {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    return { blogs: data || [] };
  },
  head: () => ({
    meta: [
      { title: "Our Blog & Insights — City Steel Corporation" },
      {
        name: "description",
        content: "Read the latest news, insights, and updates from the steel construction industry.",
      },
    ],
  }),
  pendingComponent: PageLoadingSkeleton,
  component: BlogsPage,
});

function BlogsPage() {
  const { blogs } = Route.useLoaderData();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insights & News"
        title="Our Blog"
        description="Stay updated with the latest trends, technologies, and stories from the industrial steel structure sector."
      />

      <section className="py-24">
        <div className="container-x">
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No blog posts available at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: Blog) => (
                <div key={blog.id} className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:shadow-elegant">
                  <Link to={`/blogs/$slug`} params={{ slug: blog.slug }} className="relative aspect-[16/9] overflow-hidden">
                    {blog.thumbnail_url ? (
                      <img
                        src={blog.thumbnail_url}
                        alt={blog.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="font-display text-4xl font-bold text-muted-foreground/30">CS</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 text-xs text-muted-foreground">
                      {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <Link to={`/blogs/$slug`} params={{ slug: blog.slug }} className="mb-4 text-xl font-bold transition-colors group-hover:text-primary">
                      {blog.title}
                    </Link>
                    <div className="mt-auto">
                      <Link
                        to={`/blogs/$slug`}
                        params={{ slug: blog.slug }}
                        className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-primary hover:underline"
                      >
                        Read More &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
