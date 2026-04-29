import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const Route = createFileRoute('/admin/blogs_/$id/edit')({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', params.id).single();
    if (error || !data) throw new Error('Blog not found');
    return { blog: data };
  },
  component: EditBlog,
});

function EditBlog() {
  const { blog } = Route.useLoaderData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: blog.title, slug: blog.slug, content: blog.content,
    is_published: blog.is_published, seo_title: blog.seo_title || '',
    seo_description: blog.seo_description || '', seo_keywords: blog.seo_keywords || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let thumbnail_url = blog.thumbnail_url || '';
      if (imageFile) { const url = await uploadImage(imageFile, 'blog-images'); if (url) thumbnail_url = url; }
      const { error } = await supabase.from('blogs').update({ ...formData, thumbnail_url }).eq('id', blog.id);
      if (error) throw error;
      navigate({ to: '/admin/blogs' });
    } catch (error: any) { alert(`Error: ${error.message}`); setLoading(false); }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link to="/admin/blogs" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium">Blog Title *</label><input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">URL Slug *</label><input required name="slug" value={formData.slug} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Blog Content (HTML) *</label><textarea required name="content" value={formData.content} onChange={handleChange} className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Thumbnail Image</label>
            {blog.thumbnail_url && <img src={blog.thumbnail_url} alt="" className="h-20 w-28 rounded object-cover mb-2" />}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground" />
          </div>
          <div className="flex items-center space-x-2"><input type="checkbox" id="is_published" name="is_published" checked={formData.is_published} onChange={handleChange} className="h-4 w-4 rounded border-input" /><label htmlFor="is_published" className="text-sm font-medium">Published</label></div>
          <div className="border-t pt-6"><h3 className="text-lg font-medium mb-4">SEO</h3><div className="grid gap-6 md:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">SEO Title</label><input name="seo_title" value={formData.seo_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div><div className="space-y-2"><label className="text-sm font-medium">SEO Description</label><input name="seo_description" value={formData.seo_description} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div><div className="space-y-2 md:col-span-2"><label className="text-sm font-medium">SEO Keywords</label><input name="seo_keywords" value={formData.seo_keywords} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div></div></div>
          <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{loading ? 'Saving...' : 'Update Blog'}</button></div>
        </form>
      </div>
    </div>
  );
}
