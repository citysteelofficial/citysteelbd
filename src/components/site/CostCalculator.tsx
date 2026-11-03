"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, CheckCircle, Loader2, MessageCircle, Phone } from "lucide-react";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { COST_RATES, estimateCost, formatTaka, formatTakaShort } from "@/lib/costRates";

const WHATSAPP = "8801711787556";

function track(action: string) {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", action, { event_category: "calculator" });
  } catch {
    /* ignore */
  }
}

function num(v: string, max: number) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0;
}

export function CostCalculator() {
  const [length, setLength] = useState("120");
  const [width, setWidth] = useState("60");
  const [hasMezz, setHasMezz] = useState(false);
  const [mezzArea, setMezzArea] = useState("");
  const [civil, setCivil] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const L = num(length, 2000);
  const W = num(width, 500);
  const est = useMemo(
    () => estimateCost({ lengthFt: L, widthFt: W, mezzanineSqft: hasMezz ? num(mezzArea, 1e6) : 0, includeCivil: civil }),
    [L, W, hasMezz, mezzArea, civil],
  );
  const valid = L >= 10 && W >= 10;

  const summary =
    `Building: ${L} ft x ${W} ft (${est.ground.toLocaleString("en-IN")} sq ft)` +
    (est.mezz ? `\nMezzanine: ${est.mezz.toLocaleString("en-IN")} sq ft` : "") +
    `\nCivil/foundation: ${civil ? "included" : "not included"}` +
    `\nWebsite estimate: ${formatTaka(est.min)} – ${formatTaka(est.max)}` +
    (location.trim() ? `\nSite location: ${location.trim()}` : "");

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello City Steel, I used the cost calculator on your website.\n${summary}\nPlease send me a detailed quote.`)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) { setStatus("error"); setError("Please enter your name."); return; }
    if (digits.length < 10) { setStatus("error"); setError("Please enter a valid phone number."); return; }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject: `Cost calculator: ${est.ground.toLocaleString("en-IN")} sq ft, ${formatTakaShort(est.min)} – ${formatTakaShort(est.max)}`,
          message: `${summary}\n\nRequested a detailed quote from the website cost calculator.`,
          company_website: honeypot,
          page: "/cost-calculator",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not send. Please call us.");
      track("calculator_lead");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send. Please call us.");
    }
  }

  const input = "w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary";
  const label = "mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground";

  return (
    <PageShell>
      <PageHeader
        eyebrow="Cost Calculator"
        title="Steel Building Cost Calculator"
        description="Get an instant approximate cost for a pre-engineered steel (PEB) building in Bangladesh, then request a detailed quote from our engineers."
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          {/* Inputs */}
          <div className="space-y-6 border border-border bg-surface p-6 md:p-8 lg:col-span-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide">
              <Calculator className="h-5 w-5 text-primary" /> Building details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="calc-length" className={label}>Length (ft)</label>
                <input id="calc-length" inputMode="decimal" type="number" min={10} value={length} onChange={(e) => setLength(e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="calc-width" className={label}>Width / span (ft)</label>
                <input id="calc-width" inputMode="decimal" type="number" min={10} value={width} onChange={(e) => setWidth(e.target.value)} className={input} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={hasMezz} onChange={(e) => setHasMezz(e.target.checked)} className="h-4 w-4 accent-primary" />
                Add a mezzanine floor (deck sheet)
              </label>
              {hasMezz && (
                <div className="pl-7">
                  <label htmlFor="calc-mezz" className={label}>Mezzanine floor area (sq ft)</label>
                  <input id="calc-mezz" inputMode="decimal" type="number" min={0} placeholder={String(est.ground)} value={mezzArea} onChange={(e) => setMezzArea(e.target.value)} className={input} />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={civil} onChange={(e) => setCivil(e.target.checked)} className="h-4 w-4 accent-primary" />
                Include civil works / foundation
              </label>
            </div>

            <div className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              Rates used: PEB shed {formatTaka(COST_RATES.shed.min)}–{formatTaka(COST_RATES.shed.max)}/sq ft ·
              mezzanine with deck sheet {formatTaka(COST_RATES.mezzanine.min)}–{formatTaka(COST_RATES.mezzanine.max)}/sq ft ·
              civil/foundation {formatTaka(COST_RATES.civil.min)}–{formatTaka(COST_RATES.civil.max)}/sq ft.
            </div>
          </div>

          {/* Result */}
          <div className="space-y-6 lg:col-span-2">
            <div className="border border-primary/30 bg-background p-6 shadow-soft md:p-8" aria-live="polite">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Approximate cost</div>
              {valid ? (
                <>
                  <div className="mt-2 font-display text-3xl font-black leading-tight md:text-4xl">
                    {formatTakaShort(est.min)} – {formatTakaShort(est.max)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {formatTaka(est.min)} – {formatTaka(est.max)}
                  </div>
                  <ul className="mt-5 space-y-2 text-sm">
                    {est.lines.map((l) => (
                      <li key={l.label} className="flex justify-between gap-4 border-b border-border pb-2">
                        <span>{l.label}<span className="block text-xs text-muted-foreground">{l.sqft.toLocaleString("en-IN")} sq ft</span></span>
                        <span className="whitespace-nowrap text-right">{formatTakaShort(l.min)} – {formatTakaShort(l.max)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Enter a length and width of at least 10 ft.</p>
              )}
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                This is an approximate estimate for budgeting only. The final price depends on design loads, span, eave
                height, crane, cladding and site conditions, and is confirmed after a site visit and structural design.
              </p>
            </div>

            {/* Lead form */}
            <div className="border border-border bg-surface p-6 md:p-8">
              {status === "success" ? (
                <div className="text-center">
                  <CheckCircle className="mx-auto h-10 w-10 text-green-600" />
                  <h3 className="mt-3 font-display text-lg font-bold uppercase">Request received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Our engineer will call you within one business day with a detailed quote.</p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("calculator_whatsapp")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <MessageCircle className="h-4 w-4" /> Also send on WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">Get a detailed quote</h3>
                  <div>
                    <label htmlFor="lead-name" className={label}>Name *</label>
                    <input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} className={input} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="lead-phone" className={label}>Phone *</label>
                    <input id="lead-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} autoComplete="tel" placeholder="01XXXXXXXXX" />
                  </div>
                  <div>
                    <label htmlFor="lead-email" className={label}>Email (optional)</label>
                    <input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" />
                  </div>
                  <div>
                    <label htmlFor="lead-location" className={label}>Site location (optional)</label>
                    <input id="lead-location" value={location} onChange={(e) => setLocation(e.target.value)} className={input} placeholder="e.g. Gazipur" />
                  </div>
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="calc-company-website">Company website</label>
                    <input id="calc-company-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>
                  {status === "error" && <p className="text-sm text-red-600">{error}</p>}
                  <button type="submit" disabled={!valid || status === "loading"} className="inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60">
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Request detailed quote
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("calculator_whatsapp")} className="inline-flex items-center justify-center gap-2 border border-border px-3 py-2.5 text-sm font-semibold hover:border-primary">
                      <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
                    </a>
                    <a href="tel:+8801711787556" onClick={() => track("calculator_call")} className="inline-flex items-center justify-center gap-2 border border-border px-3 py-2.5 text-sm font-semibold hover:border-primary">
                      <Phone className="h-4 w-4 text-primary" /> Call
                    </a>
                  </div>
                </form>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Want to see what we have built? <Link href="/projects" className="font-semibold text-primary">View our projects</Link>.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
