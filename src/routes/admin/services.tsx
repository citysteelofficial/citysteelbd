import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

export const Route = createFileRoute('/admin/services')({
  component: AdminServices,
});

function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setServices(data as Service[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      setServices(services.filter(s => s.id !== id));
    } else {
      alert('Error deleting service');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <Link 
          to="/admin/services/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      
      <div className="rounded-md border bg-card">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Image</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Title</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Category</th>
                <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center">No services found.</td></tr>
              ) : (
                services.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-16 bg-muted rounded flex items-center justify-center text-xs">No img</div>
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">{item.title}</td>
                    <td className="p-4 align-middle text-muted-foreground">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right space-x-1">
                      <button onClick={() => navigate({ to: '/admin/services/$id/edit', params: { id: item.id } })} className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-muted h-9 w-9">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-destructive/10 hover:text-destructive h-9 w-9">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
