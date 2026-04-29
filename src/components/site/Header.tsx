import { Link, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Route as rootRoute } from "@/routes/__root";
import logo from "@/assets/citysteel-logo.jpeg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { productsMenu, servicesMenu } = useLoaderData({ from: rootRoute.id });

  // Build sub-items for dropdown menus
  const getSubItems = (label: string): any[] => {
    if (label === "Products") {
      return [
        { title: "STEEL COLUMN", slug: "steel-column", isStatic: true },
        { title: "STEEL BEAM", slug: "steel-beam", isStatic: true },
        { title: "PURLIN", slug: "purlin", isStatic: true },
        { title: "SLIDING DOOR", slug: "sliding-door", isStatic: true },
        { title: "ROOF MONITOR", slug: "roof-monitor", isStatic: true },
        { title: "MS PLATE", slug: "ms-plate", isStatic: true },
        { title: "INDUSTRIAL DECK SHEET", slug: "industrial-deck-sheet", isStatic: true },
        { title: "INDUSTRIAL ROOF SHEET", slug: "industrial-roof-sheet", isStatic: true },
        { title: "Self-Drilling Screw", slug: "self-drilling-screw", isStatic: true },
        { title: "RAFTER", slug: "rafter", isStatic: true },
      ];
    } else if (label === "Services") {
      return servicesMenu.length > 0 ? servicesMenu : [
        { title: "Complete Solution to the Steel Structure", slug: "complete-solution" },
        { title: "Steel Building Product Supply", slug: "product-supply" },
        { title: "Interior Solution", slug: "interior-solution" },
        { title: "Architectural Design", slug: "architectural-design" },
        { title: "Steel Building Product Import", slug: "product-import" },
        { title: "Structural Design & Drawing", slug: "structural-design" },
        { title: "Civil Construction", slug: "civil-construction" },
      ];
    } else if (label === "Projects") {
      return [
        { title: "ONGOING PROJECT", slug: "ongoing", isStatic: true },
        { title: "COMPLETED PROJECT", slug: "completed", isStatic: true },
      ];
    }
    return [];
  };

  const isDropdown = (label: string) =>
    label === "Products" || label === "Services" || label === "Projects";

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-x flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center" aria-label="City Steel — Home">
          <img
            src={logo}
            alt="City Steel — Building the Future"
            width={860}
            height={420}
            className="h-12 w-auto transition-transform group-hover:scale-[1.03] sm:h-14"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => {
            if (isDropdown(n.label)) {
              const subItems = getSubItems(n.label);
              return (
                <div key={n.to} className="group relative">
                  <div className="relative flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
                    {n.label} <ChevronDown className="h-3 w-3" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full hidden w-64 flex-col border border-border bg-background shadow-elegant group-hover:flex">
                    {subItems.map((item: any) => {
                      if (n.label === "Projects") {
                        return (
                          <Link
                            key={item.slug || item.title}
                            to="/projects"
                            search={{ status: item.slug }}
                            className="px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {item.title}
                          </Link>
                        );
                      }

                      const linkTo = n.label === "Products"
                        ? `/products/${item.slug || 'demo'}`
                        : `/services/${item.slug || 'demo'}`;

                      return (
                        <Link
                          key={item.slug || item.title}
                          to={linkTo}
                          className="px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="relative px-4 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{
                  className:
                    "relative px-4 py-2 text-sm font-semibold uppercase tracking-wider text-foreground",
                }}
              >
                {n.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="ml-4 inline-flex items-center bg-gradient-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
          >
            Get Quote
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          className="lg:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <nav className="border-t border-border bg-surface lg:hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="container-x flex flex-col py-4">
            {nav.map((n) => {
              if (isDropdown(n.label)) {
                const subItems = getSubItems(n.label);
                const isExpanded = mobileExpanded === n.label;

                return (
                  <div key={n.to}>
                    {/* Parent item — toggles sub-menu */}
                    <button
                      onClick={() => toggleMobileExpanded(n.label)}
                      className="flex w-full items-center justify-between border-l-2 border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
                    >
                      {n.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Sub-items */}
                    {isExpanded && (
                      <div className="ml-4 flex flex-col border-l border-border">
                        {subItems.map((item: any) => {
                          if (n.label === "Projects") {
                            return (
                              <Link
                                key={item.slug || item.title}
                                to="/projects"
                                search={{ status: item.slug }}
                                onClick={() => setOpen(false)}
                                className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.title}
                              </Link>
                            );
                          }

                          const linkTo = n.label === "Products"
                            ? `/products/${item.slug || 'demo'}`
                            : `/services/${item.slug || 'demo'}`;

                          return (
                            <Link
                              key={item.slug || item.title}
                              to={linkTo}
                              onClick={() => setOpen(false)}
                              className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                            >
                              {item.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="border-l-2 border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-foreground"
                  activeProps={{
                    className:
                      "border-l-2 border-primary px-4 py-3 text-sm font-semibold uppercase tracking-wider text-foreground bg-secondary",
                  }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
