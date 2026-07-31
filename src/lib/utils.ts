import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** URL-friendly slug from a label, e.g. "Cloud & DevOps" -> "cloud-devops". */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Round a computed geometry value before it reaches the DOM.
 *
 * `Math.sin`/`cos`/`sqrt`-derived numbers are not guaranteed to be identical
 * across JS engines — Node and the browser can disagree in the last few ULPs
 * (e.g. `43.708348754011496` vs `43.7083487540115`). React serialises the raw
 * double into the SSR markup, so any such value used as an SVG coordinate,
 * stroke width, or opacity shows up as a hydration mismatch. Rounding to three
 * decimals is far below sub-pixel visibility and makes both sides agree.
 */
export function svgNum(value: number, decimals = 3) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Title-case a slug back to readable text, e.g. "cloud-devops" -> "Cloud Devops". */
export function unslug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
