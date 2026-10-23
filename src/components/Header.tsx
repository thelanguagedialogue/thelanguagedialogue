import Link from "next/link";
import { site } from "@/lib/content";
import { Txt } from "./Ex";

export const NAV = [
  { href: "/italian-classes-atlanta/", label: "Italian" },
  { href: "/spanish-classes-atlanta/", label: "Spanish" },
  { href: "/italian-for-travel/", label: "Italian for travel" },
  { href: "/about/", label: "About" },
];

export default function Header() {
  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between gap-4 min-h-[68px]">
        <Link href="/" className="display text-xl sm:text-2xl leading-none">
          <Txt v={site.brandName} />
        </Link>
        <nav aria-label="Main" className="hidden md:flex items-center gap-6 text-[15px] font-medium">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-olive-2">{n.label}</Link>
          ))}
        </nav>
        <Link href="/contact/" className="btn btn-primary text-sm sm:text-base">Get in touch</Link>
      </div>
      <nav aria-label="Main, mobile" className="md:hidden border-t border-line overflow-x-auto">
        <div className="mx-auto max-w-6xl px-4 flex gap-5 text-sm font-medium whitespace-nowrap min-h-[44px] items-center">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="py-2">{n.label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
