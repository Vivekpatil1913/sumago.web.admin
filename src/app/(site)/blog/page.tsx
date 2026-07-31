import type { Metadata } from "next";
import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { SectionHeading } from "@/components/atoms/section-heading";
import { BlogFeed } from "@/components/organisms/blog/blog-feed";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Engineering notes, product thinking, and perspective from the Sumago team.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHero
        variant="dots"
        formation="stream"
        eyebrow="Blogs"
        title={<>Sharp perspective from the <span className="text-metal-red">Sumago team</span>.</>}
        description="Practical thinking from Sumago on technology, product, and the craft of building software that moves real businesses forward, one release at a time."
      />

      <Section>
        <SectionHeading
          eyebrow="Notes & ideas"
          title={<>Read it your way, <span className="text-metal-red">by subject</span>.</>}
        />
        <div className="mt-12">
          <BlogFeed posts={posts} />
        </div>
      </Section>
    </>
  );
}
