"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Factory, Building2, HardHat, Wrench, Shield, Cog, CheckCircle, Home, Truck, Users } from 'lucide-react';

const ICONS: Record<string, any> = {
  Factory, Building2, HardHat, Wrench, Shield, Cog, CheckCircle, Home, Truck, Users
};

export default function AdminWhatWeDoSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('what_we_do')
      .eq('id', 1)
      .single();
    
    if (!error && data?.what_we_do) {
      setItems(data.what_we_do);
    } else {
      // Default fallback
      setItems([
        {"icon": "Factory", "title": "Pre-Engineered Buildings", "description": "Custom-designed PEB structures for any industrial use case."},
        {"icon": "Building2", "title": "Steel Structure Fabrication", "description": "Heavy-duty trusses, frames, and skeletons built to spec."},
        {"icon": "HardHat", "title": "Erection & Installation", "description": "Expert on-site crews delivering safe, on-time installs."},
        {"icon": "Wrench", "title": "Design & Build Package", "description": "End-to-end services from blueprint to handover."},
        {"icon": "Shield", "title": "Quality Standards", "description": "Building quality standards that meet international norms."},
        {"icon": "Cog", "title": "Roofing & Cladding", "description": "Premium sheets, purlins, and accessories for any roof."}
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ what_we_do: items })
        .eq('id', 1);
        
      if (error) throw error;
      alert('What We Do settings saved successfully!');
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
        <h2 className="text-3xl font-bold tracking-tight">What We Do (Services on Home Page)</h2>
      </div>
      
      <div className="rounded-xl border bg-card shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div key={index} className="space-y-4 p-5 border rounded-lg bg-muted/10 transition-colors hover:bg-muted/30">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-bold">Item {index + 1}</div>
                  {ICONS[item.icon] && React.createElement(ICONS[item.icon], { className: "h-5 w-5 text-primary" })}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon</label>
                  <select 
                    value={item.icon} 
                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.keys(ICONS).map(iconName => (
                      <option key={iconName} value={iconName}>{iconName}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input 
                    required 
                    value={item.title} 
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    required 
                    value={item.description} 
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                </div>
              </div>
            ))}
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
