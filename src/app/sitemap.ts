/**
 * sitemap.xml, generated from the CMS.
 *
 * A hand-maintained sitemap goes stale the first time someone publishes a post
 * without editing it — and a sitemap listing a 404 is worse than no sitemap.
 * Building it from the same reads the pages use means it can only ever list
 * what is actually published: unpublish a story and it leaves the sitemap on
 * the next revalidation.
 *
 * `noIndex` records are excluded. Asking Google to crawl a page while telling
 * it not to index that page is a contradiction it reports as an error.
 */
import type { MetadataRoute } from "next";

import { getBlogPosts, getJobs, getSuccessStories } from "@/lib/cms";
import { SITE_URL } from "@/lib/cms/schema-org";
import { services } from "@/lib/services";
import { industryCatalog } from "@/lib/industries";

/** Rebuild hourly — well inside how often anything here changes. */
export const revalidate = 3600;

/** Static routes, with the priority each deserves relative to the home page. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/solutions", priority: 0.9, changeFrequency: "monthly" },
  { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
  { path: "/impact", priority: 0.9, changeFrequency: "weekly" },
  { path: "/innovation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/how-we-deliver", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.8, changeFrequency: "daily" },
  { path: "/life-at-sumago", priority: 0.6, changeFrequency: "monthly" },
  { path: "/team", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.9, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * All three reads fall back to committed content if the API is unreachable,
   * so a sitemap is always produced. It may briefly under-report new records —
   * far better than the build failing or the file coming back empty.
   */
  const [posts, stories, jobs] = await Promise.all([
    getBlogPosts(),
    getSuccessStories(),
    getJobs(),
  ]);

  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: url(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    ...services.map((service) => ({
      url: url(`/solutions/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    ...industryCatalog.map((industry) => ({
      url: url(`/industries/${industry.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...posts
      .filter((post) => !post.noIndex)
      .map((post) => ({
        url: url(`/blog/${post.slug}`),
        // The editorial date, not the row's — a typo fix should not tell Google
        // the article was rewritten.
        lastModified: new Date(post.updatedAt || post.date),
        changeFrequency: "monthly" as const,
        priority: post.featured ? 0.8 : 0.6,
      })),

    ...stories
      .filter((story) => !story.noIndex)
      .map((story) => ({
        url: url(`/impact/${story.slug}`),
        lastModified: new Date(story.updatedAt || now),
        changeFrequency: "monthly" as const,
        priority: story.featured ? 0.9 : 0.7,
      })),

    // Only jobs still open — `getJobs` returns published, active roles only.
    ...jobs.map((job) => ({
      url: url(`/careers/${job.slug}`),
      lastModified: job.postedAt ? new Date(job.postedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
