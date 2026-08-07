/**
 * On-demand cache purge, called by the admin API after a publish.
 *
 * Without it, an editor publishes a post and then watches an unchanged page for
 * up to a minute wondering whether it saved. The API posts here the moment a
 * record's live state changes and the affected tag is dropped, so the next
 * request rebuilds from the database.
 *
 * The 60-second `revalidate` on each fetch stays as the backstop: if this
 * endpoint is unreachable, or the secret is misconfigured, content still goes
 * live on its own. A purge failure must never mean stale-forever.
 *
 * ## Why this route is under /api and still reachable
 *
 * `next.config.ts` rewrites `/api/:path*` to the Express API — but a rewrite
 * only applies where Next has no route of its own, and this file is one. So
 * `/api/revalidate` is served here while everything else still proxies through.
 */
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Shared secret. Purging is cheap but not free — an open endpoint lets anyone
 * force every page to re-render on demand, which is a denial-of-service with
 * extra steps. Set `REVALIDATE_SECRET` in both this app and the API.
 */
const SECRET = process.env.REVALIDATE_SECRET;

/** Only tags the site actually uses; anything else is a caller mistake. */
const KNOWN_MODULES = new Set([
  "blog",
  "success-stories",
  "innovation",
  "innovation-outcomes",
  "offices",
  "contact-phones",
  "contact-emails",
  "social-links",
  "settings",
  "navigation",
  "jobs",
  "services",
  "industries",
  "testimonials",
  "clients",
  "leadership",
  "awards",
  "faqs",
  "legal-pages",
]);

/**
 * The site bundle: settings, navigation, offices, phones, emails and social
 * links all arrive in one `/settings` response, so changing any of them has to
 * purge that shared tag as well as the module's own.
 */
const BUNDLE_MEMBERS = new Set([
  "settings",
  "navigation",
  "offices",
  "contact-phones",
  "contact-emails",
  "social-links",
]);

export async function POST(request: Request): Promise<NextResponse> {
  if (!SECRET) {
    // Refuse rather than run unauthenticated — a missing secret is a
    // deployment mistake, and guessing that it is safe would be the wrong call.
    console.error("[revalidate] REVALIDATE_SECRET is not set; refusing to purge");
    return NextResponse.json(
      { error: { message: "Revalidation is not configured." } },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret");
  if (provided !== SECRET) {
    // No detail about which part was wrong.
    return NextResponse.json({ error: { message: "Not authorised." } }, { status: 401 });
  }

  let moduleKey: string;
  try {
    const body = (await request.json()) as { module?: unknown };
    moduleKey = String(body.module ?? "");
  } catch {
    return NextResponse.json(
      { error: { message: "Expected a JSON body with a `module` key." } },
      { status: 400 },
    );
  }

  if (!KNOWN_MODULES.has(moduleKey)) {
    return NextResponse.json(
      { error: { message: `"${moduleKey}" is not a module the website caches.` } },
      { status: 400 },
    );
  }

  const purged = [`cms:${moduleKey}`];
  if (BUNDLE_MEMBERS.has(moduleKey)) purged.push("cms:site");

  /*
   * `"max"` is the widest cache profile, so every entry carrying the tag is
   * expired regardless of the lifetime it was written with — which is what a
   * purge means. (`updateTag`, the immediate-expiry variant, throws outside a
   * Server Action, so it is not available in a Route Handler.)
   */
  for (const tag of purged) revalidateTag(tag, "max");

  console.info(`[revalidate] purged ${purged.join(", ")}`);
  return NextResponse.json({ data: { revalidated: purged } });
}

/** A GET here is almost always someone checking the wiring by hand. */
export function GET(): NextResponse {
  return NextResponse.json(
    { error: { message: "Use POST with an x-revalidate-secret header." } },
    { status: 405 },
  );
}
