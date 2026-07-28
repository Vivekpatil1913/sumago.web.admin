/**
 * Shared lucide icon map for the service catalog, keyed by icon name.
 * Single source so the home grid, the Solutions index, and detail pages agree.
 */
import {
  Compass,
  Server,
  Smartphone,
  Boxes,
  Sparkles,
  Cloud,
  PenTool,
  Workflow,
  LifeBuoy,
  Lightbulb,
  ShieldCheck,
  RefreshCw,
  Globe,
  Megaphone,
  Layers,
  ClipboardList,
  BarChart3,
  Users,
  Blocks,
  Handshake,
  Cpu,
  type LucideIcon,
} from "lucide-react";

export const CAPABILITY_ICONS: Record<string, LucideIcon> = {
  Compass,
  Server,
  Smartphone,
  Boxes,
  Sparkles,
  Cloud,
  PenTool,
  Workflow,
  LifeBuoy,
  Lightbulb,
  ShieldCheck,
  RefreshCw,
  Globe,
  Megaphone,
  Layers,
  ClipboardList,
  BarChart3,
  Users,
  Blocks,
  Handshake,
  Cpu,
};

/** Fallback icon when a capability has no mapped icon. */
export const FALLBACK_CAPABILITY_ICON = Boxes;
