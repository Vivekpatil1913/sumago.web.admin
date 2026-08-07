/**
 * Formatting shared by the CMS-driven pages.
 *
 * Safe to import from Client Components — nothing here touches the API or an
 * environment variable.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Format an ISO date without `toLocaleDateString`.
 *
 * The server and the browser can sit in different locales and time zones, so a
 * locale-aware formatter renders one string during SSR and a different one on
 * hydration — React then discards the markup and warns. Parsing the string
 * ourselves gives the same output everywhere.
 *
 * Accepts a plain `YYYY-MM-DD` or a full timestamp; anything unparseable comes
 * back as the empty string rather than "Invalid Date".
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return "";
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return "";
  return `${name} ${Number(day)}, ${year}`;
}

/**
 * Split rich text into paragraphs for rendering.
 *
 * The body field stores plain text with blank lines between paragraphs. This
 * returns text, never HTML, so nothing authored in the admin panel can inject
 * markup into the page — the values go through React as strings and are
 * escaped like any other.
 */
export function toParagraphs(body: string | null | undefined): string[] {
  if (!body) return [];
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Strip spaces so a number works in a `tel:` href. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[\s()-]/g, "")}`;
}

/**
 * Look up a verified metric by its label.
 *
 * Metrics are editable in General Settings, so the labels this site asks for
 * are a convention, not a guarantee. The previous code used
 * `metrics.find(…)!.value` against a hardcoded list — safe while the list was
 * a `const`, a crash the moment an editor renames "Years" to "Years in
 * business". Returning the fallback instead means a renamed metric leaves a
 * gap in the copy rather than a 500 on the home page.
 *
 * Matching is case-insensitive and ignores surrounding spaces, which absorbs
 * the most common way a label drifts.
 */
export function metricValue(
  metrics: { value: string; label: string }[],
  label: string,
  fallback = "",
): string {
  const wanted = label.trim().toLowerCase();
  return metrics.find((metric) => metric.label.trim().toLowerCase() === wanted)?.value ?? fallback;
}

/** Metrics whose label ends in a given word, e.g. every "… clients" figure. */
export function metricsEndingIn(
  metrics: { value: string; label: string }[],
  suffix: string,
): { value: string; label: string }[] {
  const wanted = suffix.trim().toLowerCase();
  return metrics.filter((metric) => metric.label.trim().toLowerCase().endsWith(wanted));
}

/**
 * Estimate reading time when an editor has not set one. 200 words a minute is
 * the usual figure for prose on screen.
 */
export function estimateReadingTime(body: string | null | undefined): string {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
