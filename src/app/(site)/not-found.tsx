/**
 * 404 for the public site.
 *
 * Reached whenever a page calls `notFound()` — an unknown blog slug, a job that
 * has since been closed, a story that was unpublished. Those are ordinary
 * states in a CMS-driven site, not faults, so this reads as a wrong turn rather
 * than a breakage and points at the sections most likely to have been wanted.
 */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 in the index is a 404 in the search results.
  robots: { index: false, follow: true },
};

const DESTINATIONS = [
  { href: "/solutions", label: "Solutions", hint: "Every capability, end to end" },
  { href: "/impact", label: "Proof of Work", hint: "Real outcomes for real clients" },
  { href: "/blog", label: "Insights", hint: "Engineering notes and perspective" },
  { href: "/careers", label: "Careers", hint: "Open roles at Sumago" },
];

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-6xl font-bold text-brand/25">404</p>
      <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
        That page isn&apos;t here.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink/65">
        It may have moved, or the role or article you were looking for may have closed.
      </p>

      <ul className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {DESTINATIONS.map((destination) => (
          <li key={destination.href}>
            <Link
              href={destination.href}
              className="flex h-full flex-col rounded-xl border border-line bg-paper p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30"
            >
              <span className="text-sm font-semibold text-ink">{destination.label}</span>
              <span className="mt-1 text-xs leading-relaxed text-ink/55">{destination.hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-ink/55">
        Still stuck?{" "}
        <Link
          href="/contact"
          className="font-semibold text-brand-ink underline-offset-4 hover:underline"
        >
          Talk to us
        </Link>
        .
      </p>
    </section>
  );
}
