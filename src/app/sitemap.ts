import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { cleanSlug } from '@/lib/slug';

const BASE_URL = 'https://citysteelbd.com';

// Without this the sitemap is prerendered once at build time, so content the
// client publishes through the admin panel never reaches search engines until
// the next deploy. One hour keeps it fresh without hammering Supabase.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/career`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ];

  // Dynamic: Projects
  const { data: projects } = await supabase.from('projects').select('slug, created_at');
  const projectPages: MetadataRoute.Sitemap = (projects || []).map((p) => ({
    url: `${BASE_URL}/project/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic: Products (individual items)
  const { data: products } = await supabase.from('products').select('slug, created_at');
  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic: Product Categories
  const { data: categories } = await supabase.from('product_categories').select('slug, created_at');
  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${BASE_URL}/products/${c.slug}`,
    lastModified: new Date(c.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Dynamic: Services
  const { data: services } = await supabase.from('services').select('slug, created_at');
  const servicePages: MetadataRoute.Sitemap = (services || []).map((s) => ({
    url: `${BASE_URL}/service/${s.slug}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic: Blogs (published only)
  const { data: blogs } = await supabase.from('blogs').select('slug, created_at').eq('is_published', true);
  const blogPages: MetadataRoute.Sitemap = (blogs || []).map((b) => ({
    url: `${BASE_URL}/blogs/${cleanSlug(b.slug)}`,
    lastModified: new Date(b.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...productPages, ...categoryPages, ...servicePages, ...blogPages];
}
