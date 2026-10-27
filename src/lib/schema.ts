import type { Metadata } from "next";
import { site, plain, ready } from "./content";
import { ORIGIN, absoluteUrl, robotsFor } from "./site";

type Node = Record<string, unknown>;

export interface Crumb { label: string; href?: string }

const BUSINESS_ID = `${ORIGIN}/#business`;
const PERSON_ID = `${ORIGIN}/#valentina`;

const AREA = [
  { "@type": "AdministrativeArea", name: "Atlanta metropolitan area" },
  { "@type": "City", name: "Atlanta" },
  { "@type": "Country", name: "United States" },
];

/** Her lesson and call hours (WhatsApp 27.10), the same as on the Google profile. */
const HOURS = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "14:00" },
];

/**
 * The business, once, on every page. A service-area business: no street address is published,
 * the Atlanta metro area is where in-person lessons happen, and online lessons reach the whole US
 * (the Country entry). Email and phone appear only once they are real and approved (no marker).
 */
export function businessSchema(): Node {
  return {
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: plain(site.brandName),
    description: plain(site.tagline),
    url: `${ORIGIN}/`,
    logo: absoluteUrl("/icon-512.png"),
    image: absoluteUrl("/images/og.png"),
    ...(ready(site.contact.email) ? { email: plain(site.contact.email) } : {}),
    ...(ready(site.contact.phone) ? { telephone: plain(site.contact.phone) } : {}),
    areaServed: AREA,
    openingHoursSpecification: HOURS,
    founder: { "@id": PERSON_ID },
    knowsLanguage: ["it", "es", "fr", "en"],
    ...(ready(site.contact.instagram) ? { sameAs: [plain(site.contact.instagram)] } : {}),
  };
}

/** The teacher. Only facts she gave us: native Italian, the Turin degree, the four languages. */
export function personSchema(): Node {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: plain(site.teacher.name),
    jobTitle: "Language teacher",
    worksFor: { "@id": BUSINESS_ID },
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Turin" },
    knowsLanguage: ["it", "es", "fr", "en"],
    url: absoluteUrl("/about/"),
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

/** FAQ markup. Answers still marked as examples are left out, so nothing invented reaches Google. */
export function faqSchema(items: { q: string; a: string }[] | undefined): Node | null {
  const clean = (items ?? [])
    .filter((x) => !/\[(EXAMPLE|CONFIRM)\]/.test(x.q + x.a))
    .map((x) => ({ q: plain(x.q), a: plain(x.a) }))
    .filter((x) => x.q && x.a);
  if (clean.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: clean.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
}

/** A Service node for the lesson pages, provided by the business. */
export function serviceSchema(name: string, description: string, path: string): Node {
  return {
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": BUSINESS_ID },
    areaServed: AREA,
    serviceType: "Language lessons",
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

/** Page metadata in one call: title, description, canonical, robots, social card. */
export function pageMeta({ title, description, path, index = true }: {
  title: string; description: string; path: string | null; index?: boolean;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: robotsFor(index),
    openGraph: socialCard({ title, description, path: path ?? "/" }),
    twitter: { card: "summary_large_image", title, description },
  };
}
