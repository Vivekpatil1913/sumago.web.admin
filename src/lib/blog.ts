/**
 * Blog content — SEED DATA (docs/17).
 * [SAMPLE COPY] These posts are dev/preview seed content and must be replaced by
 * real, Sanity-CMS-driven posts before launch. The shape here mirrors the
 * intended Sanity `post` schema so the swap is additive, not a rewrite.
 */
import { previewImages } from "@/lib/preview-assets";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (YYYY-MM-DD) — string-sortable, no Date object needed. */
  date: string;
  category: string;
  author: string;
  readingTime: string;
  cover: string;
  /** Body as an ordered list of paragraphs (Portable Text later). */
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ai-across-the-sdlc",
    title: "AI across the SDLC: where it actually moves the needle",
    excerpt:
      "Applied AI isn't a feature you bolt on at the end — it changes how software is planned, built, tested, and supported. Here's where it earns its place.",
    date: "2026-06-18",
    category: "Engineering",
    author: "Sumago Engineering",
    readingTime: "6 min read",
    cover: previewImages.aiml,
    body: [
      "[SAMPLE COPY] The most common mistake with AI in software delivery is treating it as a single feature — a chatbot here, a summary there. The teams that get real leverage treat it as a capability woven through the entire lifecycle.",
      "In planning and analysis, language models help translate messy stakeholder input into structured requirements faster. In design, they accelerate exploration. In build, they raise developer throughput without lowering the bar on quality — provided the review discipline holds.",
      "Testing is where the compounding gains show up: generated test cases, smarter triage, and faster root-cause analysis shorten the loop between a defect and its fix. And in support, retrieval-grounded assistants cut resolution time for common issues.",
      "The through-line is predictability. Applied well, AI reduces variance at every stage — which is exactly what enterprise delivery needs.",
    ],
  },
  {
    slug: "choosing-a-technology-partner",
    title: "Choosing a technology partner, not just a vendor",
    excerpt:
      "The difference between a vendor and a partner shows up long before the contract — in how they scope, question, and take ownership of the outcome.",
    date: "2026-05-30",
    category: "Perspective",
    author: "Sumago",
    readingTime: "5 min read",
    cover: previewImages.developers,
    body: [
      "[SAMPLE COPY] A vendor takes a spec and returns software. A partner asks why the spec looks the way it does — and whether it will actually move the business metric you care about.",
      "That difference compounds. Partners flag risk early, push back on scope that won't pay off, and stay accountable long after launch. Vendors optimize for the statement of work; partners optimize for the outcome.",
      "When you evaluate, watch the first conversation. Are they diagnosing your problem, or pitching their service list? The former is a partner.",
    ],
  },
  {
    slug: "digital-transformation-without-the-buzzwords",
    title: "Digital transformation without the buzzwords",
    excerpt:
      "Transformation isn't a platform purchase. It's a sequence of pragmatic changes that each earn their keep. A grounded way to think about it.",
    date: "2026-05-08",
    category: "Strategy",
    author: "Sumago",
    readingTime: "7 min read",
    cover: previewImages.innovation,
    body: [
      "[SAMPLE COPY] \"Digital transformation\" has been stretched to mean everything and therefore nothing. Stripped of the jargon, it's simply this: changing how a business runs so technology stops being friction and starts being leverage.",
      "The programs that succeed don't start with a platform. They start with a bottleneck — a process that takes days, data that won't connect, a customer experience that leaks — and they fix it end to end before moving to the next.",
      "Sequenced this way, each step funds the next and builds internal confidence. That's how transformation becomes durable instead of a stalled initiative.",
    ],
  },
  {
    slug: "product-engineering-that-scales",
    title: "Product engineering that scales with the business",
    excerpt:
      "Building for today's load is easy. Building so the same system carries ten times the traffic — and the team — is the real engineering problem.",
    date: "2026-04-22",
    category: "Engineering",
    author: "Sumago Engineering",
    readingTime: "6 min read",
    cover: previewImages.voiceAi,
    body: [
      "[SAMPLE COPY] Scaling is rarely a single wall you hit; it's a series of smaller ones. The database that was fine at a thousand users, the deployment that was fine with three engineers, the architecture that was fine before the second product line.",
      "The discipline is to design for the next order of magnitude without over-building for one you may never reach. Clean boundaries, strong typing, observability, and tested reliability buy you room to grow without a rewrite.",
      "Good product engineering makes scaling a series of deliberate choices rather than emergencies.",
    ],
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Deterministic date formatter (avoids locale-based hydration drift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** All posts, newest first (ISO dates sort lexicographically). */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
