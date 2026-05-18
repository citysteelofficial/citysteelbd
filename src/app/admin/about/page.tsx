"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { 
  Loader2, 
  Save, 
  Target, 
  Eye, 
  Award, 
  Users, 
  CheckCircle, 
  Shield, 
  Briefcase,
  Clock,
  Cpu,
  Layers,
  Hammer,
  Maximize2,
  Expand,
  Sun,
  Coins
} from 'lucide-react';

const ICONS: Record<string, any> = {
  Target, Eye, Award, Users, CheckCircle, Shield, Briefcase,
  Clock, Cpu, Layers, Hammer, Maximize2, Expand, Sun, Coins
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
    about_story_p1: '',
    about_story_p2: '',
    about_specialties: 'Industrial Buildings, Warehouses, Commercial Projects, Residential Structures, Agro-Based Facilities, Exhibition Centers',
    about_quote_text: 'Stepping forward to be the most VIRAL NAME in excellent quality with reasonable price in the Country.',
    about_quote_subtext: 'To make our dream come true, we serve you with the best attitude and commitment. Let us be your friend and your consultant—even if you ultimately don\'t choose us.',
  });
  
  const [features, setFeatures] = useState<any[]>([]);
  const [advantages, setAdvantages] = useState<any[]>([]);

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
        about_header_description: data.about_header_description || '',
        about_story_title: data.about_story_title || 'Committed to only',
        about_story_highlight: data.about_story_highlight || 'High Quality Service',
        about_story_p1: data.about_story_p1 || '',
        about_story_p2: data.about_story_p2 || '',
        about_specialties: data.about_specialties || 'Industrial Buildings, Warehouses, Commercial Projects, Residential Structures, Agro-Based Facilities, Exhibition Centers',
        about_quote_text: data.about_quote_text || 'Stepping forward to be the most VIRAL NAME in excellent quality with reasonable price in the Country.',
        about_quote_subtext: data.about_quote_subtext || 'To make our dream come true, we serve you with the best attitude and commitment. Let us be your friend and your consultant—even if you ultimately don\'t choose us.',
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

      if (data.about_advantages) {
        setAdvantages(data.about_advantages);
      } else {
        setAdvantages([
          {
            icon: "Clock",
            title: "Reduce Construction Time",
            desc: "Due to the system approach, the use of high strength steel, optimized built-up sections, and continuous lightweight secondary steel, construction time is significantly reduced compared to conventional steel."
          },
          {
            icon: "Cpu",
            title: "Advanced Computerized Design",
            desc: "PEB systems are designed using specialized computer analysis and custom details. Lightweight flexible frames offer higher resistance to seismic forces, and design time is significantly reduced."
          },
          {
            icon: "Layers",
            title: "Lighter Foundations",
            desc: "Pre-engineered steel buildings are about 50% lighter than conventional steel structures. Hence, foundations are of simpler design, easier to construct, and lighter."
          },
          {
            icon: "Hammer",
            title: "LEGO-like Faster Erection",
            desc: "All fabricated components are standard, accurately sized, and numbered. The on-site assembly works just like LEGO blocks, ensuring a much faster and safer erection process."
          },
          {
            icon: "Maximize2",
            title: "Flexibility of Expansion",
            desc: "Buildings can be easily expanded in length by adding more bays. Expansion in width and height is also possible by pre-designing for future growth from the start."
          },
          {
            icon: "Expand",
            title: "Large Clear Spans",
            desc: "Our architectural engineering allows us to supply buildings up to 90 meters of clear span, ensuring massive column-free spaces for maximum industrial utility."
          },
          {
            icon: "Sun",
            title: "Energy Efficient Systems",
            desc: "Buildings can be supplied with high-density polyurethane insulated panels or premium fiberglass blanket insulation to achieve required energy-saving 'U' values."
          },
          {
            icon: "Coins",
            title: "Up to 30% Lower Cost",
            desc: "Significant savings in design, manufacturing, and erection. Secondary members and cladding nest together, reducing transportation. Elemental shapes follow stress diagrams to optimize steel weight."
          }
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

  const handleAdvantageChange = (index: number, field: string, value: string) => {
    const newAdv = [...advantages];
    newAdv[index] = { ...newAdv[index], [field]: value };
    setAdvantages(newAdv);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          ...settings,
          about_features: features,
          about_advantages: advantages
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
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">About Page Settings</h2>
        <p className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
          Note: If you add new columns, make sure to execute update_about_settings.sql in Supabase SQL editor.
        </p>
      </div>
      
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Header Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-primary">Header Section</h3>
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

          {/* Our Story & Identity */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-primary">Our Story & Identity</h3>
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
                <label className="text-sm font-medium">Paragraph 1 (Main Specialties)</label>
                <RichTextEditor 
                  value={settings.about_story_p1} 
                  onChange={(val) => setSettings(prev => ({ ...prev, about_story_p1: val }))} 
                  placeholder="Describe your specialties with rich formatting..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Paragraph 2 (Engineering & Software)</label>
                <RichTextEditor 
                  value={settings.about_story_p2} 
                  onChange={(val) => setSettings(prev => ({ ...prev, about_story_p2: val }))} 
                  placeholder="Describe your engineering team and specialized software..."
                />
              </div>
            </div>
          </div>

          {/* Specialty Badges */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-primary">Specialty Badges</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialties Tags (Comma-separated)</label>
              <input required name="about_specialties" value={settings.about_specialties} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-muted-foreground">Separate each specialty tag with a comma. Example: Industrial Buildings, Warehouses, Commercial Projects</p>
            </div>
          </div>

          {/* Quote Card */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-primary">Identity Highlight & Quote Card</h3>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Quote / Highlighted Text</label>
                <textarea required name="about_quote_text" value={settings.about_quote_text} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quote Footnote / Motivation Subtext</label>
                <textarea required name="about_quote_subtext" value={settings.about_quote_subtext} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
          </div>

          {/* Features Block (Mission & Vision) */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-primary">Features & Pillars Block (Mission, Vision, etc.)</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.slice(0, 4).map((item, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-bold">Item {index + 1} ({item.title})</div>
                    {ICONS[item.icon] && React.createElement(ICONS[item.icon], { className: "h-4 w-4 text-primary" })}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Icon</label>
                    <select 
                      value={item.icon} 
                      onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
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
                    <textarea value={item.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PEB Advantages Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 text-primary">PEB Advantages (8 Tech Cards)</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {advantages.map((item, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-muted/10">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="font-bold text-sm">Card {index + 1}: {item.title.split(' ').slice(0, 2).join(' ')}...</div>
                    {ICONS[item.icon] && React.createElement(ICONS[item.icon], { className: "h-4 w-4 text-primary" })}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Icon</label>
                    <select 
                      value={item.icon} 
                      onChange={(e) => handleAdvantageChange(index, 'icon', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card"
                    >
                      {Object.keys(ICONS).map(iconName => (
                        <option key={iconName} value={iconName}>{iconName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Card Title</label>
                    <input value={item.title} onChange={(e) => handleAdvantageChange(index, 'title', e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <textarea value={item.desc} onChange={(e) => handleAdvantageChange(index, 'desc', e.target.value)} className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button 
              type="submit" 
              disabled={saving} 
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
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
