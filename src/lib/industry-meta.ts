/**
 * Presentation meta for the 10 industries — the icon each one is drawn with,
 * keyed by `slugify(name)`. Shared by the industries index, the ten detail
 * pages, the home marquee and the header mega-menu, so all four stay in sync
 * (mirrors lib/capability-icons.ts for services).
 *
 * ## Names, not components
 *
 * These are icon *names* resolved through `CMS_ICONS`, not imported components.
 * The admin panel stores an industry's icon as a name from a fixed list
 * (`ICONS` in the API's `options.routes.ts`), so an industry read from the CMS
 * arrives carrying a string. Keeping the committed map in the same currency
 * means one resolver serves both, and this file can be handed to the catalog
 * export as seed data — a component could not be.
 *
 * Every name here must exist in both `CMS_ICONS` and the API's `ICONS`
 * allow-list. A name in neither renders the fallback, which reads as a bug to
 * whoever picked it.
 */
import type { LucideIcon } from "lucide-react";

import { CMS_ICONS, resolveIcon } from "@/lib/icon-registry";
import { Boxes } from "lucide-react";

/** Slug → icon name. The seedable half of this file. */
export const INDUSTRY_ICON_NAMES: Record<string, string> = {
  "logistics-and-transportation": "Truck",
  manufacturing: "Factory",
  healthcare: "HeartPulse",
  "banking-and-financial-services": "Banknote",
  education: "GraduationCap",
  "retail-and-e-commerce": "ShoppingBag",
  "government-and-public-sector": "Landmark",
  "hospitality-and-tourism": "Plane",
  "real-estate": "Building2",
  "professional-services": "Briefcase",
};

/** Fallback when an industry has no mapped icon. */
export const FALLBACK_INDUSTRY_ICON = Boxes;

/**
 * Slug → component, derived from the names above so the two cannot disagree.
 * Kept as the existing export because every consumer already reads it this way.
 */
export const INDUSTRY_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(INDUSTRY_ICON_NAMES).map(([slug, name]) => [
    slug,
    CMS_ICONS[name] ?? FALLBACK_INDUSTRY_ICON,
  ]),
);

/**
 * The icon for an industry, whether it came from the committed catalog (look up
 * by slug) or from the CMS (an `icon` name on the record). The record's own name
 * wins — it is what an editor chose — and the committed map is the answer for
 * an industry that has none.
 */
export function industryIcon(slug: string, iconName?: string | null): LucideIcon {
  if (iconName) return resolveIcon(iconName, INDUSTRY_ICONS[slug] ?? FALLBACK_INDUSTRY_ICON);
  return INDUSTRY_ICONS[slug] ?? FALLBACK_INDUSTRY_ICON;
}
