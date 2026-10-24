import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Everything the client edits lives in content/ as JSON, edited through Pages CMS (.pages.yml at
 * the repo root). This module is the only place that reads it.
 *
 * Two markers, both blocked on a live build by scripts/example-gate.mjs:
 *   "[EXAMPLE] ..."  text we wrote as a stand-in (reviews, group size, kids' age, calendar link).
 *   "[CONFIRM] ..."  a real detail she has not approved for the site yet (her phone, her email).
 * Photos in /media/placeholder/ count as examples too. On a preview both render with a small tag;
 * on the live site there are none left, the gate makes sure of it.
 */
export const EXAMPLE = "[EXAMPLE]";
export const CONFIRM = "[CONFIRM]";
export type Mark = "example" | "confirm" | null;

export interface Cell { label: string; value: string }
export interface Item { title: string; text: string }
/** One step of "Pick your format": a question and the two choices. */
export interface FormatStep { title: string; options: Item[] }
export interface Faq { q: string; a: string }
export interface Link { label: string; href: string }
export interface Review { quote: string; name: string; detail: string }
export interface Stat { value: string; text: string }
export interface Price { label: string; price: string; note: string }

export interface SiteContent {
  brandName: string;
  tagline: string;
  liveOrigin: string;
  gaId: string;
  teacher: { name: string; firstName: string; role: string };
  contact: { email: string; phone: string; area: string; instagram: string };
  links: { booking: string; whatsapp: string; video: string };
  nav: Link[];
  footerNav: Link[];
  footerLine: string;
  buttons: { book: string; bookShort: string; whatsapp: string; message: string };
  cta: { label: string; title: string; text: string; fine: string };
  rhythm: string;
  formats: FormatStep[];
  formatsNote: string;
  levels: Item[];
  levelsText: string;
  ages: Item[];
  stats: Stat[];
  reviews: Review[];
  showPrices: boolean;
  prices: Price[];
}

export interface Hero {
  issue: string[];
  title: string;
  lede: string;
  primary: string;
  secondary?: Link;
  image?: string;
  imageAlt?: string;
  bar?: Cell[];
}

export interface Chapter {
  id?: string;
  kicker: string;
  heading: string;
  body: string;
  list?: string[];
  image?: string;
  imageAlt?: string;
  /** A second, smaller photo: the chapter then uses the About collage (with signature and video). */
  image2?: string;
  image2Alt?: string;
  signature?: boolean;
  video?: boolean;
  button?: Link;
}

export interface Band {
  show: boolean;
  label: string;
  quote: string;
  accent: string;
  lead: string;
  reasons: string[];
  image?: string;
  imageAlt?: string;
}

/** One page of the "Pages" collection: content/pages/<url>.json is served at /<url>/. */
export interface PageContent {
  title: string;
  summary: string;
  listed: boolean;
  service: boolean;
  metaTitle: string;
  metaDescription: string;
  hero: Hero;
  intro?: { kicker: string; text: string };
  audience?: { kicker: string; heading: string; text: string; items: (Item & { link?: Link })[] };
  chapters?: Chapter[];
  lessons?: { show: boolean; kicker: string; heading: string; note: string; image?: string; imageAlt?: string };
  band?: Band;
  levels?: { show: boolean; heading?: string; text?: string };
  stats?: boolean;
  reviews?: { show: boolean; kicker?: string };
  faq?: { kicker: string; heading: string; items: Faq[] };
}

const ROOT = join(process.cwd(), "content");

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8")) as T;
}

export const site: SiteContent = readJson<SiteContent>("site.json");

/** The homepage and contact page have their own shapes; read them as loose JSON. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function file<T = any>(rel: string): T {
  return readJson<T>(rel);
}

/** Every page in content/pages/, by URL. */
export function pageSlugs(): string[] {
  const dir = join(ROOT, "pages");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
}

export function page(slug: string): PageContent {
  return readJson<PageContent>(`pages/${slug}.json`);
}

/** Split a string into its text and its marker, if any. */
export function parse(s: string | undefined | null): { text: string; mark: Mark } {
  const v = (s ?? "").trim();
  if (v.startsWith(EXAMPLE)) return { text: v.slice(EXAMPLE.length).trim(), mark: "example" };
  if (v.startsWith(CONFIRM)) return { text: v.slice(CONFIRM.length).trim(), mark: "confirm" };
  return { text: v, mark: null };
}

/** Plain text with the marker and the *emphasis* stars removed, for <title>, meta and schema. */
export const plain = (s: string | undefined | null): string =>
  parse(s).text.replace(/\*([^*]+)\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s*\n\s*/g, " ");

/** A value that is real and approved: set, and carrying no marker. */
export const ready = (s: string | undefined | null): boolean => {
  const p = parse(s);
  return p.text !== "" && p.mark === null;
};

/** Photos the client has not replaced yet live in /media/placeholder/. */
export const isPlaceholder = (src: string | undefined | null): boolean => /\/placeholder\//.test(parse(src).text);

/** Paragraphs: blank lines separate them. A marker on the first applies to all; a marker on one applies to that one. */
export function paragraphs(s: string | undefined | null): { text: string; mark: Mark }[] {
  const whole = parse(s);
  return whole.text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => {
    const own = parse(p);
    return { text: own.text, mark: whole.mark ?? own.mark };
  });
}
