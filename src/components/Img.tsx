import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { parse, plain, isPlaceholder } from "@/lib/content";
import { IS_LIVE } from "@/lib/site";

/**
 * A photo from content/. scripts/images.mjs makes WebP copies at several widths before the build
 * and lists them in src/generated/images.json; this component turns that into srcset, width and
 * height. A photo the script has not seen (an outside URL, an SVG) is used as is.
 */
type Entry = { w: number; h: number; variants: [number, string][] };
let manifest: Record<string, Entry> | null = null;
function lookup(src: string): Entry | undefined {
  if (!manifest) {
    const f = join(process.cwd(), "src", "generated", "images.json");
    manifest = existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {};
  }
  return manifest![src];
}

/** Portrait photos sit in a 4:5 frame, landscape ones in 3:2. */
export function frameRatio(src: string | undefined): string {
  const m = src ? lookup(parse(src).text) : undefined;
  return m && m.h > m.w ? "4 / 5" : "3 / 2";
}

/** "placeholder photo" label on previews, from the concept. */
export const ph = (src: string | undefined) => (!IS_LIVE && isPlaceholder(src) ? " ph" : "");

export function Img({ src, alt, sizes = "100vw", priority = false, speed, style, className }: {
  src: string | undefined;
  alt: string | undefined;
  sizes?: string;
  priority?: boolean;
  speed?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const url = parse(src).text;
  if (!url) return null;
  const m = lookup(url);
  const srcSet = m?.variants.map(([w, u]) => `${u} ${w}w`).join(", ");
  // No react-dom preload() here on purpose: Next prefetches linked pages, and their preload hints
  // would make every page download the other pages' cover photos. The cover <img> is in the HTML
  // with fetchpriority="high", which the browser picks up just as early.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={plain(alt)}
      width={m?.w}
      height={m?.h}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      data-speed={speed}
      style={style}
      className={className}
    />
  );
}
