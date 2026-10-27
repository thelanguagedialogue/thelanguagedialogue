import Link from "next/link";
import type { CSSProperties } from "react";
import { site } from "@/lib/content";
import { bookAct, whatsappAct } from "@/lib/links";
import { LogoLockup } from "./Logo";
import { Btn, Arr, WhatsAppIcon } from "./Ui";
import MenuButton from "./MenuButton";

/**
 * The concept's header: it sits on the dark cover in cream, and turns to paper once you scroll
 * past the cover (components/Motion.tsx toggles .solid). On narrow screens the links move into a
 * full-screen menu; the panel is rendered here on the server and MenuButton only opens and closes it.
 */
export default function Header() {
  const wa = whatsappAct();
  return (
    <header className="site">
      <div className="wrap">
        <Link className="brand" href="/" aria-label={`${site.brandName}, home`}><LogoLockup /></Link>
        <nav aria-label="Main">
          {site.nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Btn act={bookAct()} className="btn"><span className="long">{site.buttons.book}</span><span className="short">{site.buttons.bookShort}</span></Btn>
          <MenuButton />
        </nav>
      </div>
      <div className="menu" id="menu" hidden>
        <div className="wrap">
          <ul>
            <li style={{ "--i": 0 } as CSSProperties}><Link href="/">Home</Link></li>
            {site.nav.map((n, i) => (
              <li key={n.href} style={{ "--i": i + 1 } as CSSProperties}><Link href={n.href}>{n.label}</Link></li>
            ))}
            <li style={{ "--i": site.nav.length + 1 } as CSSProperties}><Link href="/contact/">Contact</Link></li>
          </ul>
          <div className="acts">
            <Btn act={bookAct()} className="btn olive">{site.buttons.book} <Arr /></Btn>
            {wa && <Btn act={wa} className="btn light"><WhatsAppIcon />{site.buttons.whatsapp}</Btn>}
            <p className="fine">{site.footerLine}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
