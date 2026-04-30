/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Shield, Award, Wrench, Building2, CheckCircle2, Factory, HardHat, Cog, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import heroImg from "@/assets/hero-steel.jpg";
import weldingImg from "@/assets/services-welding.jpg";
import warehouseImg from "@/assets/project-warehouse.jpg";
import factoryImg from "@/assets/project-factory.jpg";
import roofImg from "@/assets/project-roof.jpg";

interface HomeClientProps {
  latestBlogs: any[];
}

export function HomeClient({ latestBlogs }: HomeClientProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  // Subtle mouse-follow parallax on the hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex flex-col bg-background">
      {/* HERO */}
      <section
        ref={heroRef}
        className="group/hero relative isolate overflow-hidden bg-secondary [--mx:0] [--my:0]"
      >
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={heroImg}
            alt="Industrial steel structure"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out"
            style={{
              transform: "translate3d(calc(var(--mx) * -12px), calc(var(--my) * -12px), 0)",
            }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/85 via-secondary/55 to-transparent" />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl animate-hero-float transition-transform duration-[900ms] ease-out"
          style={{
            transform: "translate3d(calc(var(--mx) * 24px), calc(var(--my) * 24px), 0)",
          }}
        />

        <div className="container-x relative flex min-h-[55vh] flex-col justify-center py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 border border-primary/50 bg-[oklch(0.13_0.01_20/0.55)] px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-red" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[oklch(0.98_0_0)]">
                City Steel Corporation · Est. 2009
              </span>
            </div>

            <h1 className="font-display text-3xl font-black leading-[1.05] text-[oklch(0.99_0_0)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Building The
              <br />
              <span className="text-gradient-red">Backbone</span> of
              <br />
              Modern Industry
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-12 bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Steel · Precision · Trust
              </span>
            </div>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[oklch(0.85_0_0)] lg:text-lg">
              From pre-engineered buildings to heavy industrial frameworks — we design,
              fabricate, and erect world-class steel structures with uncompromising
              quality across Bangladesh.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-gradient-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-red transition-all hover:scale-[1.03]"
              >
                Request a Quote
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 border border-[oklch(0.98_0_0/0.4)] bg-[oklch(0.13_0.01_20/0.4)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-[oklch(0.98_0_0)] backdrop-blur-md transition-all hover:border-primary hover:bg-primary"
              >
                View Our Projects
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[oklch(0.98_0_0/0.15)] pt-5">
              {[
                { n: "500+", l: "Projects" },
                { n: "15+", l: "Years" },
                { n: "200+", l: "Clients" },
                { n: "ISO", l: "Certified" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-1.5">
                  <span className="font-display text-xl font-black text-[oklch(0.99_0_0)]">
                    {s.n}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[oklch(0.7_0_0)]">
                    {s.l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1.5 stripe-pattern" />
      </section>

      {/* GET TO KNOW US */}
      <section className="py-24">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-10 bg-primary" /> Get to Know Us
            </div>
            <h2 className="font-display text-5xl font-bold leading-tight lg:text-6xl">
              Committed to only <span className="text-gradient-red">High Quality Service</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              City Steel Corporation stands out as a leading provider of steel structures, with
              its unrivaled expertise, comprehensive services, commitment to innovation, and
              dedication to client satisfaction.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Building quality standards that exceed expectations",
                "Comprehensive Design & Build packages",
                "Innovative engineering solutions",
                "Customer-centric project delivery",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-foreground">{t}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-widest text-primary transition-all hover:gap-4"
            >
              Learn About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full border-2 border-primary/30" />
            <Image
              src={weldingImg}
              alt="Welder at work"
              width={1280}
              height={960}
              loading="lazy"
              className="relative h-[520px] w-full object-cover shadow-elegant"
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-primary p-6 shadow-red">
              <div className="font-display text-4xl font-black text-primary-foreground">15+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground">
                Years of Mastery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-surface py-24">
        <div className="container-x">
          <div className="mb-16 text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              What We Do
            </div>
            <h2 className="font-display text-5xl font-bold lg:text-6xl">
              We Offer The <span className="text-gradient-red">Highest Quality</span> Products
            </h2>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {[
              { Icon: Factory, t: "Pre-Engineered Buildings", d: "Custom-designed PEB structures for any industrial use case." },
              { Icon: Building2, t: "Steel Structure Fabrication", d: "Heavy-duty trusses, frames, and skeletons built to spec." },
              { Icon: HardHat, t: "Erection & Installation", d: "Expert on-site crews delivering safe, on-time installs." },
              { Icon: Wrench, t: "Design & Build Package", d: "End-to-end services from blueprint to handover." },
              { Icon: Shield, t: "Quality Standards", d: "Building quality standards that meet international norms." },
              { Icon: Cog, t: "Roofing & Cladding", d: "Premium sheets, purlins, and accessories for any roof." },
            ].map(({ Icon, t, d }) => (
              <div
                key={t}
                className="group relative bg-card p-10 transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center bg-gradient-primary shadow-red transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-foreground">{t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-primary transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
            >
              All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24">
        <div className="container-x">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                Explore Projects
              </div>
              <h2 className="font-display text-5xl font-bold lg:text-6xl">
                Recent <span className="text-gradient-red">Projects</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-widest text-primary"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { img: warehouseImg, t: "Industrial Warehouse", c: "Chittagong" },
              { img: factoryImg, t: "Garments Factory", c: "Gazipur" },
              { img: roofImg, t: "Manufacturing Plant", c: "Dhaka" },
            ].map((p) => (
              <div key={p.t} className="group relative overflow-hidden bg-card shadow-soft transition-all hover:shadow-elegant">
                <div className="relative overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.t}
                    width={1280}
                    height={960}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="border-t-2 border-primary p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-primary">
                    {p.c}
                  </div>
                  <h3 className="mt-1 font-display text-2xl font-bold text-foreground">{p.t}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      {latestBlogs.length > 0 && (
        <section className="border-t border-border bg-surface py-24">
          <div className="container-x">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Blog & Insights</span>
                </div>
                <h2 className="font-display text-4xl font-bold lg:text-5xl text-foreground">
                  Latest <span className="text-gradient-red">News</span>
                </h2>
              </div>
              <Link href="/blogs" className="hidden sm:inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestBlogs.slice(0, 3).map((blog: any) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:shadow-elegant">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {blog.thumbnail_url ? (
                      <Image src={blog.thumbnail_url} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center"><Newspaper className="h-8 w-8 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 text-xs text-muted-foreground">{new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{blog.title}</h3>
                    <div className="mt-auto pt-4"><span className="text-sm font-semibold uppercase tracking-wider text-primary">Read More &rarr;</span></div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Horizontal cards for blog 4-5 */}
            {latestBlogs.length > 3 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {latestBlogs.slice(3, 5).map((blog: any) => (
                  <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group flex overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:shadow-elegant">
                    <div className="relative w-32 flex-shrink-0 overflow-hidden">
                      {blog.thumbnail_url ? (
                        <Image src={blog.thumbnail_url} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center"><Newspaper className="h-6 w-6 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-4">
                      <div className="mb-1 text-xs text-muted-foreground">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2">{blog.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Link href="/blogs" className="inline-flex items-center gap-2 bg-gradient-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red">
                View All Posts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="relative overflow-hidden border-t border-border bg-gradient-dark py-24 text-[oklch(0.98_0_0)]">
        <div className="absolute inset-0 bg-radial-red opacity-60" />
        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Why Choose Us
            </div>
            <h2 className="font-display text-5xl font-bold lg:text-6xl">
              The Best <span className="text-gradient-red">Construction</span> Company
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[oklch(0.8_0_0)]">
              With a track record of successful projects across various industries, we continue to
              deliver exceptional results — combining quality craftsmanship, innovative solutions,
              and a customer-centric approach.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-gradient-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-red transition-all hover:scale-105"
              >
                Get In Touch <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 border border-[oklch(0.98_0_0/0.3)] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[oklch(0.98_0_0)] transition-colors hover:bg-primary hover:border-primary"
              >
                <Award className="h-4 w-4" /> Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
