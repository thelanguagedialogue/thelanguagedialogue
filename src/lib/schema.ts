import type { Metadata } from "next";
import { site, plain } from "./content";
import { ORIGIN, absoluteUrl } from "./site";

type Node = Record<string, unknown>;

export interface Crumb { label: string; href?: string }

const BUSINESS_ID = `${ORIGIN}/#business`;

/**
 * The business, once, on every page. A service-area business: no street address is
 * published, Atlanta is the area served, and the teacher is the founder. Online lessons
 * are nationwide, which is what the second areaServed entry says.
 */
export function businessSchema(): Node {
  return {
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: plain(site.brandName),
    description: plain(site.tagline),
    url: ORIGIN,
    ...(site.contact.email ? { email: plain(site.contact.email) } : {}),
    ...(site.contact.phone && !site.contact.phone.startsWith("[") ? { telephone: plain(site.contact.phone) } : {}),
    areaServed: [{ "@type": "City", name: "Atlanta" }, { "@type": "Country", name: "United States" }],
    founder: { "@type": "Person", name: plain(site.teacher.name) },
    knowsLanguage: ["it", "es", "fr", "en"],
    ...(site.contact.instagram ? { sameAs: [plain(site.contact.instagram)] } : {}),
  };
}

export function breadcrumbSchema(crumbs: Crumb[]): Node {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href) } : {}),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Node | null {
  const clean = items.map((x) => ({ q: plain(x.q), a: plain(x.a) })).filter((x) => x.q && x.a);
  if (clean.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: clean.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

/** A Service node for the three lesson pages, provided by the business. */
export function serviceSchema(name: string, description: string, path: string): Node {
  return {
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": BUSINESS_ID },
    areaServed: [{ "@type": "City", name: "Atlanta" }],
  };
}

export function socialCard({ title, description, path, image }: {
  title: string; description: string; path: string; image?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: plain(site.brandName),
    locale: "en_US",
    title,
    description,
    url: absoluteUrl(path),
    images: [{ url: absoluteUrl(image ?? "/images/og.png"), width: 1200, height: 630, alt: plain(site.brandName) }],
  };
}

/** One <script type="application/ld+json"> string. Nulls are dropped. */
export function jsonLd(...nodes: (Node | null | undefined | false)[]): string {
  const bare = nodes.filter((n): n is Node => Boolean(n));
  const doc = bare.length === 1
    ? { "@context": "https://schema.org", ...bare[0] }
    : { "@context": "https://schema.org", "@graph": bare };
  return JSON.stringify(doc).replace(/</g, "\\u003c");
}
