/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.svg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
] as const;

interface HeaderProps {
  productsMenu: any[];
  servicesMenu: any[];
}

export function Header({ productsMenu, servicesMenu }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

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

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container-x flex h-20 items-center justify-between">
        <Link href="/" className="group flex items-center" aria-label="City Steel — Home">
          <Image
            src={logo}
            alt="City Steel — Building the Future"
            width={180}
            height={60}
            className="h-12 w-auto transition-transform group-hover:scale-[1.03] sm:h-14"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => {
            if (isDropdown(n.label)) {
              const subItems = getSubItems(n.label);
              return (
                <div key={n.to} className="group relative">
                  <div className={`relative flex cursor-pointer items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-foreground ${isActive(n.to) ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {n.label} <ChevronDown className="h-3 w-3" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full hidden w-64 flex-col border border-border bg-background shadow-elegant group-hover:flex">
                    {subItems.map((item: any) => {
                      if (n.label === "Projects") {
                        return (
                          <Link
                            key={item.slug || item.title}
                            href={`/projects?status=${item.slug}`}
                            className="px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          >
                            {item.title}
                          </Link>
                        );
                      }

                      const linkHref = n.label === "Products"
                        ? `/products/${item.slug || 'demo'}`
                        : `/services/${item.slug || 'demo'}`;

                      return (
                        <Link
                          key={item.slug || item.title}
                          href={linkHref}
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
                href={n.to}
                className={`relative px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-foreground ${
                  isActive(n.to) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
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

      {/* Mobile Navigation Drawer Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <nav 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[80vw] bg-background shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto flex flex-col`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-6">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
            <Image
              src={logo}
              alt="City Steel Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col py-4 px-3">
          {nav.map((n) => {
            if (isDropdown(n.label)) {
              const subItems = getSubItems(n.label);
              const isExpanded = mobileExpanded === n.label;

              return (
                <div key={n.to} className="mb-1">
                  <button
                    onClick={() => toggleMobileExpanded(n.label)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-muted ${isActive(n.to) ? 'text-primary' : 'text-foreground'}`}
                  >
                    {n.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="ml-3 mt-1 flex flex-col border-l-2 border-border pl-2">
                      {subItems.map((item: any) => {
                        if (n.label === "Projects") {
                          return (
                            <Link
                              key={item.slug || item.title}
                              href={`/projects?status=${item.slug}`}
                              onClick={() => setOpen(false)}
                              className="rounded-md px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                            >
                              {item.title}
                            </Link>
                          );
                        }

                        const linkHref = n.label === "Products"
                          ? `/products/${item.slug || 'demo'}`
                          : `/services/${item.slug || 'demo'}`;

                        return (
                          <Link
                            key={item.slug || item.title}
                            href={linkHref}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
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
                href={n.to}
                onClick={() => setOpen(false)}
                className={`mb-1 rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-muted ${
                  isActive(n.to) ? "bg-primary/10 text-primary" : "text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto border-t border-border p-6">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center bg-gradient-primary px-5 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
          >
            Get a Quote
          </Link>
        </div>
      </nav>
    </header>
  );
}
