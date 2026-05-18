"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Target, Eye, Award, Users, CheckCircle, Shield, Briefcase } from 'lucide-react';

const ICONS: Record<string, any> = {
  Target, Eye, Award, Users, CheckCircle, Shield, Briefcase
};

export default function AdminAboutSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    about_header_eyebrow: 'About Us',
    about_header_title: 'Get to Know Us',
    about_header_description: 'A leading provider of industrial steel structures with unrivaled expertise, comprehensive services, and a commitment to innovation.',
    about_story_title: 'Committed to only',
    about_story_highlight: 'High Quality Service',
    about_story_p1: 'City Steel Corporation stands out as a leading provider of steel structures...',
    about_story_p2: 'With a track record of successful projects across various industries...',
  });
  
  const [features, setFeatures] = useState<any[]>([]);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setSettings({
        about_header_eyebrow: data.about_header_eyebrow || 'About Us',
        about_header_title: data.about_header_title || 'Get to Know Us',
        about_header_description: data.about_header_description || '...',
        about_story_title: data.about_story_title || 'Committed to only',
        about_story_highlight: data.about_story_highlight || 'High Quality Service',
        about_story_p1: data.about_story_p1 || '',
        about_story_p2: data.about_story_p2 || '',
      });
      if (data.about_features) {
        setFeatures(data.about_features);
      } else {
        setFeatures([
          {"icon": "Target", "title": "Mission", "description": "Deliver world-class steel structures with uncompromising quality."},
          {"icon": "Eye", "title": "Vision", "description": "To be the most trusted name in industrial steel construction."},
          {"icon": "Award", "title": "Quality", "description": "Building quality standards that exceed expectations."},
          {"icon": "Users", "title": "Clients", "description": "200+ satisfied clients across diverse industries."}
        ]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newItems = [...features];
    newItems[index] = { ...newItems[index], [field]: value };
    setFeatures(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          ...settings,
          about_features: features
        })
        .eq('id', 1);
        
      if (error) throw error;
      alert('About settings saved successfully!');
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
        <h2 className="text-3xl font-bold tracking-tight">About Page Settings</h2>
      </div>
      
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Header Section</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Eyebrow (Small Text)</label>
                <input required name="about_header_eyebrow" value={settings.about_header_eyebrow} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input required name="about_header_title" value={settings.about_header_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required name="about_header_description" value={settings.about_header_description} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2">Our Story Section</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title Line 1</label>
                <input required name="about_story_title" value={settings.about_story_title} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title Highlight (Red Text)</label>
                <input required name="about_story_highlight" value={settings.about_story_highlight} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paragraph 1</label>
                <textarea required name="about_story_p1" value={settings.about_story_p1} onChange={handleChange} className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Paragraph 2</label>
                <textarea required name="about_story_p2" value={settings.about_story_p2} onChange={handleChange} className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold border-b pb-2">Features Block (Bottom)</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((item, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-bold">Item {index + 1}</div>
                    {ICONS[item.icon] && React.createElement(ICONS[item.icon], { className: "h-4 w-4 text-primary" })}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Icon</label>
                    <select 
                      value={item.icon} 
                      onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.keys(ICONS).map(iconName => (
                        <option key={iconName} value={iconName}>{iconName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <input value={item.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <textarea value={item.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
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
