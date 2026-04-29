import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, Briefcase, Settings, FileText } from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Projects" icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} value="Manage Projects" link="/admin/projects" />
        <Card title="Products" icon={<Package className="h-4 w-4 text-muted-foreground" />} value="Manage Products" link="/admin/products" />
        <Card title="Services" icon={<Settings className="h-4 w-4 text-muted-foreground" />} value="Manage Services" link="/admin/services" />
        <Card title="Blogs" icon={<FileText className="h-4 w-4 text-muted-foreground" />} value="Manage Blogs" link="/admin/blogs" />
      </div>
    </div>
  );
}

function Card({ title, icon, value, link }: { title: string, icon: React.ReactNode, value: string, link: string }) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold mb-4">{value}</div>
        <Link to={link} className="text-xs text-primary hover:underline">
          Go to {title} &rarr;
        </Link>
      </div>
    </div>
  );
}
