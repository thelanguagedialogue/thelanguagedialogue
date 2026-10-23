import type { MetadataRoute } from "next";
import { IS_LIVE, ORIGIN } from "@/lib/site";

export const dynamic = "force-static";

/** A preview must not be crawled. The live site allows everything and names its sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (!IS_LIVE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${ORIGIN}/sitemap.xml`, host: ORIGIN };
}
