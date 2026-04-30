/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Blog & Insights — City Steel Corporation",
  description: "Read the latest news, insights, and updates from the steel construction industry.",
};

export default async function BlogsPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const allBlogs = blogs || [];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Insights & News"
        title="Our Blog"
        description="Stay updated with the latest trends, technologies, and stories from the industrial steel structure sector."
      />

      <section className="py-24">
        <div className="container-x">
          {allBlogs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No blog posts available at the moment. Check back soon!
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allBlogs.map((blog: any) => (
                <div key={blog.id} className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-soft transition-all hover:shadow-elegant">
                  <Link href={`/blogs/${blog.slug}`} className="relative aspect-[16/9] overflow-hidden">
                    {blog.thumbnail_url ? (
                      <Image
                        src={blog.thumbnail_url}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <Link href={`/blogs/${blog.slug}`} className="mb-4 text-xl font-bold transition-colors group-hover:text-primary">
                      {blog.title}
                    </Link>
                    <div className="mt-auto">
                      <Link
                        href={`/blogs/${blog.slug}`}
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
