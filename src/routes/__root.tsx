import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "City Steel Corporation | Premium Industrial Steel Structures" },
      { name: "description", content: "City Steel Corporation delivers premium pre-engineered steel buildings, trusses, and industrial structures across Bangladesh." },
      { name: "author", content: "City Steel BD" },
      { property: "og:title", content: "City Steel Corporation" },
      { property: "og:description", content: "Premium industrial steel structures in Bangladesh." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://citysteelbd.com" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  loader: async () => {
    const [productsRes, servicesRes] = await Promise.all([
      supabase.from('products').select('title, slug').order('created_at', { ascending: false }),
      supabase.from('services').select('title, slug').order('created_at', { ascending: false })
    ]);
    return {
      productsMenu: productsRes.data || [],
      servicesMenu: servicesRes.data || []
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
