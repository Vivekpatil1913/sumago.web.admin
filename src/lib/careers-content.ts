/**
 * Culture / life-at-Sumago content for the Careers page.
 *
 * Aspirational culture statements (safe to show). Copy is kept crisp: one line
 * per item. Each section shows exactly six cards.
 */

export type IconItem = {
  /**
   * Icon *name*, resolved through `CMS_ICONS` at the call site — not a
   * component. The admin panel stores an icon as a name from a fixed list, so
   * culture values and growth opportunities read from the CMS arrive as
   * strings; keeping the committed content in the same currency means one
   * resolver serves both and the fallback slots straight in.
   */
  icon: string;
  title: string;
  description: string;
};

/** How we think and work — six values. */
export const cultureValues: IconItem[] = [
  {
    icon: "Target",
    title: "Purpose-Driven Impact",
    description:
      "Work that endures — thoughtfully crafted, genuinely useful, rooted in real outcomes.",
  },
  {
    icon: "TrendingUp",
    title: "Growth Mindset",
    description: "Curiosity drives us. We learn, adapt, and push past limits.",
  },
  {
    icon: "Heart",
    title: "Customer-First Thinking",
    description:
      "Everything starts with the customer — we design and build around their needs.",
  },
  {
    icon: "ShieldCheck",
    title: "Ownership & Accountability",
    description: "Everyone owns their work — and stands by what they ship.",
  },
  {
    icon: "HandshakeIcon",
    title: "Authentic Collaboration",
    description: "We challenge respectfully and build trust through transparency.",
  },
  {
    icon: "Sparkles",
    title: "Inclusive Excellence",
    description: "Great work happens when every voice is seen and heard.",
  },
];

/** Growth opportunities — five pathways and rewards combined. */
export const growthOpportunities: IconItem[] = [
  {
    icon: "Globe",
    title: "High-Impact Projects",
    description: "Global initiatives for brands reaching millions of users.",
  },
  {
    icon: "TrendingUp",
    title: "Performance-Driven Growth",
    description: "A merit-based culture where top performers rise fast.",
  },
  {
    icon: "Cpu",
    title: "Cutting-Edge Tech Stack",
    description: "The full lifecycle — design to deployment — on modern cloud.",
  },
  {
    icon: "GraduationCap",
    title: "Continuous Learning",
    description: "AI masterclasses to product teardowns — learning never stops.",
  },
  {
    icon: "Wallet",
    title: "Competitive Compensation",
    description: "Rewards that reflect market benchmarks and your real impact.",
  },
];
