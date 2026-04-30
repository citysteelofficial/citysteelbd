/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadMultipleImages } from '@/lib/upload';
import { ArrowLeft, Loader2, X, ImagePlus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'steel-column',
    description: '',
    content: '',
    seo_title: '',
    seo_description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
    }));
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let image_url = '';
      let images: string[] = [];
      
      if (imageFiles.length > 0) {
        const urls = await uploadMultipleImages(imageFiles, 'project-images');
        if (urls.length > 0) {
          image_url = urls[0];
          images = urls;
        }
      }
      
      const { error } = await supabase.from('products').insert([
        { ...formData, image_url, images }
      ]);
      
      if (error) throw error;
      router.push('/admin/products');
    } catch (error: any) {
      alert(`Error saving product: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/products" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Product Name *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">URL Slug *</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Product Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="steel-column">STEEL COLOUM</option>
                <option value="steel-beam">STEELL BEAM</option>
                <option value="purlin">PURLIN</option>
                <option value="sliding-door">SLIDING DOOR</option>
                <option value="roof-monitor">ROOF MONITOR</option>
                <option value="ms-plate">MS PlATE</option>
                <option value="industrial-deck-sheet">INDUSTRIAL DECK SHEET</option>
                <option value="industrial-roof-sheet">INDUSTRIAL ROOF SHEET</option>
                <option value="self-drilling-screw">Self-Drilling Screw</option>
                <option value="rafter">RAFTER</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Short Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Detailed Content (HTML/Text)</label>
            <RichTextEditor value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} placeholder="Write detailed content here..." />
          </div>

          {/* Multi-Image Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium leading-none">Product Images (Multiple)</label>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative group h-24 w-24 rounded-lg overflow-hidden border border-input">
                  <Image src={src} alt={`Preview ${i+1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5 z-10">Main</span>
                  )}
                </div>
              ))}
              <label className="h-24 w-24 rounded-lg border-2 border-dashed border-input hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <ImagePlus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">First image will be used as the main thumbnail. You can add multiple images.</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">SEO Metadata</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">SEO Title</label>
                <input name="seo_title" value={formData.seo_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Title for search engines" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">SEO Description</label>
                <input name="seo_description" value={formData.seo_description} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Meta description" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Uploading...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
