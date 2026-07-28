/**
 * Culture / life-at-Sumago content for the Careers page.
 *
 * Aspirational culture statements (safe to show). Copy is kept crisp: one line
 * per item. Each section shows exactly six cards.
 */
import {
  Target,
  TrendingUp,
  Heart,
  ShieldCheck,
  Handshake,
  Sparkles,
  Globe,
  Cpu,
  GraduationCap,
  Wallet,
  Award,
  type LucideIcon,
} from "lucide-react";

export type IconItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** How we think and work — six values. */
export const cultureValues: IconItem[] = [
  {
    icon: Target,
    title: "Purpose-Driven Impact",
    description:
      "Work that endures — thoughtfully crafted, genuinely useful, rooted in real outcomes.",
  },
  {
    icon: TrendingUp,
    title: "Growth Mindset",
    description: "Curiosity drives us. We learn, adapt, and push past limits.",
  },
  {
    icon: Heart,
    title: "Customer-First Thinking",
    description:
      "Everything starts with the customer — we design and build around their needs.",
  },
  {
    icon: ShieldCheck,
    title: "Ownership & Accountability",
    description: "Everyone owns their work — and stands by what they ship.",
  },
  {
    icon: Handshake,
    title: "Authentic Collaboration",
    description: "We challenge respectfully and build trust through transparency.",
  },
  {
    icon: Sparkles,
    title: "Inclusive Excellence",
    description: "Great work happens when every voice is seen and heard.",
  },
];

/** Growth opportunities — six pathways and rewards combined. */
export const growthOpportunities: IconItem[] = [
  {
    icon: Globe,
    title: "High-Impact Projects",
    description: "Global initiatives for brands reaching millions of users.",
  },
  {
    icon: TrendingUp,
    title: "Performance-Driven Growth",
    description: "A merit-based culture where top performers rise fast.",
  },
  {
    icon: Cpu,
    title: "Cutting-Edge Tech Stack",
    description: "The full lifecycle — design to deployment — on modern cloud.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description: "AI masterclasses to product teardowns — learning never stops.",
  },
  {
    icon: Wallet,
    title: "Competitive Compensation",
    description: "Rewards that reflect market benchmarks and your real impact.",
  },
  {
    icon: Award,
    title: "Sponsored Certifications",
    description: "Fully sponsored certifications in AI, cloud, data, and more.",
  },
];
