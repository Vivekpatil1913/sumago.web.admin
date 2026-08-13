import type { ServiceWithSlug } from "@/lib/services";
import { resolveServicePage, type Story } from "@/lib/service-page";
import { StoryRail, type Chapter } from "../story-rail";
import { ServiceHero } from "./hero";
import {
  Industries,
  Outcomes,
  Process,
  Proof,
  Technology,
  Understanding,
  ValueDrivers,
  WhatWeBuild,
  WhyUs,
} from "./sections";

/**
 * THE SERVICE PAGE
 * ================
 *
 * One layout, fifteen services. The order below never changes, no section is
 * ever conditional on which service is rendering, and no service can add,
 * remove or reorder a section. Everything a page needs comes from
 * `resolveServicePage()` (lib/service-page.ts), which guarantees every section
 * has content — bespoke where it has been written, derived from already-reviewed
 * copy where it hasn't.
 *
 *   01 Hero                 ink     the statement, the two CTAs, the visual
 *   02 Understanding        paper   the educational primer — teach, don't sell
 *   03 Why Businesses Invest mist   the value case, stated as gains
 *   04 Build & Capabilities  paper  one app at a time, its screen and its points
 *   05 Business Outcomes    mist    today → outcome, the ROI case
 *   06 Industries We Serve  mist    sector cards with a concrete use case
 *   07 Our Process          paper   the engagement as a timeline
 *   08 Why Sumago           mist    the trust close
 *   09 Technology Ecosystem ink     the only section where the stack leads
 *   10 Proof of Work        mist    real projects, or an honest gap
 *
 * "What we build" and "Capabilities" were merged: each app now carries its own
 * capability points, so a separate capabilities section would repeat them.
 *
 * THE ORDER IS EDUCATE-FIRST. The page never opens by naming the reader's
 * problem — an enterprise buyer who feels sold to in the first screen stops
 * reading. The problem appears in 03, as the reason a value driver matters.
 *
 * The single exception to "no conditionals" is section 10, which hides in
 * production when a service has no verified case study rather than borrowing
 * one (docs/17). The chapter rail is built from the same decision, so the
 * navigation can never advertise a section that isn't there.
 *
 * Server components except three leaves: the hero's lazy 3D starfield, the
 * chapter rail's observer, and section 04's build-and-capabilities slider.
 */
export function ServicePage({
  service,
  stories,
  isProd,
}: {
  service: ServiceWithSlug;
  stories: Story[];
  isProd: boolean;
}) {
  const content = resolveServicePage(service, stories);
  const showProof = stories.length > 0 || !isProd;

  const chapters: Chapter[] = [
    { id: "understanding", label: "Understanding" },
    { id: "why-invest", label: "Why it matters" },
    { id: "what-we-build", label: "What we build & capabilities" },
    { id: "outcomes", label: "Business outcomes" },
    { id: "industries", label: "Industries" },
    { id: "process", label: "Our process" },
    { id: "why-us", label: "Why Sumago" },
    { id: "technology", label: "Technology" },
    ...(showProof ? [{ id: "proof", label: "Proof of work" }] : []),
  ];

  const props = { service, content };

  return (
    <>
      <StoryRail chapters={chapters} />
      <ServiceHero {...props} />
      <Understanding {...props} />
      <ValueDrivers {...props} />
      <WhatWeBuild {...props} />
      <Outcomes {...props} />
      <Industries {...props} />
      <Process {...props} />
      <WhyUs {...props} />
      <Technology {...props} />
      <Proof {...props} isProd={isProd} />
    </>
  );
}
