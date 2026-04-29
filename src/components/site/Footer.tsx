import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function Footer() {
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
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-primary">EXPLORE</h4>
          <ul className="space-y-2 text-sm text-[oklch(0.7_0_0)]">
            <li><Link to="/about" className="transition-colors hover:text-[oklch(0.98_0_0)]">About Us</Link></li>
            <li><Link to="/services" className="transition-colors hover:text-[oklch(0.98_0_0)]">Services</Link></li>
            <li><Link to="/projects" className="transition-colors hover:text-[oklch(0.98_0_0)]">Our Projects</Link></li>
            <li><Link to="/blogs" className="transition-colors hover:text-[oklch(0.98_0_0)]">Blog & Insights</Link></li>
            <li><Link to="/career" className="transition-colors hover:text-[oklch(0.98_0_0)]">Career</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold tracking-widest text-primary">PRODUCTS</h4>
          <ul className="space-y-2 text-sm text-[oklch(0.7_0_0)]">
            <li><a href="/products/steel-column" className="transition-colors hover:text-[oklch(0.98_0_0)]">Steel Column</a></li>
            <li><a href="/products/steel-beam" className="transition-colors hover:text-[oklch(0.98_0_0)]">Steel Beam</a></li>
            <li><a href="/products/purlin" className="transition-colors hover:text-[oklch(0.98_0_0)]">Purlin</a></li>
            <li><a href="/products/industrial-roof-sheet" className="transition-colors hover:text-[oklch(0.98_0_0)]">Industrial Roof Sheet</a></li>
            <li><a href="/products/industrial-deck-sheet" className="transition-colors hover:text-[oklch(0.98_0_0)]">Industrial Deck Sheet</a></li>
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
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs uppercase tracking-widest text-[oklch(0.6_0_0)] sm:flex-row">
          <span>© {new Date().getFullYear()} City Steel Corporation</span>
          <a href="https://citysteelbd.com" className="transition-colors hover:text-primary">citysteelbd.com</a>
        </div>
      </div>
    </footer>
  );
}
