import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Everything the client edits lives in content/ as JSON, edited through Pages CMS
 * (.pages.yml at the repo root). This module is the only place that reads it.
 *
 * Example content: any string that starts with "[EXAMPLE] " is a placeholder we wrote
 * so the first version could be built before the client sent her own text, photos and
 * prices. It renders with a visible marker on previews (components/Ex.tsx) and
 * scripts/example-gate.mjs refuses a live build while any is left.
 */
export const EXAMPLE = "[EXAMPLE]";

export interface Language { name: string; blurb: string; levels: string }
export interface Format { title: string; text: string }
export interface Price { label: string; price: string; note: string }
export interface Testimonial { quote: string; name: string }

export interface SiteContent {
  brandName: string;
  tagline: string;
  liveOrigin: string;
  gaId: string;
  teacher: { name: string };
  contact: { email: string; phone: string; instagram: string; area: string };
  languages: Language[];
  rhythm: string;
  formats: Format[];
  showPrices: boolean;
  prices: Price[];
  testimonials: Testimonial[];
  availability: string;
}

export interface Section { heading: string; body: string; image?: string; imageAlt?: string }
export interface Faq { q: string; a: string }

export interface PageContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  sections: Section[];
  faq: Faq[];
  ctaLabel: string;
}

const ROOT = join(process.cwd(), "content");

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8")) as T;
}

export const site: SiteContent = readJson<SiteContent>("site.json");

export function page(slug: string): PageContent {
  return readJson<PageContent>(`pages/${slug}.json`);
}

/** Split a string into its text and whether it was marked as example content. */
export function parse(s: string | undefined | null): { text: string; example: boolean } {
  const v = (s ?? "").trim();
  if (v.startsWith(EXAMPLE)) return { text: v.slice(EXAMPLE.length).trim(), example: true };
  return { text: v, example: false };
}

/** Plain text with the marker removed, for <title>, meta and schema. */
export const plain = (s: string | undefined | null): string => parse(s).text;

/** Paragraphs: blank lines separate them. A marker on the first applies to all; a marker on one applies to that one. */
export function paragraphs(s: string): { text: string; example: boolean }[] {
  const whole = parse(s);
  return whole.text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const own = parse(p);
    return { text: own.text, example: whole.example || own.example };
  });
}
