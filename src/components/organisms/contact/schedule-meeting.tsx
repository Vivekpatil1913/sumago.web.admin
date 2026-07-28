import { SectionHeading } from "@/components/atoms/section-heading";
import { MediaPlaceholder } from "@/components/molecules/media-placeholder";
import { IntakeForm } from "@/components/organisms/contact/intake-form";
import { previewImages } from "@/lib/preview-assets";

/**
 * Primary conversion — the four-step intake the hero's "Schedule a meeting"
 * CTA jumps to. Photography sits behind a heavy black scrim so the room the
 * meeting would happen in is present but never competes with the form; the
 * white card floating over it is the only thing with contrast to spare.
 *
 * Owns its own <section> rather than using <Section> because the image has to
 * bleed past `.container-page` to the viewport edge.
 *
 * [REAL ASSET NEEDED] The backdrop is preview stock (see docs/17) — the `alt`
 * is the brief for the real photograph that replaces it.
 */
export function ScheduleMeeting() {
  return (
    <section
      id="schedule"
      className="relative isolate scroll-mt-24 overflow-hidden bg-[#0a0708] py-16 text-white md:py-22"
    >
      {/* Backdrop + scrim. Both are decorative; the form owns the contrast. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <MediaPlaceholder
          fill
          src={previewImages.teamMeeting}
          alt="Sumago's team in conversation with a client around the table at the Nashik office"
          sizes="100vw"
          imageClassName="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0708] via-black/45 to-[#0a0708]" />
      </div>

      <div className="container-page relative z-10">
        <SectionHeading
          tone="dark"
          eyebrow="Schedule a meeting"
          title={
            <>
              Help us <span className="text-metal-red-shine">understand you</span> quickly.
            </>
          }
          description="Four short steps — under a minute. The more we know before we talk, the more useful that first conversation is for you."
        />
        <div className="mt-12">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
