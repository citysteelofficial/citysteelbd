import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadMultipleImages } from '@/lib/upload';
import { ArrowLeft, Loader2, X, ImagePlus } from 'lucide-react';

export const Route = createFileRoute('/admin/services_/$id/edit')({
  loader: async ({ params }) => {
    const { data, error } = await supabase.from('services').select('*').eq('id', params.id).single();
    if (error || !data) throw new Error('Service not found');
    return { service: data };
  },
  component: EditService,
});

function EditService() {
  const { service } = Route.useLoaderData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(service.images || (service.image_url ? [service.image_url] : []));
  const [formData, setFormData] = useState({
    title: service.title, slug: service.slug, category: service.category || 'complete-solution',
    description: service.description || '', content: service.content || '',
    seo_title: service.seo_title || '', seo_description: service.seo_description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewFiles(prev => [...prev, ...files]);
    files.forEach(f => { const r = new FileReader(); r.onload = ev => setNewPreviews(prev => [...prev, ev.target?.result as string]); r.readAsDataURL(f); });
    e.target.value = '';
  };

  const removeExisting = (i: number) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  const removeNew = (i: number) => { setNewFiles(prev => prev.filter((_, idx) => idx !== i)); setNewPreviews(prev => prev.filter((_, idx) => idx !== i)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) uploadedUrls = await uploadMultipleImages(newFiles);
      const allImages = [...existingImages, ...uploadedUrls];
      const image_url = allImages[0] || '';
      const { error } = await supabase.from('services').update({ ...formData, image_url, images: allImages }).eq('id', service.id);
      if (error) throw error;
      navigate({ to: '/admin/services' });
    } catch (error: any) { alert(`Error: ${error.message}`); setLoading(false); }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link to="/admin/services" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit Service</h2>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium">Service Name *</label><input required name="title" value={formData.title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">URL Slug *</label><input required name="slug" value={formData.slug} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="complete-solution">Complete solution to the Steel structure</option>
                <option value="product-supply">Steel building product Supply</option>
                <option value="interior-solution">Interior Solution</option>
                <option value="architectural-design">Architectural Design</option>
                <option value="product-import">STELL BUILDING PRODUCT IMPORT</option>
                <option value="structural-design">Structural design & Drawing</option>
                <option value="civil-construction">Civil Construction</option>
              </select>
            </div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Detailed Content</label><textarea name="content" value={formData.content} onChange={handleChange} className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Images</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((src, i) => (<div key={`e-${i}`} className="relative group h-24 w-24 rounded-lg overflow-hidden border border-input"><img src={src} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removeExisting(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>{i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">Main</span>}</div>))}
              {newPreviews.map((src, i) => (<div key={`n-${i}`} className="relative group h-24 w-24 rounded-lg overflow-hidden border-2 border-green-500/50"><img src={src} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removeNew(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button><span className="absolute bottom-0 left-0 right-0 bg-green-600/80 text-white text-[10px] text-center py-0.5">New</span></div>))}
              <label className="h-24 w-24 rounded-lg border-2 border-dashed border-input hover:border-primary cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors"><ImagePlus className="h-6 w-6 mb-1" /><span className="text-xs">Add</span><input type="file" accept="image/*" multiple onChange={handleFilesSelected} className="hidden" /></label>
            </div>
          </div>
          <div className="border-t pt-6"><h3 className="text-lg font-medium mb-4">SEO</h3><div className="grid gap-6 md:grid-cols-2"><div className="space-y-2"><label className="text-sm font-medium">SEO Title</label><input name="seo_title" value={formData.seo_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div><div className="space-y-2"><label className="text-sm font-medium">SEO Description</label><input name="seo_description" value={formData.seo_description} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div></div></div>
          <div className="flex justify-end pt-4"><button type="submit" disabled={loading} className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{loading ? 'Saving...' : 'Update Service'}</button></div>
        </form>
      </div>
    </div>
  );
}
