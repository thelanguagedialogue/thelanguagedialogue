import Link from "next/link";
import { site, plain } from "@/lib/content";
import { Txt } from "./Ex";
import { NAV } from "./Header";

export default function Footer() {
  const ig = plain(site.contact.instagram);
  const igHandle = ig.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="display text-2xl"><Txt v={site.brandName} /></div>
          <p className="mt-3 text-paper/80 max-w-xs"><Txt v={site.tagline} /></p>
          <p className="mt-4 text-paper/70 text-sm"><Txt v={site.contact.area} /></p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-paper/60 uppercase tracking-wide" style={{ fontFamily: "var(--font-body)" }}>Lessons</h3>
          <ul className="mt-3 space-y-2">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:underline">{n.label}</Link></li>
            ))}
            <li><Link href="/contact/" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-paper/60 uppercase tracking-wide" style={{ fontFamily: "var(--font-body)" }}>Contact</h3>
          <ul className="mt-3 space-y-2">
            {site.contact.email && (
              <li><a href={`mailto:${plain(site.contact.email)}`} className="hover:underline"><Txt v={site.contact.email} /></a></li>
            )}
            {site.contact.phone && (
              <li><a href={`tel:${plain(site.contact.phone).replace(/[^+\d]/g, "")}`} className="hover:underline"><Txt v={site.contact.phone} /></a></li>
            )}
            {ig && (
              <li><a href={ig.startsWith("http") ? ig : `https://instagram.com/${igHandle}`} className="hover:underline" rel="noopener">Instagram{igHandle ? ` @${igHandle}` : ""}</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-wrap justify-between gap-3 text-sm text-paper/60">
          <span>&copy; {new Date().getFullYear()} <Txt v={site.brandName} /></span>
          <Link href="/privacy/" className="hover:underline">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
