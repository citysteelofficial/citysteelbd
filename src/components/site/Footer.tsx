"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61573880256953";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t border-[oklch(0.98_0_0/0.1)] bg-gradient-dark text-[oklch(0.85_0_0)]">
      <div className="h-1 stripe-pattern opacity-80" />
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-gradient-primary">
              <span className="font-display text-xl font-bold text-primary-foreground">C</span>
            </div>
            <div className="font-display text-lg font-bold tracking-wider text-[oklch(0.98_0_0)]">CITY STEEL</div>
          </div>
          <p className="text-sm leading-relaxed text-[oklch(0.7_0_0)]">
            The best industrial STEEL STRUCTURE solutions. Quality craftsmanship, innovative
            engineering, and a customer-first approach.
          </p>
          <div className="mt-4 flex items-start gap-2 text-sm text-[oklch(0.7_0_0)]">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <div>Sat – Thu: 9:00 AM – 6:00 PM</div>
              <div>Friday: Closed</div>
            </div>
          </div>
          {/* Social Links */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow City Steel on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.25_0_0)] text-[oklch(0.7_0_0)] transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-primary">EXPLORE</h4>
          <ul className="space-y-2 text-sm text-[oklch(0.7_0_0)]">
            <li><Link href="/about" className="transition-colors hover:text-[oklch(0.98_0_0)]">About Us</Link></li>
            <li><Link href="/services" className="transition-colors hover:text-[oklch(0.98_0_0)]">Services</Link></li>
            <li><Link href="/projects" className="transition-colors hover:text-[oklch(0.98_0_0)]">Our Projects</Link></li>
            <li><Link href="/blogs" className="transition-colors hover:text-[oklch(0.98_0_0)]">Blog & Insights</Link></li>
            <li><Link href="/career" className="transition-colors hover:text-[oklch(0.98_0_0)]">Career</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-primary">PRODUCTS</h4>
          <ul className="space-y-2 text-sm text-[oklch(0.7_0_0)]">
            <li><Link href="/products/steel-column" className="transition-colors hover:text-[oklch(0.98_0_0)]">Steel Column</Link></li>
            <li><Link href="/products/steel-beam" className="transition-colors hover:text-[oklch(0.98_0_0)]">Steel Beam</Link></li>
            <li><Link href="/products/purlin" className="transition-colors hover:text-[oklch(0.98_0_0)]">Purlin</Link></li>
            <li><Link href="/products/industrial-roof-sheet" className="transition-colors hover:text-[oklch(0.98_0_0)]">Industrial Roof Sheet</Link></li>
            <li><Link href="/products/industrial-deck-sheet" className="transition-colors hover:text-[oklch(0.98_0_0)]">Industrial Deck Sheet</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-primary">CONTACT</h4>
          <ul className="space-y-3 text-sm text-[oklch(0.7_0_0)]">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-[oklch(0.85_0_0)]">Corporate Office:</div>
                <span>7/6, Garden Street, Ring Road, Shyamoli, Dhaka-1207</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-[oklch(0.85_0_0)]">Factory:</div>
                <span>Hemayatpur, Savar, Dhaka</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <a href="tel:+8801711787556" className="block transition-colors hover:text-[oklch(0.98_0_0)]">+880 1711-787556</a>
                <a href="tel:+8801711991775" className="block transition-colors hover:text-[oklch(0.98_0_0)]">+880 1711-991775</a>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:citysteel.corporation@gmail.com" className="transition-colors hover:text-[oklch(0.98_0_0)]">citysteel.corporation@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[oklch(0.98_0_0/0.1)]">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs uppercase tracking-widest text-[oklch(0.6_0_0)] sm:flex-row">
          <span>© {new Date().getFullYear()} City Steel Corporation</span>
          <div className="flex items-center gap-4">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-primary"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <span>Develop By <a href="https://techvilo.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">Techvilo Ltd</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
