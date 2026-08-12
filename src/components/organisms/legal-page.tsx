import { PageHero } from "@/components/organisms/page-hero";
import { Section } from "@/components/atoms/section";
import { Button } from "@/components/atoms/button";
import { getEmailFor, getLegalPage, getSettings } from "@/lib/cms";
import { formatDate, toParagraphs } from "@/lib/cms/format";

/**
 * /privacy and /terms — one template, driven by the Legal Pages module.
 *
 * ## Why there is a fallback, and why it says what it says
 *
 * Legal copy is the one thing on this site that must never be improvised. The
 * page therefore renders exactly two things: the reviewed text an editor has
 * published, or an honest statement that it is still with the legal team and a
 * way to reach a human. It never invents a data-handling claim, and it never
 * shows a draft — `getLegalPage` reads the public endpoint, which serves only
 * published, active, non-deleted rows.
 *
 * A missing record is therefore not an error state. It is the accurate answer
 * before launch, and the footer link resolves either way rather than 404ing.
 *
 * The body is rich text: paragraphs separated by blank lines, no HTML. Nothing
 * here is passed to `dangerouslySetInnerHTML`, so an editor cannot inject
 * markup into a page every visitor is told to trust.
 */
export async function LegalPage({
  slug,
  /** Shown in the hero while the CMS has nothing published. */
  fallbackTitle,
  fallbackAccent,
  description,
}: {
  slug: string;
  fallbackTitle: string;
  fallbackAccent: string;
  description: string;
}) {
  const [page, settings, privacyEmail] = await Promise.all([
    getLegalPage(slug),
    getSettings(),
    // Falls back to the primary address when no privacy-specific one is set.
    getEmailFor("privacy"),
  ]);

  const paragraphs = page ? toParagraphs(page.body) : [];
  const hasBody = paragraphs.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          page ? (
            <>{page.title}</>
          ) : (
            <>
              {fallbackTitle} <span className="text-metal-red-shine">{fallbackAccent}</span>.
            </>
          )
        }
        description={description}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          {hasBody ? (
            <article className="space-y-5 text-lg leading-relaxed text-ink/75">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ) : (
            <div className="rounded-2xl border border-line bg-mist p-8 md:p-10">
              <p className="text-lg leading-relaxed text-ink/75">
                {settings.name}&apos;s full {page?.title ?? fallbackTitle} is being finalised
                with our legal team and will be published here.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                If you have a question about the information you&apos;ve shared with us, or
                would like it removed, please get in touch and we&apos;ll respond directly.
              </p>
              <div className="mt-8">
                <Button href="/contact">Get in touch</Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-sm text-ink/65">
            {settings.name}
            {privacyEmail ? ` · ${privacyEmail}` : ""}
            {page?.lastUpdated ? ` · Last updated ${formatDate(page.lastUpdated)}` : ""}
          </p>
        </div>
      </Section>
    </>
  );
}
