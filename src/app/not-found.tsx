import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { PageShell } from '@/components/site/PageShell';

export default function NotFound() {
  return (
    <PageShell>
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
        <ShieldAlert className="h-20 w-20 text-primary mb-6" />
        <h1 className="font-display text-5xl font-black text-foreground lg:text-7xl">
          404 <span className="text-primary">Error</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="mt-8 inline-flex bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red hover:scale-105 transition-all"
        >
          Return Home
        </Link>
      </div>
    </PageShell>
  );
}
