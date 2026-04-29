import { createFileRoute, Outlet, redirect, Link, useLocation } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Package, Briefcase, FileText, Settings, LogOut, FileImage, MessageSquare } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    // If we're going to the login page, don't check auth to prevent infinite loop
    if (location.pathname === '/admin/login') return;

    // Try to get session - use getSession for cached, refresh if needed
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Double check with getUser (more reliable on client-side nav)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw redirect({
          to: '/admin/login',
        });
      }
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  // On login page, render ONLY the login form without sidebar
  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <span>City Steel Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            <Link to="/admin" activeProps={{ className: "bg-muted" }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link to="/admin/projects" activeProps={{ className: "bg-muted" }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Briefcase className="h-4 w-4" /> Projects
            </Link>
            <Link to="/admin/products" activeProps={{ className: "bg-muted" }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Package className="h-4 w-4" /> Products
            </Link>
            <Link to="/admin/services" activeProps={{ className: "bg-muted" }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <Settings className="h-4 w-4" /> Services
            </Link>
            <Link to="/admin/blogs" activeProps={{ className: "bg-muted" }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <FileText className="h-4 w-4" /> Blogs
            </Link>
            <Link to="/admin/messages" activeProps={{ className: "bg-muted" }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <MessageSquare className="h-4 w-4" /> Messages
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-red-600">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col sm:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
