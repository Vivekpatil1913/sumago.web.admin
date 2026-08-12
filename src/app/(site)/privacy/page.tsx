import type { Metadata } from "next";

import { LegalPage } from "@/components/organisms/legal-page";
import { withSeoOverrides } from "@/lib/cms";

const DESCRIPTION = "How Sumago handles the information you share through this website.";

export async function generateMetadata(): Promise<Metadata> {
  return withSeoOverrides("/privacy", { title: "Privacy Policy", description: DESCRIPTION });
}

/**
 * Privacy Policy — content managed in the admin panel (Legal Pages → privacy).
 *
 * Until the reviewed copy is published there, the shared template renders an
 * honest "being finalised" notice rather than an invented policy: data-handling
 * claims are never drafted here (CLAUDE.md).
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      slug="privacy"
      fallbackTitle="Privacy"
      fallbackAccent="Policy"
      description={DESCRIPTION}
    />
  );
}
