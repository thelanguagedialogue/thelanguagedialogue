"use client";
import Script from "next/script";
import { useEffect } from "react";
import { bootstrap, track } from "@/lib/track";

/** Which contact link a click went to, for the GA4 "contact" event (null = not a contact link). */
function contactMethod(href: string): string | null {
  if (/wa\.me|whatsapp\.com/i.test(href)) return "whatsapp";
  if (/calendly\.com|cal\.com/i.test(href)) return "booking";
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  return null;
}

/** Loads gtag.js only when a valid GA4 id exists. Nothing renders otherwise.
 *  One delegated listener counts clicks on WhatsApp, calendar, phone and email links as "contact". */
export default function Analytics({ id }: { id: string }) {
  useEffect(() => { if (id) bootstrap(id); }, [id]);
  useEffect(() => {
    if (!id) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      const method = a ? contactMethod(a.getAttribute("href") || "") : null;
      if (method) track(id, "contact", { method, page: window.location.pathname });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [id]);
  if (!id) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />;
}
