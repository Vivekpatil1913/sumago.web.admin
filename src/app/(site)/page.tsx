import { HomeHero } from "@/components/organisms/home/hero";
import {
  AboutSection,
  CapabilitiesSection,
  ChallengesWeSolve,
  ImpactPreview,
  IndustriesSection,
} from "@/components/organisms/home/sections";
import { ProcessSection, TrustIndicators } from "@/components/organisms/home/process-trust";
import { AiSdlc } from "@/components/organisms/home/ai-sdlc";
import {
  BlogAndCareers,
  CultureGallery,
  // FaqSection,  ← re-add with the commented-out <FaqSection /> below
  Testimonials,
} from "@/components/organisms/home/more-sections";
import { WhatWeDo } from "@/components/organisms/home/what-we-do";
import { WhyChoose } from "@/components/organisms/home/why-choose";
import { BrandGateway } from "@/components/organisms/brand-gateway";
import type { Metadata } from "next";

import {
  getCertifications,
  getClients,
  getExpertLine,
  getProcessSteps,
  getSettings,
  getSite,
  getVisitableOffices,
  withSeoOverrides,
} from "@/lib/cms";
import { organizationSchema } from "@/lib/cms/schema-org";
import { JsonLd } from "@/components/atoms/json-ld";

/**
 * Home metadata.
 *
 * The base is the company identity the root layout already derives its own
 * defaults from, so the two agree; the panel's `/` record overrides it. The
 * title is spelled out rather than left to the layout's `%s` template, because
 * the home page is the one page whose title is not "something — Sumago".
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return withSeoOverrides("/", {
    title: `${settings.name} — ${settings.tagline}`,
    description: settings.positioning,
  });
}

export default async function HomePage() {
  /*
   * `HomeHero` and `TrustIndicators` are client components, so they cannot read
   * the server-only CMS layer themselves. Fetched once here and passed down —
   * these share the cached `/settings` response, so this is one request.
   */
  const [site, settings, expertLine, certifications, offices, processSteps, clients] =
    await Promise.all([
      getSite(),
      getSettings(),
      getExpertLine(),
      getCertifications(),
      getVisitableOffices(),
      getProcessSteps(),
      getClients(),
    ]);

  /*
   * The Organization block is emitted once, here, and referenced by @id from
   * every other page — so an article names its publisher without restating the
   * whole company record on each one.
   */
  const organization = organizationSchema({
    settings,
    offices: site.offices,
    phones: site.phones,
    emails: site.emails,
    social: site.social,
  });

  return (
    <>
      <JsonLd data={organization} />

      {/* First-visit only, and layered over the homepage rather than replacing it —
          `/` still ships its full content to crawlers. See brand-gateway.tsx. */}
      <BrandGateway offices={offices} companyName={settings.name} />
      <HomeHero
        tagline={settings.tagline}
        foundedYear={settings.foundedYear}
        expertLine={expertLine}
      />
      <AboutSection />
      {/* Scope before story: `ChallengesWeSolve` below is an 800vh pinned track,
          so a scanning first-time visitor would otherwise reach "what Sumago
          actually does" around screen 10. See what-we-do.tsx. */}
      <WhatWeDo />
      <ChallengesWeSolve />
      <CapabilitiesSection />
      <IndustriesSection />
      {/* The hinge between audience and method: the grid above says who Sumago
          serves, `ProcessSection` below says how the work runs — this answers
          the question standing between them, "why this vendor?". */}
      <WhyChoose />
      <ProcessSection steps={processSteps} />
      <AiSdlc />
      <ImpactPreview />
      <TrustIndicators certifications={certifications} clients={clients} />
      <CultureGallery />
      <Testimonials />
      {/* The FAQ accordion existed, fully built, and was never placed on a page
          — so the FAQs module had a table, a form and an endpoint that nothing
          rendered. It sits after the testimonials because that is where the
          remaining objections surface: social proof answers "can they?", this
          answers "how would this actually work for me?". It disappears when
          nothing is published.

          Commented out on request — the component and its CMS wiring stay
          intact; uncomment the line below to bring the band back. */}
      {/* <FaqSection /> */}
      <BlogAndCareers />
    </>
  );
}
