import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { robotsFor } from "@/lib/site";
import { PageHead } from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${site.brandName}` },
  description: "That page is not here. Everything on the site is one click away from the homepage.",
  robots: robotsFor(false),
};

export default function NotFound() {
  return (
    <PageHead
      hero={{ issue: ["404"], title: "That page is *not here*", lede: "The link may be old. Everything on the site is one click away from the homepage." }}
      actions={<Link className="btn olive" href="/">Back to the homepage <span className="arr" aria-hidden="true">→</span></Link>}
    />
  );
}
