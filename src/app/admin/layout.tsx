
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Package, Briefcase, FileText, Settings, LogOut, MessageSquare, Wrench, Home, ChevronDown, LayoutTemplate, ListChecks, Info } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isHomeOpen, setIsHomeOpen] = useState(true);


  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && !isLoginPage) {
        router.push('/admin/login');
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {

      if (!session && !isLoginPage) {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // On login page, render ONLY the login form without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-primary">
            <span>City Steel Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-1">
            <Link href="/admin" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            
            {/* Home Dropdown */}
            <div>
              <button 
                onClick={() => setIsHomeOpen(!isHomeOpen)}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname.startsWith('/admin/home') ? 'bg-muted/50 text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4" /> Home Page
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isHomeOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isHomeOpen && (
                <div className="mt-1 ml-4 flex flex-col gap-1 border-l pl-2">
                  <Link href="/admin/home/hero" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/admin/home/hero' ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <LayoutTemplate className="h-4 w-4" /> Hero Section
                  </Link>
                  <Link href="/admin/home/what-we-do" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/admin/home/what-we-do' ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <ListChecks className="h-4 w-4" /> What We Do
                  </Link>
                </div>
              )}
            </div>

            <Link href="/admin/about" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin/about') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <Info className="h-4 w-4" /> About Page
            </Link>

            <Link href="/admin/projects" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin/projects') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <Briefcase className="h-4 w-4" /> Projects
            </Link>
            <Link href="/admin/products" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin/products') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <Package className="h-4 w-4" /> Products
            </Link>
            <Link href="/admin/services" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin/services') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <Wrench className="h-4 w-4" /> Services
            </Link>
            <Link href="/admin/blogs" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin/blogs') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <FileText className="h-4 w-4" /> Blogs
            </Link>
            <Link href="/admin/messages" className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/admin/messages') ? 'bg-muted text-primary font-semibold' : 'text-muted-foreground'}`}>
              <MessageSquare className="h-4 w-4" /> Messages
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-red-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col sm:pl-64">
        {children}
      </main>
    </div>
  );
}
