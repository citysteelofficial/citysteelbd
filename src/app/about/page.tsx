import type { Metadata } from "next";
import { 
  Target, 
  Eye, 
  Clock, 
  Cpu, 
  Layers, 
  Hammer, 
  Maximize2, 
  Expand, 
  Sun, 
  Coins, 
  Users, 
  Quote,
  Award,
  CheckCircle,
  Shield,
  Briefcase
} from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import Image from "next/image";
import aboutImg from "@/assets/about-steel.jpg";
import { supabase } from "@/lib/supabase";

const ICONS: Record<string, any> = {
  Target, Eye, Award, Users, CheckCircle, Shield, Briefcase,
  Clock, Cpu, Layers, Hammer, Maximize2, Expand, Sun, Coins
};

export const metadata: Metadata = {
  title: "About Us — City Steel Corporation",
  description: "Learn about City Steel Corporation — a leading industrial steel structure provider committed to innovation, quality, and client satisfaction.",
  openGraph: {
    title: "About City Steel Corporation",
    description: "Our story, mission, vision, and technical advantages.",
  },
};

export default async function AboutPage() {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const cleanHtml = (htmlString: string | null | undefined): string => {
    if (!htmlString) return "";
    return htmlString
      .replace(/\u00A0/g, " ")
      .replace(/&nbsp;/g, " ");
  };

  // Split specialties dynamically from comma-separated database string
  const specialties = (settings?.about_specialties || "Industrial Buildings, Warehouses, Commercial Projects, Residential Structures, Agro-Based Facilities, Exhibition Centers")
    .split(",")
    .map((s: string) => cleanHtml(s.trim()))
    .filter(Boolean);

  // Load dynamic PEB advantages list from database JSONB
  const dbAdvantages = settings?.about_advantages || [
    {
      icon: "Clock",
      title: "Reduce Construction Time",
      desc: "Due to the system approach, the use of high strength steel, optimized built-up sections, and continuous lightweight secondary steel, construction time is significantly reduced compared to conventional steel."
    },
    {
      icon: "Cpu",
      title: "Advanced Computerized Design",
      desc: "PEB systems are designed using specialized computer analysis and custom details. Lightweight flexible frames offer higher resistance to seismic forces, and design time is significantly reduced."
    },
    {
      icon: "Layers",
      title: "Lighter Foundations",
      desc: "Pre-engineered steel buildings are about 50% lighter than conventional steel structures. Hence, foundations are of simpler design, easier to construct, and lighter."
    },
    {
      icon: "Hammer",
      title: "LEGO-like Faster Erection",
      desc: "All fabricated components are standard, accurately sized, and numbered. The on-site assembly works just like LEGO blocks, ensuring a much faster and safer erection process."
    },
    {
      icon: "Maximize2",
      title: "Flexibility of Expansion",
      desc: "Buildings can be easily expanded in length by adding more bays. Expansion in width and height is also possible by pre-designing for future growth from the start."
    },
    {
      icon: "Expand",
      title: "Large Clear Spans",
      desc: "Our architectural engineering allows us to supply buildings up to 90 meters of clear span, ensuring massive column-free spaces for maximum industrial utility."
    },
    {
      icon: "Sun",
      title: "Energy Efficient Systems",
      desc: "Buildings can be supplied with high-density polyurethane insulated panels or premium fiberglass blanket insulation to achieve required energy-saving 'U' values."
    },
    {
      icon: "Coins",
      title: "Up to 30% Lower Cost",
      desc: "Significant savings in design, manufacturing, and erection. Secondary members and cladding nest together, reducing transportation. Elemental shapes follow stress diagrams to optimize steel weight."
    }
  ];

  // Load Vision and Mission pillars dynamically from about_features array
  const dbFeatures = settings?.about_features || [
    {"icon": "Target", "title": "Mission", "description": "Deliver world-class steel structures with uncompromising quality."},
    {"icon": "Eye", "title": "Vision", "description": "To be the most trusted name in industrial steel construction."}
  ];

  const missionCard = dbFeatures[0] || {"icon": "Target", "title": "Mission", "description": "Deliver world-class steel structures with uncompromising quality."};
  const visionCard = dbFeatures[1] || {"icon": "Eye", "title": "Vision", "description": "To be the most trusted name in industrial steel construction."};

  const MissionIcon = ICONS[missionCard.icon] || Target;
  const VisionIcon = ICONS[visionCard.icon] || Eye;

  return (
    <PageShell>
      {/* Dynamic Header */}
      <PageHeader
        eyebrow={settings?.about_header_eyebrow || "About Us"}
        title={settings?.about_header_title || "Get to Know Us"}
        description={settings?.about_header_description || "A leading provider of industrial steel structures with unrivaled expertise, comprehensive services, and a commitment to innovation."}
      />

      {/* Main Identity & About Us Section */}
      <section className="py-24 bg-background">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-start">
          <div className="relative lg:col-span-5">
            <div className="absolute -right-4 -top-4 h-full w-full border-2 border-primary/30" />
            <Image
              src={aboutImg}
              alt="City Steel Corporation construction site"
              width={1280}
              height={960}
              loading="lazy"
              className="relative h-[560px] w-full object-cover shadow-elegant"
            />
          </div>
          
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Our Identity
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-foreground lg:text-5xl">
              {settings?.about_story_title || "Pioneering Modern"} <span className="text-gradient-red">{settings?.about_story_highlight || "Pre-Engineered Steel"}</span> Structures
            </h2>
            
            <div 
              className="prose dark:prose-invert max-w-none text-muted-foreground mt-6 text-base leading-relaxed break-words"
              dangerouslySetInnerHTML={{ 
                __html: cleanHtml(settings?.about_story_p1) || "City Steel Corporation specializes in the Design, Manufacture, Supply, and Erection of high-quality pre-engineered steel buildings. We bring world-class engineering solutions to industrial and commercial structures across Bangladesh." 
              }}
            />

            {/* Specialties Badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {specialties.map((spec: string) => (
                <span key={spec} className="inline-flex items-center rounded-full bg-secondary/80 border border-border px-3 py-1 text-[11px] font-semibold text-foreground">
                  {spec}
                </span>
              ))}
            </div>

            <div 
              className="prose dark:prose-invert max-w-none text-muted-foreground mt-6 text-base leading-relaxed break-words"
              dangerouslySetInnerHTML={{ 
                __html: cleanHtml(settings?.about_story_p2) || "Backed by a highly qualified team of experienced engineers and cutting-edge computerized design software, we deliver custom-fit structural solutions that optimize cost, maximize durability, and reduce construction cycles." 
              }}
            />

            {/* Premium Quote Card */}
            <div className="mt-8 relative border-l-4 border-primary bg-surface/50 p-6 shadow-soft backdrop-blur-md break-words">
              <Quote className="absolute top-4 right-4 h-12 w-12 text-primary/10" />
              <p className="font-display text-lg font-bold text-foreground italic leading-relaxed">
                "{cleanHtml(settings?.about_quote_text) || "Stepping forward to be the most VIRAL NAME in excellent quality with reasonable price in the Country."}"
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {cleanHtml(settings?.about_quote_subtext) || "To make our dream come true, we serve you with the best attitude and commitment. Let us be your friend and your consultant—even if you ultimately don't choose us."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Core Pillars Section */}
      <section className="bg-surface border-y border-border py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-red opacity-10 pointer-events-none" />
        <div className="container-x relative">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Vision Card */}
            <div className="group bg-card p-10 border border-border shadow-soft hover:-translate-y-1 hover:shadow-elegant transition-all duration-300">
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-gradient-primary shadow-red transition-transform group-hover:scale-105">
                <VisionIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Our {visionCard.title}</div>
              <h3 className="font-display text-2xl font-black text-foreground mb-4 uppercase tracking-tight">
                "{visionCard.description.split('.').slice(0, 1).join('')}"
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {visionCard.description}
              </p>
            </div>

            {/* Mission Card */}
            <div className="group bg-card p-10 border border-border shadow-soft hover:-translate-y-1 hover:shadow-elegant transition-all duration-300">
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-gradient-primary shadow-red transition-transform group-hover:scale-105">
                <MissionIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Our {missionCard.title}</div>
              <h3 className="font-display text-2xl font-black text-foreground mb-4 uppercase tracking-tight">
                "{missionCard.description.split('.').slice(0, 1).join('')}"
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {missionCard.description}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PEB Advantages Grid Section */}
      <section className="py-24 bg-background">
        <div className="container-x">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              The PEB Advantage
            </div>
            <h2 className="font-display text-4xl font-extrabold lg:text-5xl text-foreground mb-4">
              Why Choose <span className="text-gradient-red">Pre-Engineered</span> Steel Buildings?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              PEB structures represent a revolutionary upgrade over conventional construction. Explore the key technical advantages City Steel Corporation delivers to every project.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dbAdvantages.map((adv: any, idx: number) => {
              const IconComp = ICONS[adv.icon] || Clock;
              return (
                <div 
                  key={idx} 
                  className="group relative bg-card p-8 border border-border shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant hover:border-primary/20"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center bg-gradient-primary/10 rounded-lg text-primary transition-transform group-hover:scale-110">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h4 className="mb-3 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {adv.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {adv.desc}
                  </p>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-primary transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
