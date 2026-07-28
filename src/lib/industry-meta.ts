/**
 * Presentation meta for the 10 industries — icon + one-line blurb, keyed by
 * `slugify(name)`. Shared by the home industries marquee and the header
 * mega-menu so both stay in sync (mirrors lib/capability-icons.ts for services).
 *
 * Blurbs describe what Sumago does for the sector and mirror the verified
 * `industryDetails` (lib/content.ts) — outcome-first, no metrics, nothing invented.
 */
import {
  Truck,
  Factory,
  HeartPulse,
  Banknote,
  GraduationCap,
  ShoppingBag,
  Landmark,
  Plane,
  Building2,
  Briefcase,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  "logistics-and-transportation": Truck,
  manufacturing: Factory,
  healthcare: HeartPulse,
  "banking-and-financial-services": Banknote,
  education: GraduationCap,
  "retail-and-e-commerce": ShoppingBag,
  "government-and-public-sector": Landmark,
  "hospitality-and-tourism": Plane,
  "real-estate": Building2,
  "professional-services": Briefcase,
};

/** Fallback when an industry has no mapped icon. */
export const FALLBACK_INDUSTRY_ICON = Boxes;
