import type { Metadata } from "next";

import { LegalPage } from "@/components/organisms/legal-page";
import { withSeoOverrides } from "@/lib/cms";

const DESCRIPTION = "The terms that govern use of this website and Sumago's services.";

export async function generateMetadata(): Promise<Metadata> {
  return withSeoOverrides("/terms", { title: "Terms & Conditions", description: DESCRIPTION });
}

/**
 * Terms & Conditions — content managed in the admin panel (Legal Pages → terms).
 *
 * Until the reviewed copy is published there, the shared template renders an
 * honest "being finalised" notice rather than invented contractual terms
 * (CLAUDE.md).
 */
export default function TermsPage() {
  return (
    <LegalPage
      slug="terms"
      fallbackTitle="Terms &"
      fallbackAccent="Conditions"
      description={DESCRIPTION}
    />
  );
}
