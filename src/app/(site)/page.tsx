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
  Testimonials,
} from "@/components/organisms/home/more-sections";
import { WhatWeDo } from "@/components/organisms/home/what-we-do";
import { WhyChoose } from "@/components/organisms/home/why-choose";
import { BrandGateway } from "@/components/organisms/brand-gateway";
import {
  getCertifications,
  getMetrics,
  getSettings,
  getSite,
  getVisitableOffices,
} from "@/lib/cms";
import { organizationSchema } from "@/lib/cms/schema-org";
import { JsonLd } from "@/components/atoms/json-ld";

export default async function HomePage() {
  /*
   * `WhyChoose` and `TrustIndicators` are client components, so they cannot
   * read the server-only CMS layer themselves. Fetched once here and passed
   * down — both share the cached `/settings` response, so this is one request.
   */
  const [site, settings, metrics, certifications, offices] = await Promise.all([
    getSite(),
    getSettings(),
    getMetrics(),
    getCertifications(),
    getVisitableOffices(),
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
      <HomeHero tagline={settings.tagline} foundedYear={settings.foundedYear} />
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
      <WhyChoose metrics={metrics} />
      <ProcessSection />
      <AiSdlc />
      <ImpactPreview />
      <TrustIndicators certifications={certifications} />
      <CultureGallery />
      <Testimonials />
      <BlogAndCareers />
    </>
  );
}
