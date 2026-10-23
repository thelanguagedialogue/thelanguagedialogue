// Counts "[EXAMPLE]" markers left in content/. A live build (production context on the live
// domain) fails while any remain, so placeholder prices, quotes or photos can never ship.
// Any other build prints the count and carries on.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
const site = JSON.parse(readFileSync(join(ROOT, "site.json"), "utf8"));
const liveOrigin = (site.liveOrigin || "").replace(/\/$/, "");
const declared = (process.env.SITE_URL || "").replace(/\/$/, "");
const deploy = declared || (process.env.URL || "").replace(/\/$/, "");
const isLive = (process.env.CONTEXT || process.env.BUILD_CONTEXT) === "production" && liveOrigin !== "" && deploy === liveOrigin;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc); else acc.push(full);
  }
  return acc;
}

const hits = [];
for (const f of walk(ROOT)) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => { if (l.includes("[EXAMPLE]")) hits.push(`${relative(ROOT, f)}:${i + 1}`); });
}

if (hits.length === 0) {
  console.log("example-gate: no example content left");
} else if (isLive) {
  console.error(`example-gate: ${hits.length} example marker(s) still in content/, refusing a live build:\n  ${hits.join("\n  ")}`);
  process.exit(1);
} else {
  console.log(`example-gate: ${hits.length} example marker(s) in content/ (allowed on a preview)`);
}
