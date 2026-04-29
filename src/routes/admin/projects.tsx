import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/supabase';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/admin/projects')({
  component: AdminProjects,
});

function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    } else {
      alert('Error deleting project');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <Link 
          to="/admin/projects/new" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      
      <div className="rounded-md border bg-card">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center">No projects found.</td></tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="h-12 w-16 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-16 bg-muted rounded flex items-center justify-center text-xs">No img</div>
                      )}
                    </td>
                    <td className="p-4 align-middle font-medium">{project.title}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${project.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{project.location || '-'}</td>
                    <td className="p-4 align-middle text-right space-x-1">
                      <button onClick={() => navigate({ to: '/admin/projects/$id/edit', params: { id: project.id } })} className="inline-flex items-center justify-center rounded-md text-sm transition-colors hover:bg-muted h-9 w-9">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-destructive/10 hover:text-destructive h-9 w-9">
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
