"use client";

/**
 * Public-site error boundary.
 *
 * Catches anything a page throws during render — a malformed CMS payload that
 * slipped past the client's guards, a template reading a field that turned out
 * null. The CMS layer already falls back rather than throwing, so reaching here
 * means something genuinely unexpected happened.
 *
 * Two rules for this screen:
 *
 *  1. **Never show the error.** `error.message` can carry a database detail, a
 *     file path, or an internal hostname. The visitor gets a plain apology; the
 *     detail goes to the server log and to `digest`, which is the id to search
 *     for in production.
 *  2. **Always leave a way forward.** A dead end costs the conversion the page
 *     existed for, so this offers a retry, the home page, and a way to reach a
 *     human — the last of which is the whole point of the site.
 *
 * Site chrome (header/footer) stays mounted: this replaces the page body, not
 * the layout, so the visitor can still navigate.
 */
import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side render errors never reach the server log on their own.
    console.error("[site] render error", error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-ink">
        Something went wrong
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
        This page didn&apos;t load properly.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink/65">
        A temporary problem on our side, not yours. Trying again usually fixes it.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <RefreshCw size={16} strokeWidth={2.5} aria-hidden />
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-ink"
        >
          Back to home
        </Link>
      </div>

      <p className="mt-8 text-sm text-ink/65">
        Need to reach someone?{" "}
        <Link
          href="/contact"
          className="font-semibold text-brand-ink underline-offset-4 hover:underline"
        >
          Get in touch
        </Link>
        .
      </p>

      {/* The only identifier worth showing: it is what support would ask for,
          and it reveals nothing about the failure itself. */}
      {error.digest ? (
        <p className="mt-6 font-mono text-xs text-ink/65">Reference: {error.digest}</p>
      ) : null}
    </section>
  );
}
