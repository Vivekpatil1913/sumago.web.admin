/**
 * Derive the site's imagery from the master photography.
 *
 *   node scripts/build-image-assets.mjs
 *
 * Reads `assets-source/` (untracked — the raw camera and WhatsApp originals,
 * hundreds of MB) and writes optimised webp into `public/images/`, following
 * the curated cut in `image-manifest.mjs`. Re-runnable: it overwrites, so
 * editing the manifest and running it again is the whole workflow.
 *
 * Every original is oriented from its EXIF, resized to the largest size its
 * slot ever displays, and encoded once. Nothing is upscaled — a source smaller
 * than its target is emitted at its own size, and the log says so.
 *
 * The log is the audit trail: it prints `<source file> → <output>` for each
 * asset, which is how you check that a manifest position still points at the
 * photograph you intended.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { groups } from "./image-manifest.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_ROOT = path.join(ROOT, "assets-source");
const OUT_ROOT = path.join(ROOT, "public", "images");

const IMAGE = /\.(jpe?g|png|webp)$/i;

/** Images in a folder, sorted by filename — the order manifest positions index. */
const listCache = new Map();
function listImages(folder) {
  if (!listCache.has(folder)) {
    const dir = path.join(SRC_ROOT, folder);
    if (!fs.existsSync(dir)) throw new Error(`Source folder missing: ${folder}`);
    listCache.set(
      folder,
      fs
        .readdirSync(dir)
        .filter((name) => IMAGE.test(name))
        .sort((a, b) => a.localeCompare(b)),
    );
  }
  return listCache.get(folder);
}

let written = 0;
let bytes = 0;
const failures = [];

for (const group of groups) {
  const outDir = path.join(OUT_ROOT, group.dir);
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`\n${group.dir}/  (${group.width}px)`);

  for (const [folder, position, name, alt] of group.entries) {
    const files = listImages(folder);
    const file = files[position - 1];
    if (!file) {
      failures.push(`${folder}#${position} → no file at that position (${files.length} present)`);
      continue;
    }

    const from = path.join(SRC_ROOT, folder, file);
    const to = path.join(outDir, `${name}.webp`);
    try {
      const image = sharp(from, { failOn: "none" }).rotate();
      const { width } = await image.metadata();
      // `withoutEnlargement` keeps a small original at its own size rather
      // than inventing pixels; the log flags it so it can be re-shot.
      const info = await image
        .resize({ width: group.width, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(to);

      written += 1;
      bytes += info.size;
      const short = width < group.width ? `  [source only ${width}px]` : "";
      console.log(
        `  ${String(position).padStart(3)}  ${file}  →  ${name}.webp  ` +
          `${info.width}×${info.height}  ${(info.size / 1024).toFixed(0)}KB${short}`,
      );
      if (!alt || !alt.trim()) failures.push(`${group.dir}/${name} has no alt text`);
    } catch (error) {
      failures.push(`${folder}/${file} → ${error.message}`);
    }
  }
}

console.log(
  `\n${written} images written, ${(bytes / 1024 / 1024).toFixed(1)}MB total in public/images/`,
);

if (failures.length > 0) {
  console.error(`\n${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
}
