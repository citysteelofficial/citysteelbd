import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadMultipleImages } from '@/lib/upload';
import { ArrowLeft, Loader2, X, ImagePlus } from 'lucide-react';

export const Route = createFileRoute('/admin/projects_/new')({ component: NewProject });

function NewProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({ title: '', slug: '', status: 'COMPLETED', location: '', description: '', content: '', seo_title: '', seo_description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, ...(name === 'title' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }) }));
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(f => { const r = new FileReader(); r.onload = ev => setPreviews(prev => [...prev, ev.target?.result as string]); r.readAsDataURL(f); });
    e.target.value = '';
  };

  const removeImage = (i: number) => { setImageFiles(prev => prev.filter((_, idx) => idx !== i)); setPreviews(prev => prev.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let image_url = ''; let images: string[] = [];
      if (imageFiles.length > 0) { const urls = await uploadMultipleImages(imageFiles); if (urls.length) { image_url = urls[0]; images = urls; } }
      const { error } = await supabase.from('projects').insert([{ ...formData, image_url, images }]);
      if (error) throw error;
      navigate({ to: '/admin/projects' });
    } catch (error: any) { alert(`Error: ${error.message}`); setLoading(false); }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link to="/admin/projects" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
        <h2 className="text-3xl font-bold tracking-tight">Add New Project</h2>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium">Project Title *</label><input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">URL Slug *</label><input required name="slug" value={formData.slug} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Status *</label>
              <select required name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="COMPLETED">Completed Project</option>
                <option value="ONGOING">Ongoing Project</option>
              </select>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">Location</label><input name="location" value={formData.location} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Short Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Detailed Content</label><textarea name="content" value={formData.content} onChange={handleChange} className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Project Images (Multiple)</label>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (<div key={i} className="relative group h-24 w-24 rounded-lg overflow-hidden border border-input"><img src={src} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>{i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">Main</span>}</div>))}
              <label className="h-24 w-24 rounded-lg border-2 border-dashed border-input hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors"><ImagePlus className="h-6 w-6 mb-1" /><span className="text-xs">Add</span><input type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" /></label>
            </div>
            <p className="text-xs text-muted-foreground">First image = main thumbnail.</p>
          </div>
          <div className="border-t pt-6"><h3 className="text-lg font-medium mb-4">SEO Metadata</h3><div className="grid gap-6 md:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">SEO Title</label><input name="seo_title" value={formData.seo_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div><div className="space-y-2"><label className="text-sm font-medium">SEO Description</label><input name="seo_description" value={formData.seo_description} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div></div></div>
          <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{loading ? 'Uploading...' : 'Save Project'}</button></div>
        </form>
      </div>
    </div>
  );
}
