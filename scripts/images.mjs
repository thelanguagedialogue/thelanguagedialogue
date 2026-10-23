// Runs before `next build`. Photos uploaded through the editor land in public/media/ at whatever
// size the phone produced (often 4000px and several MB). The site is a static export, so there is
// no image server: this script makes the smaller copies once, at build time.
//
// For every jpg/png/webp under public/media/ it writes WebP copies at a few widths to
// public/_img/<same path>-<width>.webp and a manifest (src/generated/images.json) with the
// original size and the copies. components/Img.tsx reads the manifest to write srcset, width and
// height, so phones download a small file and the layout does not jump while photos load.
// Copies that already exist and are newer than the original are kept, so rebuilds stay fast.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MEDIA = join(ROOT, "public", "media");
const OUT = join(ROOT, "public", "_img");
const MANIFEST = join(ROOT, "src", "generated", "images.json");
const WIDTHS = [480, 800, 1200, 1600, 2000];
const MAX = 2400;
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (EXT.has(extname(name).toLowerCase())) acc.push(full);
  }
  return acc;
}

const manifest = {};
let made = 0;
for (const file of walk(MEDIA)) {
  const rel = relative(join(ROOT, "public"), file).split(sep).join("/"); // media/placeholder/x.jpg
  const meta = await sharp(file).rotate().metadata();
  // .rotate() honours the phone's EXIF orientation; swap the sides when the photo is turned
  const turned = (meta.orientation ?? 1) >= 5;
  const w = turned ? meta.height : meta.width;
  const h = turned ? meta.width : meta.height;
  const widths = [...new Set([...WIDTHS.filter((x) => x < w), Math.min(w, MAX)])].sort((a, b) => a - b);
  const base = rel.replace(/^media\//, "").replace(/\.[^.]+$/, "");
  const variants = [];
  for (const vw of widths) {
    const target = join(OUT, `${base}-${vw}.webp`);
    if (!existsSync(target) || statSync(target).mtimeMs < statSync(file).mtimeMs) {
      mkdirSync(dirname(target), { recursive: true });
      await sharp(file).rotate().resize({ width: vw, withoutEnlargement: true }).webp({ quality: 74 }).toFile(target);
      made++;
    }
    variants.push([vw, `/_img/${base}-${vw}.webp`]);
  }
  manifest[`/${rel}`] = { w, h, variants };
}

mkdirSync(dirname(MANIFEST), { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`images: ${Object.keys(manifest).length} photo(s), ${made} new size(s) written`);
