// Counts what is still not final in content/:
//   [EXAMPLE]            text we wrote as a stand-in (reviews, group size, kids' age, calendar link)
//   [CONFIRM]            a real detail the client has not approved for the site yet (phone, email)
//   /media/placeholder/  a stand-in photo
// A live build (production context on the live domain) fails while any remain, so placeholder
// copy, unapproved contact details or stock photos can never ship. Any other build prints the
// count and carries on.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../content/", import.meta.url));
const site = JSON.parse(readFileSync(join(ROOT, "site.json"), "utf8"));
const liveOrigin = (site.liveOrigin || "").replace(/\/$/, "");
const declared = (process.env.SITE_URL || "").replace(/\/$/, "");
const deploy = declared || (process.env.URL || "").replace(/\/$/, "");
const isLive = (process.env.CONTEXT || process.env.BUILD_CONTEXT) === "production" && liveOrigin !== "" && deploy === liveOrigin;

const KINDS = [
  ["example text", /\[EXAMPLE\]/g],
  ["to confirm", /\[CONFIRM\]/g],
  ["placeholder photo", /\/media\/placeholder\//g],
];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc); else if (name.endsWith(".json")) acc.push(full);
  }
  return acc;
}

const hits = [];
const totals = Object.fromEntries(KINDS.map(([k]) => [k, 0]));
for (const f of walk(ROOT)) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    for (const [kind, re] of KINDS) {
      const n = (line.match(re) || []).length;
      if (n) { totals[kind] += n; hits.push(`${relative(ROOT, f)}:${i + 1}  ${kind}`); }
    }
  });
}

const summary = Object.entries(totals).map(([k, n]) => `${n} ${k}`).join(", ");
if (hits.length === 0) {
  console.log("example-gate: nothing left to replace");
} else if (isLive) {
  console.error(`example-gate: refusing a live build, still in content/: ${summary}\n  ${hits.join("\n  ")}`);
  process.exit(1);
} else {
  console.log(`example-gate: ${summary} (allowed on a preview; a live build stops here)`);
}
