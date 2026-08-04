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

export default function HomePage() {
  return (
    <>
      {/* First-visit only, and layered over the homepage rather than replacing it —
          `/` still ships its full content to crawlers. See brand-gateway.tsx. */}
      <BrandGateway />
      <HomeHero />
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
      <ProcessSection />
      <AiSdlc />
      <ImpactPreview />
      <TrustIndicators />
      <CultureGallery />
      <Testimonials />
      <BlogAndCareers />
    </>
  );
}
