import { Fragment } from "react";

/**
 * The two string conventions that let CMS-authored copy carry structure without
 * carrying JSX (see lib/service-page-copy.ts):
 *
 *   `{token}`     — interpolated from the values passed in
 *   `*emphasis*`  — rendered as the brushed-metal red accent
 *
 * Both are deliberately simple: an editor can type them in a plain text field,
 * and nothing in the pipeline has to sanitise HTML.
 */

/** Replace `{token}` occurrences. Unknown tokens are left untouched. */
export function fillTokens(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}

/**
 * Split on `*emphasis*` and wrap those runs in the metal-red accent.
 * `dark` swaps in the shine variant, which is what reads on dark bands.
 */
export function emphasize(text: string, tone: "light" | "dark" = "light") {
  const accent = tone === "dark" ? "text-metal-red-shine" : "text-metal-red";
  return text.split(/(\*[^*]+\*)/g).map((part, i) => {
    if (!part) return null;
    const isAccent = part.length > 2 && part.startsWith("*") && part.endsWith("*");
    return isAccent ? (
      <span key={i} className={accent}>
        {part.slice(1, -1)}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    );
  });
}

/** Tokens first, then emphasis — the order copy is authored in. */
export function renderCopy(
  text: string,
  values: Record<string, string> = {},
  tone: "light" | "dark" = "light",
) {
  return emphasize(fillTokens(text, values), tone);
}
