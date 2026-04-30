/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setBlogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (!error) {
        setBlogs(blogs.filter(b => b.id !== id));
        setConfirmDeleteId(null);
      } else {
        console.error('Delete error:', error);
        alert(`Error deleting blog: ${error.message || JSON.stringify(error)}`);
      }
    } catch (err: any) {
      console.error('Delete exception:', err);
      alert(`Exception deleting blog: ${err.message}`);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('blogs').update({ is_published: !currentStatus }).eq('id', id);
    if (!error) {
      setBlogs(blogs.map(b => b.id === id ? { ...b, is_published: !currentStatus } : b));
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
        <Link 
          href="/admin/blogs/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Post
        </Link>
      </div>
      
      <div className="rounded-md border bg-card">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Thumbnail</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Title</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center">No blogs found.</td></tr>
              ) : (
                blogs.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      {item.thumbnail_url ? (
                        <div className="relative h-12 w-16 overflow-hidden rounded">
                          <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-16 bg-muted rounded flex items-center justify-center text-xs">No img</div>
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">{item.title}</td>
                    <td className="p-4 align-middle">
                      <button 
                        onClick={() => togglePublish(item.id, item.is_published)}
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer ${item.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {item.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link href={`/admin/blogs/${item.id}/edit`} className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-muted h-9 w-9">
                          <Edit className="h-4 w-4" />
                        </Link>
                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-1 ml-2">
                            <button onClick={() => handleDelete(item.id)} className="text-xs bg-red-600 text-white px-2 py-1.5 rounded hover:bg-red-700 font-medium">Confirm</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-xs bg-gray-200 text-gray-800 px-2 py-1.5 rounded hover:bg-gray-300 font-medium">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(item.id)} className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-destructive/10 hover:text-destructive h-9 w-9">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
