/**
 * Schema.org structured data.
 *
 * Now that offices, jobs, articles and case studies live in a database, the
 * markup search engines read can be generated from the same records the page
 * renders — so it cannot drift from what a visitor sees, which is the usual way
 * structured data turns into a penalty rather than a rich result.
 *
 * ## Why the script tag is written this way
 *
 * `dangerouslySetInnerHTML` is required — React escapes text children, and an
 * escaped `&quot;` inside a JSON-LD block makes it unparseable. That means the
 * payload has to be safe by construction, so `serialise` below closes the one
 * hole this pattern has: a `</script>` sequence inside any CMS string would end
 * the block early and let the rest of the value parse as markup.
 */

/**
 * JSON, escaped so it cannot break out of a <script> element.
 *
 * `<` is the only character that matters: `<` is valid JSON and parses
 * back to the same string, so the data is unchanged while `</script>`,
 * `<!--` and `<script` can no longer terminate or reopen the block.
 */
function serialise(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Required for JSON-LD: React escapes text children, which would make
      // the block unparseable. `serialise` above is what makes this safe.
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  );
}

/** Drop null/undefined/empty entries so the output carries no empty keys. */
export function compact<T extends Record<string, unknown>>(object: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}
