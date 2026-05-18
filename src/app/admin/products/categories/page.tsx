"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);

    const slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      const { data, error } = await supabase
        .from('product_categories')
        .insert([{ title: newTitle.trim(), slug }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setCategories(prev => [...prev, data]);
        setNewTitle('');
      }
    } catch (err: any) {
      alert(`Error adding category: ${err.message || 'Slug already exists'}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number, slug: string) => {
    try {
      // Check if products exist in this category (optional check, but good for user safety)
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', slug);

      if (!countError && count && count > 0) {
        const confirmForce = confirm(`Warning: There are ${count} products linked to this category. Deleting this category will leave those products under an inactive category. Are you sure you want to proceed?`);
        if (!confirmForce) {
          setConfirmDeleteId(null);
          return;
        }
      }

      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(`Error deleting category: ${err.message}`);
      console.error(err);
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
      <div className="flex items-center space-x-2">
        <Link href="/admin/products" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Manage Product Categories</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add New Category */}
        <div className="lg:col-span-1 rounded-xl border bg-card p-6 shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Heavy Frame Structures"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {saving ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Active Categories</h3>
            <p className="text-sm text-muted-foreground">Manage your list of dynamic product categories</p>
          </div>
          
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="h-10 px-6 text-left font-medium text-muted-foreground">Category Name</th>
                  <th className="h-10 px-6 text-left font-medium text-muted-foreground">URL Slug</th>
                  <th className="h-10 px-6 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-muted-foreground">
                      No categories found. Add one to get started!
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{c.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{c.slug}</td>
                      <td className="px-6 py-4 text-right">
                        {confirmDeleteId === c.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                              <AlertCircle className="h-3.5 w-3.5" /> Delete?
                            </span>
                            <button
                              onClick={() => handleDeleteCategory(c.id, c.slug)}
                              className="text-xs bg-red-600 text-white px-2.5 py-1.5 rounded hover:bg-red-700 font-semibold shadow-sm"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs bg-muted text-foreground border border-input px-2.5 py-1.5 rounded hover:bg-accent font-semibold"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(c.id)}
                            className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
