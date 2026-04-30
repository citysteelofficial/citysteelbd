/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/upload';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

export default function NewBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    is_published: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val,
      ...(name === 'title' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let thumbnail_url = '';
      if (imageFile) {
        const url = await uploadImage(imageFile, 'blog-images');
        if (url) thumbnail_url = url;
      }
      
      const { error } = await supabase.from('blogs').insert([
        { ...formData, thumbnail_url }
      ]);
      
      if (error) throw error;
      router.push('/admin/blogs');
    } catch (error: any) {
      alert(`Error saving blog: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/blogs" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Add New Blog Post</h2>
      </div>

      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Blog Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Blog Content (HTML) *</label>
            <RichTextEditor value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} placeholder="Write your blog post here..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Thumbnail Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="is_published" name="is_published" checked={formData.is_published} onChange={handleChange} className="h-4 w-4 rounded border-input" />
            <label htmlFor="is_published" className="text-sm font-medium leading-none">Publish immediately</label>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">SEO Metadata</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">SEO Title</label>
                <input name="seo_title" value={formData.seo_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">SEO Description</label>
                <input name="seo_description" value={formData.seo_description} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none">SEO Keywords (comma separated)</label>
                <input name="seo_keywords" value={formData.seo_keywords} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="steel, construction, building" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
