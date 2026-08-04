import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/atoms/logo";
import { company, primaryCta, industries } from "@/lib/site";
import { brands } from "@/lib/brands";
import { services } from "@/lib/services";
import { slugify } from "@/lib/utils";

/**
 * Accreditation marks shown in the footer. Placeholder artwork lives in
 * /public/certifications — [REAL ASSET NEEDED]: swap for the official licensed
 * ISO and CMMI logos before launch.
 */
const CERT_LOGOS = [
  { src: "/certifications/iso-9001-2015.svg", alt: "ISO 9001:2015 certified", width: 460, height: 430 },
  { src: "/certifications/cmmi-level-5.svg", alt: "CMMI Maturity Level 5", width: 300, height: 150 },
];

/** Footer navigation, grouped into link columns. */
const FOOTER_NAV: {
  heading: string;
  /** If set, the heading itself links here (its index / "all" page). */
  href?: string;
  links: { label: string; href: string; badge?: string }[];
  /** Flow the list into two sub-columns (for long lists like all services). */
  twoCol?: boolean;
}[] = [
  {
    heading: "Who We Are",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our team", href: "/team" },
      { label: "Life at Sumago", href: "/life-at-sumago" },
      { label: "Careers", href: "/careers", badge: "We're hiring!" },
    ],
  },
  {
    heading: "Our Services",
    href: "/solutions",
    twoCol: true,
    // Every service, linked to its detail page — driven by lib/services.ts.
    links: services.map((s) => ({ label: s.name, href: `/solutions/${s.slug}` })),
  },
  {
    heading: "Industries",
    href: "/industries",
    // Every industry, linked to its detail page — driven by lib/site.ts.
    links: industries
      .filter((i) => i !== "Professional Services")
      .map((i) => ({ label: i, href: `/industries/${slugify(i)}` })),
  },
  {
    heading: "Our Work",
    links: [
      { label: "How we deliver", href: "/how-we-deliver" },
      { label: "Proof of Work", href: "/impact" },
      { label: "Innovations", href: "/innovation" },
      { label: "Blogs", href: "/blog" },
    ],
  },
];

/** Inline brand glyphs (lucide v1 dropped brand logos). 24×24 viewBox paths. */
const SOCIAL_PATHS: Record<string, string> = {
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  Instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  Facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

/** A single footer link column (heading + list). Long lists flow into columns. */
function NavGroup({ group }: { group: (typeof FOOTER_NAV)[number] }) {
  const headingClass =
    "text-sm font-semibold uppercase tracking-wider text-white/90 md:text-base";
  return (
    <div data-aos="fade-up">
      {group.href ? (
        <Link href={group.href} className={`${headingClass} transition-colors hover:text-white`}>
          {group.heading}
        </Link>
      ) : (
        <h3 className={headingClass}>{group.heading}</h3>
      )}
      <ul
        className={
          group.twoCol
            ? "mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2"
            : "mt-4 space-y-3 text-sm"
        }
      >
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
            >
              {link.label}
              {link.badge ? (
                <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs font-semibold text-brand-bright">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = 2026; // static to avoid hydration drift; update per build
  const whoWeAre = FOOTER_NAV.find((g) => g.heading === "Who We Are")!;
  const ourServices = FOOTER_NAV.find((g) => g.heading === "Our Services")!;
  const ourIndustries = FOOTER_NAV.find((g) => g.heading === "Industries")!;
  const ourWork = FOOTER_NAV.find((g) => g.heading === "Our Work")!;

  return (
    <footer className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#161016_0%,#0d0a0c_45%,#080608_100%)] text-white">
      {/* Decorative watermark shapes + brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(215,52,56,0.16),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container-page relative">
        {/* CTA */}
        <div className="py-20 text-center md:py-28">
          <h2 data-aos="fade-up" className="mx-auto max-w-3xl text-4xl font-bold leading-[1.08] md:text-6xl">
            Let&apos;s build what your business{" "}
            <span className="text-metal-red-shine">needs next.</span>
          </h2>
          <p data-aos="fade-up" className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
            Every project is the start of a long-term partnership. Tell us where you
            want to go — we&apos;ll help you get there.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_-8px_rgba(215,52,56,0.55)] transition-all duration-300 hover:bg-brand-strong hover:shadow-[0_14px_48px_-8px_rgba(215,52,56,0.7)]"
            >
              {primaryCta.label}
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Nav columns — Who We Are (with Our Work beneath) · Our Services (2 cols) · Industries. */}
        <div className="grid gap-12 border-t border-white/10 pt-14 sm:grid-cols-2 lg:grid-cols-[1fr_1.7fr_1fr]">
          {/* Who We Are, with Our Work stacked beneath it. */}
          <div className="flex flex-col gap-10">
            <NavGroup group={whoWeAre} />
            <NavGroup group={ourWork} />
          </div>

          {/* Our Services — laid out in 2 columns. */}
          <NavGroup group={ourServices} />

          {/* Industries — every industry, linked to its detail page. */}
          <NavGroup group={ourIndustries} />
        </div>

        {/* Brand row — logo + description on the left, social icons on the right. */}
        <div data-aos="fade-up" className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <div className="inline-block rounded-lg bg-white p-3">
              <Logo height={30} />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              A technology consulting, digital transformation &amp; product engineering
              partner since {company.foundedYear} — 700+ projects across enterprises,
              startups, and government, from Nashik with an office in Pune.
            </p>
          </div>

          {/* Right column — certification logos, with social icons beneath.
              Nudged down a little so it sits lower than the logo on the left. */}
          <div className="flex flex-col gap-6 md:mt-4 md:items-end">
            {/* Accreditation logos — on white chips so they read on the dark footer. */}
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {CERT_LOGOS.map((c) => (
                <div key={c.src} className="grid h-16 place-items-center rounded-lg bg-white px-3">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    width={c.width}
                    height={c.height}
                    unoptimized
                    className="h-11 w-auto"
                  />
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2.5 md:justify-end">
              {company.social.map((s) => {
                const path = SOCIAL_PATHS[s.label];
                return (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition-colors duration-300 hover:bg-brand hover:text-white"
                  >
                    {path ? (
                      <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden>
                        <path d={path} />
                      </svg>
                    ) : (
                      s.label[0]
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Group strip — the only place on this site, besides the gateway itself,
            that acknowledges the sister businesses (see COMPANY-PROFILE.md).
            A plain <a>, not a <Link>: the gateway only mounts on `/`, so a
            client-side nav from this footer wouldn't remount it and nothing
            would open. A full load is right for a deliberate context switch. */}
        <div
          data-aos="fade-up"
          className="mt-14 flex flex-col items-start gap-5 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-white/90">Part of the Sumago group</p>
            <p className="mt-1.5 text-sm text-white/55">
              {brands.map((b) => b.short).join("  ·  ")}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
              a full load is the intent here, not an oversight: <Link> would
              soft-navigate and leave the gateway unmounted. */}
          <a
            href="/?gateway"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
          >
            Explore other businesses
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
