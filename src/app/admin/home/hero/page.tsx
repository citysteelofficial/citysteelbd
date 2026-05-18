"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save } from 'lucide-react';

export default function AdminHeroSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hero_top_text: 'City Steel Corporation · Est. 2009',
    hero_title: 'Building The',
    hero_highlight: 'Backbone',
    hero_subtitle: 'of Modern Industry',
    hero_description: 'From pre-engineered buildings to heavy industrial frameworks — we design, fabricate, and erect world-class steel structures with uncompromising quality across Bangladesh.',
    projects_count: '500+',
    projects_label: 'Projects',
    years_count: '15+',
    years_label: 'Years',
    clients_count: '200+',
    clients_label: 'Clients',
    certification_count: 'ISO',
    certification_label: 'Certified',
  });

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSettings();
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', 1);
        
      if (error) throw error;
      alert('Hero settings saved successfully!');
    } catch (err: any) {
      alert(`Error saving settings: ${err.message || 'Check if site_settings table exists'}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hero Section</h2>
      </div>
      
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Main Text</h3>
            
            <div className="space-y-2 pb-2">
              <label className="text-sm font-medium">Giant Brand Title & Sub-tag (Format: Title · Subtag)</label>
              <input 
                required 
                name="hero_top_text" 
                value={settings.hero_top_text} 
                onChange={handleChange} 
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Top Tagline: Prefix Text</label>
                <input 
                  required 
                  name="hero_title" 
                  value={settings.hero_title} 
                  onChange={handleChange} 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Top Tagline: Highlight Word (Red)</label>
                <input 
                  required 
                  name="hero_highlight" 
                  value={settings.hero_highlight} 
                  onChange={handleChange} 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Top Tagline: Suffix Text</label>
                <input 
                  required 
                  name="hero_subtitle" 
                  value={settings.hero_subtitle} 
                  onChange={handleChange} 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Hero Description</label>
              <textarea 
                required 
                name="hero_description" 
                value={settings.hero_description} 
                onChange={handleChange} 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold border-b pb-2">Statistics Block</h3>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="font-semibold">Statistic 1</div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Number/Text</label>
                  <input name="projects_count" value={settings.projects_count} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Label</label>
                  <input name="projects_label" value={settings.projects_label} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="font-semibold">Statistic 2</div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Number/Text</label>
                  <input name="years_count" value={settings.years_count} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Label</label>
                  <input name="years_label" value={settings.years_label} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="font-semibold">Statistic 3</div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Number/Text</label>
                  <input name="clients_count" value={settings.clients_count} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Label</label>
                  <input name="clients_label" value={settings.clients_label} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="font-semibold">Statistic 4</div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Number/Text</label>
                  <input name="certification_count" value={settings.certification_count} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Label</label>
                  <input name="certification_label" value={settings.certification_label} onChange={handleChange} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving} 
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
