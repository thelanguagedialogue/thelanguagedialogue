import Link from "next/link";
import { site, parse } from "@/lib/content";
import { T } from "./Text";

/** The concept's footer: the name, big, then one line and the links. Only one of the two
 *  wordmarks shows at a time (one line on wide screens, two lines on phones), so both carry the
 *  name as alt text: crawlers flag empty alt, and a screen reader only meets the visible one. */
export default function Footer() {
  const email = parse(site.contact.email).text;
  return (
    <footer>
      <div className="wrap">
        <div className="giant">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-svg one" src="/brand/wordmark-one-line.svg" alt={site.brandName} width={25546} height={1773} loading="lazy" decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-svg two" src="/brand/wordmark-two-line.svg" alt={site.brandName} width={14502} height={3835} loading="lazy" decoding="async" />
        </div>
        <div className="row2">
          <p className="fine">
            {site.footerLine}
            {email && <> · <a href={`mailto:${email}`}><T v={site.contact.email} /></a></>}
          </p>
          <nav aria-label="Footer">
            {site.footerNav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
