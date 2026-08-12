/**
 * Icon names → lucide components, for content that comes from the admin panel.
 *
 * The admin's icon picker offers a fixed list (`ICONS` in the backend's
 * `options.routes.ts`) and the server validates every saved value against it.
 * This map is the website's half of that contract and must stay in step: an
 * icon offered in the panel but missing here renders the fallback, which looks
 * like a bug to whoever picked it.
 *
 * Importing every lucide icon by name is not an option — the barrel is ~1,500
 * components and would land in the bundle. Naming them explicitly keeps
 * tree-shaking working, so only the icons actually offered ship.
 *
 * Distinct from `capability-icons.ts` and `tool-icons.ts`, which serve the
 * committed service and tool catalogues. This one serves CMS-authored records
 * (innovation cards, process steps, culture values, industries, FAQs).
 */
import {
  Activity,
  Award,
  Banknote,
  BarChart3,
  Blocks,
  Bot,
  Boxes,
  BrainCircuit,
  Briefcase,
  Building2,
  Cable,
  ChartNoAxesCombined,
  CheckCircle2,
  CircuitBoard,
  Clock,
  Cloud,
  Code2,
  Compass,
  Cpu,
  Database,
  Eye,
  Factory,
  FileCode2,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  HeartPulse,
  HelpCircle,
  Images,
  Landmark,
  Layers,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  LineChart,
  Link2,
  ListOrdered,
  Lock,
  Map,
  MapPin,
  Megaphone,
  MessageSquare,
  Mic,
  Monitor,
  Network,
  Newspaper,
  Package,
  PenTool,
  Plane,
  Quote,
  Repeat,
  Rocket,
  Scale,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Store,
  Target,
  TestTube2,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Wallet,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export const CMS_ICONS: Record<string, LucideIcon> = {
  Activity,
  Award,
  Banknote,
  BarChart3,
  Blocks,
  Bot,
  Boxes,
  BrainCircuit,
  Briefcase,
  Building2,
  Cable,
  ChartNoAxesCombined,
  CheckCircle2,
  CircuitBoard,
  Clock,
  Cloud,
  Code2,
  Compass,
  Cpu,
  Database,
  Eye,
  Factory,
  FileCode2,
  Fingerprint,
  Gauge,
  GitBranch,
  Globe,
  GraduationCap,
  // The panel offers this as "HandshakeIcon"; lucide exports it as `Handshake`.
  HandshakeIcon: Handshake,
  Heart,
  HeartPulse,
  HelpCircle,
  Images,
  Landmark,
  Layers,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  LineChart,
  Link2,
  ListOrdered,
  Lock,
  Map,
  MapPin,
  Megaphone,
  MessageSquare,
  Mic,
  Monitor,
  Network,
  Newspaper,
  Package,
  PenTool,
  Plane,
  Quote,
  Repeat,
  Rocket,
  Scale,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Store,
  Target,
  TestTube2,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Wallet,
  Workflow,
  Wrench,
  Zap,
};

/**
 * Resolve an admin-supplied icon name. Never throws and never renders nothing:
 * a missing icon leaves a hole in the layout, which reads as broken, so an
 * unknown name falls back to a neutral shape and the grid stays intact.
 */
export function resolveIcon(name: string | null | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!name) return fallback;
  return CMS_ICONS[name] ?? fallback;
}

/**
 * Render an admin-supplied icon by name.
 *
 * `resolveIcon` returns a component, and assigning one to a capitalised local
 * at the top of a render body is indistinguishable — to the React compiler's
 * lint rule — from *defining* a component there, which would reset its state on
 * every render. The rule is right to flag it even though this case is benign,
 * so the resolution happens inside a real component instead and call sites
 * write `<CmsIcon name={record.icon} size={20} />`.
 *
 * Props pass straight through to the lucide component, so `size`, `strokeWidth`
 * and `className` all behave as they would on the icon itself.
 */
export function CmsIcon({
  name,
  fallback = Sparkles,
  ...props
}: Omit<LucideProps, "name"> & {
  /*
   * `Omit<…, "name">` is load-bearing: SVG attributes already declare an
   * optional `name`, and intersecting with it narrowed this back to
   * `string | undefined` — so passing a nullable CMS field, which is the whole
   * point of this component, failed to compile.
   */
  name: string | null | undefined;
  fallback?: LucideIcon;
}) {
  // Looked up rather than routed through `resolveIcon`: the lint rule treats a
  // *call* that returns a component as a component definition, and a map access
  // says the same thing without tripping it.
  const Resolved = (name ? CMS_ICONS[name] : undefined) ?? fallback;
  return <Resolved {...props} />;
}
