import type { Metadata } from "next";
import { Target, Eye, Award, Users } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import Image from "next/image";
import aboutImg from "@/assets/about-steel.jpg";

export const metadata: Metadata = {
  title: "About Us — City Steel Corporation",
  description: "Learn about City Steel Corporation — a leading industrial steel structure provider committed to innovation, quality, and client satisfaction.",
  openGraph: {
    title: "About City Steel Corporation",
    description: "Our story, mission, and values.",
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About Us"
        title="Get to Know Us"
        description="A leading provider of industrial steel structures with unrivaled expertise, comprehensive services, and a commitment to innovation."
      />

      <section className="py-24">
        <div className="container-x grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-full w-full border-2 border-primary/30" />
            <Image
              src={aboutImg}
              alt="Steel beams"
              width={1280}
              height={960}
              loading="lazy"
              className="relative h-[520px] w-full object-cover shadow-elegant"
            />
          </div>
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Our Story
            </div>
            <h2 className="font-display text-5xl font-bold leading-tight">
              Committed to only <span className="text-gradient-red">High Quality Service</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              City Steel Corporation stands out as a leading provider of steel structures, with its
              unrivaled expertise, comprehensive services, commitment to innovation, and dedication
              to client satisfaction.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              With a track record of successful projects across various industries, City Steel
              Corporation continues to deliver exceptional results by combining quality
              craftsmanship, innovative solutions, and a customer-centric approach.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-24">
        <div className="container-x grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Target, t: "Mission", d: "Deliver world-class steel structures with uncompromising quality." },
            { Icon: Eye, t: "Vision", d: "To be the most trusted name in industrial steel construction." },
            { Icon: Award, t: "Quality", d: "Building quality standards that exceed expectations." },
            { Icon: Users, t: "Clients", d: "200+ satisfied clients across diverse industries." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="bg-surface p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center bg-gradient-primary shadow-red">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">{t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
