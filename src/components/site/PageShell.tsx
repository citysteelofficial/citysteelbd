import { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-dark text-[oklch(0.98_0_0)]">
      <div className="absolute inset-0 bg-radial-red opacity-70" />
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-primary" />
      <div className="absolute bottom-0 left-0 right-0 h-1 stripe-pattern opacity-80" />
      <div className="container-x relative py-12 lg:py-16">
        {eyebrow && (
          <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl font-bold leading-none lg:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[oklch(0.8_0_0)]">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
