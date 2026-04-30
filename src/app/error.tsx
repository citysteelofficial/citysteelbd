"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';
import { PageShell } from '@/components/site/PageShell';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <PageShell>
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center py-20">
        <AlertOctagon className="h-20 w-20 text-primary mb-6" />
        <h1 className="font-display text-5xl font-black text-foreground lg:text-6xl">
          Something went <span className="text-primary">wrong!</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-lg mx-auto">
          We apologize for the inconvenience. An unexpected error has occurred on our end.
        </p>
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => reset()}
            className="inline-flex bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red hover:scale-105 transition-all"
          >
            Try again
          </button>
          <Link 
            href="/" 
            className="inline-flex border-2 border-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
