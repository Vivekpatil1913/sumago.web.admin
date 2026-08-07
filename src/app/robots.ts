/**
 * robots.txt.
 *
 * `/admin` and `/api` are disallowed as a courtesy to well-behaved crawlers,
 * not as protection: robots.txt is advisory and publicly readable, so it is a
 * hint, never a control. The admin panel's real defences are its session guard
 * and the `X-Robots-Tag: noindex` header set in next.config.ts.
 */
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/cms/schema-org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
