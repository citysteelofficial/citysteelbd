/**
 * Reusable loading skeleton components for route transitions.
 */

export function PageLoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="h-12 w-36 animate-pulse rounded bg-muted" />
          <div className="hidden gap-4 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>

      {/* Page header skeleton */}
      <div className="border-b border-border bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-4 h-3 w-24 animate-pulse rounded bg-primary/30" />
          <div className="h-12 w-80 animate-pulse rounded bg-muted/20 lg:h-16 lg:w-[28rem]" />
          <div className="mt-6 h-5 w-96 max-w-full animate-pulse rounded bg-muted/10" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailLoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <div className="h-12 w-36 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Detail skeleton */}
      <div className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-8 h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-3 w-20 animate-pulse rounded-full bg-primary/20" />
              <div className="h-10 w-72 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-8 h-40 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
