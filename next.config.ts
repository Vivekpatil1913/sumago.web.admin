import type { NextConfig } from "next";

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
};

export default nextConfig;
