import type { Metadata } from "next";
import { site } from "./content";

/**
 * Which site this build is. The live domain is set in content/site.json (liveOrigin) once
 * the client has bought it. Until then every build is a preview: noindex on every page,
 * robots.txt disallows everything, and example content is allowed to render.
 *
 * Netlify sets URL to the site's own address at build time; SITE_URL can override it by
 * hand. IS_LIVE needs both the production context and the live origin, so a deploy
 * preview built after the domain is attached still cannot call itself live.
 */
export const LIVE_ORIGIN = (site.liveOrigin || "").replace(/\/$/, "");

const declared = (process.env.SITE_URL ?? "").replace(/\/$/, "");
const deploy = declared || (process.env.URL ?? "").replace(/\/$/, "");

export const IS_LIVE =
  process.env.BUILD_CONTEXT === "production" && LIVE_ORIGIN !== "" && deploy === LIVE_ORIGIN;

/** The origin this build serves from: canonicals, sitemap, social cards. */
export const ORIGIN = deploy || LIVE_ORIGIN || "http://localhost:3000";

type Robots = Exclude<NonNullable<Metadata["robots"]>, string>;

/** Pages call this instead of writing a robots object: a preview is always noindex. */
export function robotsFor(index: boolean): Robots {
  if (!IS_LIVE) return { index: false, follow: false, nocache: true };
  if (!index) return { index: false, follow: true };
  return { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 };
}

export function absoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}
