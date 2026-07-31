import type { NextConfig } from "next";

/**
 * Where the admin API (server/) listens. The site and the panel both call it
 * through the rewrites below, so requests stay same-origin and the admin
 * session cookie remains first-party — no CORS round-trip, no third-party
 * cookie problems.
 */
const apiOrigin = process.env.ADMIN_API_ORIGIN ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    // PREVIEW ONLY — stock image hosts. Remove before launch (see docs/17).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  // Permanent redirects for pages consolidated in the nav restructure.
  // Their content now lives on the target routes.
  async redirects() {
    return [
      { source: "/why-sumago", destination: "/about", permanent: true },
      { source: "/locations", destination: "/contact", permanent: true },
      { source: "/start", destination: "/contact", permanent: true },
      { source: "/about/founders-desk", destination: "/team", permanent: true },
    ];
  },

  /**
   * The admin panel and the public forms both talk to the Express API at
   * `/api/*` on this same origin; Next proxies it through. `/uploads/*` serves
   * media from the API's storage. Résumés are NOT reachable this way — they are
   * private and only ever released through a signed, expiring link.
   */
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/uploads/:path*", destination: `${apiOrigin}/uploads/:path*` },
    ];
  },

  // PRD Module 23 — admin pages carry noindex, and must not be framed.
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
