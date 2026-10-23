// Writes out/sitemap.xml from the static export, after `next build`.
// Every index.html in out/ becomes one URL, except /404/, /_next/, /thanks/ and any page whose
// HTML carries a noindex robots meta. On a preview every page is noindex, so the sitemap is
// empty there, which is what we want: nothing on a preview URL should ever be submitted.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));
const site = JSON.parse(readFileSync(new URL("../content/site.json", import.meta.url), "utf8"));
const ORIGIN = (process.env.SITE_URL || process.env.URL || site.liveOrigin || "").replace(/\/$/, "");
const EXCLUDE = [/^\/404\//, /^\/_next\//, /^\/thanks\//];

if (!existsSync(OUT)) { console.error("sitemap: out/ not found, run `next build` first"); process.exit(1); }

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (name === "index.html") acc.push(full);
  }
  return acc;
}

const urls = [];
for (const file of walk(OUT)) {
  const path = "/" + relative(OUT, file).split(sep).slice(0, -1).join("/");
  const route = path === "/" ? "/" : path + "/";
  if (EXCLUDE.some((re) => re.test(route))) continue;
  const html = readFileSync(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) continue;
  urls.push(route);
}
urls.sort();

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`).join("\n") + `\n</urlset>\n`;
writeFileSync(join(OUT, "sitemap.xml"), xml);
console.log(`sitemap: ${urls.length} URL(s) on ${ORIGIN || "(no origin)"}`);
