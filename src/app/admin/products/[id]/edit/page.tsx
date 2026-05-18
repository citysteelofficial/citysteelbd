/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadMultipleImages } from '@/lib/upload';
import { ArrowLeft, Loader2, X, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', slug: '', category: '',
    description: '', content: '',
    seo_title: '', seo_description: '',
  });

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch categories
      let loadedCats: any[] = [];
      try {
        const { data: catData, error: catError } = await supabase
          .from('product_categories')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (!catError && catData && catData.length > 0) {
          loadedCats = catData;
        } else {
          loadedCats = [
            { title: 'STEEL COLUMN', slug: 'steel-column' },
            { title: 'STEEL BEAM', slug: 'steel-beam' },
            { title: 'PURLIN', slug: 'purlin' },
            { title: 'SLIDING DOOR', slug: 'sliding-door' },
            { title: 'ROOF MONITOR', slug: 'roof-monitor' },
            { title: 'MS PLATE', slug: 'ms-plate' },
            { title: 'INDUSTRIAL DECK SHEET', slug: 'industrial-deck-sheet' },
            { title: 'INDUSTRIAL ROOF SHEET', slug: 'industrial-roof-sheet' },
            { title: 'Self-Drilling Screw', slug: 'self-drilling-screw' },
            { title: 'RAFTER', slug: 'rafter' }
          ];
        }
      } catch (err) {
        console.error(err);
      }
      setCategories(loadedCats);

      // 2. Fetch product
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error || !data) {
        alert('Product not found');
        router.push('/admin/products');
        return;
      }

      setExistingImages(data.images || (data.image_url ? [data.image_url] : []));
      setFormData({
        title: data.title,
        slug: data.slug,
        category: data.category || (loadedCats[0]?.slug || ''),
        description: data.description || '',
        content: data.content || '',
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
      });
      setLoading(false);
    };

    loadData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles(prev => [...prev, ...files]);
    files.forEach(f => { 
      const r = new FileReader(); 
      r.onload = ev => setNewPreviews(prev => [...prev, ev.target?.result as string]); 
      r.readAsDataURL(f); 
    });
    e.target.value = '';
  };

  const removeExisting = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  const removeNew = (i: number) => { 
    setNewFiles(prev => prev.filter((_, idx) => idx !== i)); 
    setNewPreviews(prev => prev.filter((_, idx) => idx !== i)); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try {
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) uploadedUrls = await uploadMultipleImages(newFiles);
      const allImages = [...existingImages, ...uploadedUrls];
      const image_url = allImages[0] || '';
      
      const { error } = await supabase.from('products').update({ 
        ...formData, 
        image_url, 
        images: allImages 
      }).eq('id', id);
      
      if (error) throw error;
      router.push('/admin/products');
    } catch (error: any) { 
      alert(`Error: ${error.message}`); 
      setSaving(false); 
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/products" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Detailed Content</label>
            <RichTextEditor value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} placeholder="Write detailed content here..." />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Images</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((src, i) => (
                <div key={`e-${i}`} className="relative group h-24 w-24 rounded-lg overflow-hidden border border-input">
                  <Image src={src} alt="" fill className="object-cover" />
                  <button type="button" onClick={() => removeExisting(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5 z-10">Main</span>}
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`n-${i}`} className="relative group h-24 w-24 rounded-lg overflow-hidden border-2 border-green-500/50">
                  <Image src={src} alt="" fill className="object-cover" />
                  <button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <X className="h-3 w-3" />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-[10px] text-center py-0.5 z-10">New</span>
                </div>
              ))}
              <label className="h-24 w-24 rounded-lg border-2 border-dashed border-input hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <ImagePlus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" />
              </label>
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">SEO Metadata</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Title</label>
                <input name="seo_title" value={formData.seo_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Description</label>
                <input name="seo_description" value={formData.seo_description} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
