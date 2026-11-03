"use client";

import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";

const PHONE_DISPLAY = "01711-787556";
const PHONE_TEL = "tel:+8801711787556";
const WHATSAPP_URL =
  "https://wa.me/8801711787556?text=" +
  encodeURIComponent("Hello City Steel, I would like a quote for a steel structure project.");

/** Send a GA4 event when gtag is loaded; never throw if it is not. */
function track(action: "whatsapp_click" | "call_click") {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", action, { event_category: "contact", page_path: window.location.pathname });
  } catch {
    /* analytics must never break the button */
  }
}

/**
 * Floating WhatsApp + Call Now buttons, shown on every public page.
 * Rendered from the root layout; hidden inside /admin.
 * z-40 keeps it under the sticky header (z-50) and the mobile drawer (z-9998).
 */
export function FloatingContact() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 print:hidden">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click")}
        aria-label={`Chat on WhatsApp: ${PHONE_DISPLAY}`}
        className="group flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:h-12 sm:w-auto sm:px-5"
      >
        <MessageCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
      </a>
      <a
        href={PHONE_TEL}
        onClick={() => track("call_click")}
        aria-label={`Call now: ${PHONE_DISPLAY}`}
        className="group flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:h-12 sm:w-auto sm:px-5"
      >
        <Phone className="h-6 w-6 shrink-0 sm:h-5 sm:w-5" aria-hidden="true" />
        <span className="hidden text-sm font-semibold sm:inline">Call Now: {PHONE_DISPLAY}</span>
      </a>
    </div>
  );
}
