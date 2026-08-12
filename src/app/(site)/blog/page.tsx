import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { BlogFeed } from "@/components/organisms/blog/blog-feed";
import { getBlogPosts, withSeoOverrides } from "@/lib/cms";

/**
 * Metadata for /blog, with the panel's SEO record layered on top.
 *
 * The base below is what the page ships with; anything published for this
 * path in SEO Metadata overrides it field by field. No record means the
 * base stands unchanged — never an empty title.
 */
export async function generateMetadata(): Promise<Metadata> {
  return withSeoOverrides("/blog", {
    title: "Insights",
    description:
      "Engineering notes, product thinking, and perspective from the Sumago team.",
  });
}

export default async function BlogPage() {
  // Already ordered featured-first, then newest, by the API.
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        variant="dots"
        formation="stream"
        eyebrow="Blogs"
        title={
          <>
            Sharp perspective from the{" "}
            <span className="text-metal-red-shine">Sumago team</span>.
          </>
        }
        description="Practical thinking from Sumago on technology, product, and the craft of building software that moves real businesses forward, one release at a time."
      />

      <Section>
        <SectionHeading
          eyebrow="Notes & ideas"
          title={
            <>
              Read it your way,{" "}
              <span className="text-metal-red">by subject</span>.
            </>
          }
        />
        <div className="mt-12">
          <BlogFeed posts={posts} />
        </div>
      </Section>
    </>
  );
}
