/**
 * Server-side read client for the admin API.
 *
 * Only ever runs on the server (React Server Components, `generateMetadata`,
 * `generateStaticParams`), so it talks to the Express API *directly* rather
 * than through the Next rewrite at `/api/*`. A rewrite needs an absolute origin
 * to fetch from and would make the app call itself on every render.
 *
 * ## Why every read has a fallback
 *
 * The website must render whether or not the API is reachable. A marketing site
 * that 500s because a database is restarting is worse than one showing slightly
 * stale copy, and `next build` has to succeed on a machine where the API is not
 * running at all. So each accessor takes the last-known-good static content in
 * `src/lib/*` as its fallback: the API is the source of truth when it answers,
 * and the committed content is what the visitor sees when it does not.
 *
 * Removing a fallback is a deliberate decision to let a page fail, not a
 * cleanup.
 *
 * `ADMIN_API_ORIGIN` has no `NEXT_PUBLIC_` prefix, so it is undefined in the
 * browser — importing this module from a Client Component would silently point
 * every read at localhost. Keep the imports in Server Components.
 */

const API_ORIGIN = process.env.ADMIN_API_ORIGIN ?? "http://localhost:4000";

/**
 * How long a published-content response stays fresh. Editors expect a change to
 * appear "in about a minute", not instantly — matching the `s-maxage` the API
 * sets on the same responses. Publishing through the admin panel also purges
 * the affected tag immediately (see `app/api/revalidate`), so this is the
 * backstop rather than the usual path.
 */
export const CONTENT_REVALIDATE_SECONDS = 60;

/**
 * Give up on a request after this long.
 *
 * Without a timeout, an API that accepts the connection and then stalls — a
 * saturated connection pool, a hung query, a half-open socket after a network
 * blip — holds the render open until the platform's own limit kills the whole
 * page. A slow API must degrade to the fallback, not take the page down with
 * it. Four seconds is well past a healthy p99 and well inside any sane
 * server-render budget.
 */
const REQUEST_TIMEOUT_MS = 4_000;

/**
 * One retry, for transient failures only.
 *
 * A dropped connection or a 502 from a restarting API is worth trying again;
 * a 404 or a validation error is not, and retrying it just doubles the latency
 * before the same answer. The delay is short because it is spending a
 * visitor's render time.
 */
const RETRY_DELAY_MS = 150;

interface FetchOptions {
  /** Override the default revalidation window. */
  revalidate?: number;
  /** Cache tag, so a publish can purge one module without purging the site. */
  tags?: string[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Worth a second attempt: the request never got a real answer. */
function isTransient(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

interface Attempt<T> {
  data: T | null;
  /** Set when the attempt failed in a way that a retry might fix. */
  retryable: boolean;
  reason?: string;
}

async function attempt<T>(url: string, options: FetchOptions): Promise<Attempt<T>> {
  /*
   * AbortSignal.timeout() rather than a manual AbortController: it needs no
   * clearTimeout, so a slow response cannot leave a dangling timer holding the
   * event loop open during a build.
   */
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: {
        revalidate: options.revalidate ?? CONTENT_REVALIDATE_SECONDS,
        ...(options.tags ? { tags: options.tags } : {}),
      },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        data: null,
        retryable: isTransient(response.status),
        reason: `HTTP ${response.status}`,
      };
    }

    // A 200 carrying HTML — a proxy error page, a login redirect — would throw
    // inside .json() and read as a hard failure. Treat it as one, but say so.
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return { data: null, retryable: false, reason: `unexpected content-type "${contentType}"` };
    }

    const payload = (await response.json()) as { data?: T };
    return { data: payload.data ?? null, retryable: false };
  } catch (error) {
    const cause = error as Error;
    const reason =
      cause.name === "TimeoutError" || cause.name === "AbortError"
        ? `timed out after ${REQUEST_TIMEOUT_MS}ms`
        : cause.message;
    // Network-level failures are exactly the case a retry exists for.
    return { data: null, retryable: true, reason };
  }
}

/**
 * GET a public endpoint. Returns `null` on any failure — an unreachable API, a
 * non-2xx, malformed JSON — so callers can fall back rather than throw. The
 * failure is logged once on the server; it is never surfaced to the visitor.
 */
async function getJson<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  const url = `${API_ORIGIN}/api/public${path}`;

  let result = await attempt<T>(url, options);

  if (result.data === null && result.retryable) {
    await sleep(RETRY_DELAY_MS);
    result = await attempt<T>(url, options);
  }

  if (result.data === null && result.reason) {
    // A 404 is a legitimate answer for a slug lookup, not a fault worth logging.
    if (result.reason !== "HTTP 404") {
      console.warn(`[cms] ${path} failed (${result.reason}); using fallback content`);
    }
  }

  return result.data;
}

/** The cache tag for a module, so a publish can purge exactly what changed. */
export function cacheTag(moduleKey: string): string {
  return `cms:${moduleKey}`;
}

/** A list of published records from one module. */
export async function getContent<T>(
  moduleKey: string,
  options: FetchOptions & { limit?: number } = {},
): Promise<T[] | null> {
  const query = options.limit ? `?limit=${options.limit}` : "";
  const rows = await getJson<T[]>(`/content/${moduleKey}${query}`, {
    ...options,
    tags: options.tags ?? [cacheTag(moduleKey)],
  });

  /*
   * An empty array from a module that should have content usually means the
   * records are still drafts. Treat it as "nothing published" (a real answer),
   * not as a failure — callers decide whether to fall back on empty.
   *
   * A malformed payload is a different matter: if the API ever answers with an
   * object where a list belongs, returning it would push the type error down
   * into a `.map()` inside a template. Fail here instead.
   */
  if (rows !== null && !Array.isArray(rows)) {
    console.warn(`[cms] /content/${moduleKey} returned a non-list; using fallback content`);
    return null;
  }
  return rows;
}

/** One published record by slug, or `null` if it is not published. */
export async function getContentBySlug<T>(
  moduleKey: string,
  slug: string,
  options: FetchOptions = {},
): Promise<T | null> {
  return getJson<T>(`/content/${moduleKey}/${encodeURIComponent(slug)}`, {
    ...options,
    tags: options.tags ?? [cacheTag(moduleKey)],
  });
}

export { getJson };
