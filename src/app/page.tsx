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
import { BrandGateway } from "@/components/organisms/brand-gateway";

export default function HomePage() {
  return (
    <>
      {/* First-visit only, and layered over the homepage rather than replacing it —
          `/` still ships its full content to crawlers. See brand-gateway.tsx. */}
      <BrandGateway />
      <HomeHero />
      <AboutSection />
      <ChallengesWeSolve />
      <CapabilitiesSection />
      <IndustriesSection />
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
