/**
 * Open positions for the Careers board.
 *
 * [SAMPLE COPY] — these roles are seed content for preview/dev only and must be
 * replaced with real, currently-open positions (sourced from HR) before launch.
 * See docs/17. When the CMS is wired, this list becomes a Sanity query; the
 * shape below is the contract components render against.
 */

export type EmploymentType = "Full-time" | "Contract" | "Internship";

export type JobDepartment =
  | "Engineering"
  | "Design"
  | "Product"
  | "Quality"
  | "Data & AI"
  | "Business";

export type OpenPosition = {
  /** Stable slug — detail route (/careers/[slug]) + apply subject line. */
  slug: string;
  title: string;
  department: JobDepartment;
  location: string;
  type: EmploymentType;
  /** Experience band, e.g. "3–6 yrs". */
  experience: string;
  /** One-line hook — what this person will actually work on. */
  summary: string;
  /** Small set of headline skills for scannability. */
  tags: string[];
  /** Detail-page overview paragraph. */
  overview: string;
  /** What the person will own day to day. */
  responsibilities: string[];
  /** What we're looking for. */
  requirements: string[];
};

/** [SAMPLE COPY] Replace with live openings before production. */
export const openPositions: OpenPosition[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Nashik (HQ)",
    type: "Full-time",
    experience: "4–7 yrs",
    summary:
      "Own end-to-end delivery of enterprise platforms — from data model to production — for clients across manufacturing, BFSI, and logistics.",
    tags: ["Node.js", "React", "PostgreSQL", "AWS"],
    overview:
      "You'll lead delivery on enterprise platforms end to end — architecting the data model, building the services and interfaces, and shipping to production. Working directly with clients and a cross-functional team, you'll turn ambiguous business problems into dependable software that scales.",
    responsibilities: [
      "Design and build full-stack features across the Node.js + React stack.",
      "Own architecture decisions and data modelling for new platforms.",
      "Mentor mid-level engineers through reviews and pairing.",
      "Partner with clients to translate requirements into technical plans.",
    ],
    requirements: [
      "4–7 years building production web applications.",
      "Strong TypeScript, Node.js, and React fundamentals.",
      "Solid grasp of relational databases and API design.",
      "Comfortable owning delivery in a client-facing environment.",
    ],
  },
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Pune",
    type: "Full-time",
    experience: "2–4 yrs",
    summary:
      "Build fast, accessible interfaces with Next.js and TypeScript, turning complex workflows into experiences people trust.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Accessibility"],
    overview:
      "You'll craft the interfaces clients and their users interact with every day — fast, accessible, and considered. Working closely with design and backend, you'll turn complex workflows into experiences that feel effortless.",
    responsibilities: [
      "Build responsive, accessible UI with Next.js and TypeScript.",
      "Collaborate with designers to translate mockups into production.",
      "Optimise for performance against strict Lighthouse budgets.",
      "Contribute to a shared component library.",
    ],
    requirements: [
      "2–4 years of frontend experience with React.",
      "Fluency in TypeScript, modern CSS, and Tailwind.",
      "Care for accessibility (WCAG) and Core Web Vitals.",
      "An eye for detail and interaction quality.",
    ],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Nashik / Remote",
    type: "Full-time",
    experience: "3–6 yrs",
    summary:
      "Design the pipelines and cloud infrastructure that let 700+ projects ship safely and scale under real load.",
    tags: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
    overview:
      "You'll own the infrastructure and delivery pipelines that keep our projects shipping safely and scaling under real load. From CI/CD to observability, you'll build the foundation the whole engineering org depends on.",
    responsibilities: [
      "Design and maintain CI/CD pipelines across projects.",
      "Manage cloud infrastructure with Terraform and Kubernetes.",
      "Set up monitoring, alerting, and incident response.",
      "Harden security and reliability across environments.",
    ],
    requirements: [
      "3–6 years in DevOps / platform engineering.",
      "Hands-on with AWS, Kubernetes, and Terraform.",
      "Strong scripting and automation skills.",
      "Experience with observability and incident tooling.",
    ],
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Nashik (HQ)",
    type: "Full-time",
    experience: "2–5 yrs",
    summary:
      "Shape product experiences from research to high-fidelity systems — designing for clarity, not decoration.",
    tags: ["Figma", "Design systems", "User research", "Prototyping"],
    overview:
      "You'll shape product experiences end to end — from research and flows to polished, high-fidelity systems. You design for clarity and outcomes, not decoration, and you partner tightly with engineering to see your work ship as intended.",
    responsibilities: [
      "Run discovery and translate insights into flows and wireframes.",
      "Design high-fidelity interfaces and interactive prototypes.",
      "Build and maintain scalable design systems in Figma.",
      "Partner with engineers to ensure faithful implementation.",
    ],
    requirements: [
      "2–5 years designing digital products.",
      "A portfolio showing strong UX thinking and visual craft.",
      "Fluency in Figma and design-system practices.",
      "Comfort with research and usability testing.",
    ],
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    department: "Product",
    location: "Pune",
    type: "Full-time",
    experience: "3–6 yrs",
    summary:
      "Partner with clients and engineering to translate business goals into roadmaps that deliver measurable outcomes.",
    tags: ["Discovery", "Roadmapping", "Analytics", "Stakeholders"],
    overview:
      "You'll sit between clients, design, and engineering — turning business goals into a roadmap the team can execute and outcomes the client can measure. You'll own the why and the what, and help the team deliver work that matters.",
    responsibilities: [
      "Lead discovery to understand client goals and user needs.",
      "Own the roadmap, priorities, and delivery milestones.",
      "Define requirements and success metrics for each release.",
      "Keep stakeholders aligned throughout delivery.",
    ],
    requirements: [
      "3–6 years in product management, ideally in a services or B2B setting.",
      "Track record of shipping products that moved real metrics.",
      "Strong communication and stakeholder management.",
      "Comfort with analytics and data-informed decisions.",
    ],
  },
  {
    slug: "qa-automation-engineer",
    title: "QA Automation Engineer",
    department: "Quality",
    location: "Nashik (HQ)",
    type: "Full-time",
    experience: "2–5 yrs",
    summary:
      "Build the automated test coverage that keeps enterprise releases dependable — the safety net behind every launch.",
    tags: ["Playwright", "Selenium", "API testing", "CI"],
    overview:
      "You'll build the automated test coverage that makes every release dependable — the safety net behind each launch. You'll work with engineering to catch issues early and keep quality high as projects scale.",
    responsibilities: [
      "Design and maintain automated test suites (UI and API).",
      "Integrate tests into CI so regressions surface early.",
      "Define test strategy and coverage for new features.",
      "Investigate failures and drive fixes with engineering.",
    ],
    requirements: [
      "2–5 years in QA automation.",
      "Hands-on with Playwright or Selenium and API testing.",
      "Solid understanding of CI pipelines.",
      "A rigorous, detail-oriented approach to quality.",
    ],
  },
  {
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    department: "Data & AI",
    location: "Nashik / Remote",
    type: "Full-time",
    experience: "3–6 yrs",
    summary:
      "Take models from notebook to production — building the AI features that give clients a genuine edge.",
    tags: ["Python", "LLMs", "MLOps", "Data pipelines"],
    overview:
      "You'll take models from notebook to production — building the AI features that give clients a genuine edge. From data pipelines to deployment and monitoring, you'll own the full lifecycle of real ML in real products.",
    responsibilities: [
      "Build and deploy ML and LLM-powered features.",
      "Design data pipelines for training and inference.",
      "Set up MLOps: versioning, evaluation, and monitoring.",
      "Collaborate with product to identify high-impact use cases.",
    ],
    requirements: [
      "3–6 years in ML / data engineering.",
      "Strong Python and applied ML fundamentals.",
      "Experience taking models to production (MLOps).",
      "Familiarity with modern LLM tooling.",
    ],
  },
  {
    slug: "business-development-executive",
    title: "Business Development Executive",
    department: "Business",
    location: "Pune",
    type: "Full-time",
    experience: "1–3 yrs",
    summary:
      "Open conversations with decision-makers and connect their challenges to the right Sumago capabilities.",
    tags: ["B2B", "Consultative sales", "CRM", "Relationships"],
    overview:
      "You'll open conversations with decision-makers and connect their challenges to the right Sumago capabilities. This is consultative, relationship-first business development — you build trust before you pitch.",
    responsibilities: [
      "Identify and reach out to prospective clients.",
      "Understand client challenges and map them to solutions.",
      "Manage the pipeline and nurture relationships in the CRM.",
      "Work with delivery teams to scope opportunities.",
    ],
    requirements: [
      "1–3 years in B2B sales or business development.",
      "Excellent communication and relationship-building skills.",
      "A consultative, listen-first mindset.",
      "Comfort with CRM tools and pipeline discipline.",
    ],
  },
];

/** Departments that actually have an opening — drives the filter chips. */
export const jobDepartments = Array.from(
  new Set(openPositions.map((p) => p.department)),
) as JobDepartment[];

/** Look up a single position by slug (detail route). */
export function getPosition(slug: string): OpenPosition | undefined {
  return openPositions.find((p) => p.slug === slug);
}
