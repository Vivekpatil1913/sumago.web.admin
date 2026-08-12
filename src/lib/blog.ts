/**
 * Blog content — the committed fallback for Module 4.
 *
 * The admin panel owns the posts at runtime; this file is what `/blog` renders
 * when the API is unreachable and what `next build` prerenders against on a
 * machine with no database. The two must therefore stay in step: these six are
 * the same six the seed writes (`sumago-website-backend/src/db/catalog.json`),
 * slug for slug.
 *
 * Unlike the four sample posts this replaced, the copy here is real, authored
 * editorial — no `[SAMPLE COPY]` flag, because there is nothing placeholder
 * about it. What is still standing in is the photography: every `cover` is a
 * licensed stock still committed under `public/images/stock/blog/`. The
 * `/images/stock/` prefix is what marks it as a stand-in — `isStockAsset` reads
 * it, so the badge and the launch gate still catch it (docs/17), and moving the
 * file out of that folder is what graduates it to a real photograph.
 *
 * ## Body format
 *
 * Markdown, as an array of blocks joined with blank lines — the exact string
 * the API's `body` column holds, so the fallback and the record render through
 * the same path (`lib/markdown.tsx`). Headings, bullet and numbered lists, bold
 * and italic are supported; nothing else is interpreted.
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (YYYY-MM-DD) — string-sortable, no Date object needed. */
  date: string;
  category: string;
  /** Filter chips on /blog, and what "keep reading" matches related posts on. */
  tags: string[];
  author: string;
  readingTime: string;
  cover: string;
  /** Overrides the title/excerpt in <head> where the post wants a different one. */
  metaTitle: string;
  metaDescription: string;
  /** Markdown, one block per entry. */
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "designing-for-trust-ux",
    title: "Designing for Trust: UX That Turns Hesitation into Confidence",
    excerpt:
      "Great design isn't decoration — it's how a first-time user decides whether to trust you. The UX principles that cut friction, guide attention, and convert hesitant visitors into confident ones.",
    date: "2026-07-28",
    category: "Design",
    tags: ["UX Design", "Product Design", "Conversion"],
    author: "Sumago Design",
    readingTime: "6 min read",
    cover: "/images/stock/blog/designing-for-trust-ux.jpg",
    metaTitle: "Designing for Trust: UX Principles That Build User Confidence",
    metaDescription:
      "How user-centered UX design reduces friction, guides attention, and converts hesitant first-time visitors into confident, returning users.",
    body: [
      "Every product gets one honest moment: the few seconds a first-time user spends deciding whether this thing is worth their attention. No feature list wins that moment. Design does.",
      "Trust isn't a screen you add at the end. It's the cumulative result of a hundred small decisions — how fast the page responds, whether the next step is obvious, whether an error feels like a dead end or a helping hand. Get those right and hesitation quietly turns into confidence.",
      "## Clarity beats cleverness",
      "The most trustworthy interfaces are rarely the most decorated ones. They're the ones where the user always knows three things: where they are, what to do next, and what just happened. Ambiguity is the enemy of trust — a button that might submit a form, a status that could mean \"saving\" or \"saved,\" a screen with six equally-weighted choices. Each moment of uncertainty is a moment the user reconsiders.",
      "Reducing that uncertainty is mostly subtraction. One primary action per screen. A visual hierarchy that answers \"look here first\" before the user has to ask. Labels written in the user's language, not the system's.",
      "## Speed is a feature — and a trust signal",
      "Perceived performance shapes perceived competence. A screen that responds instantly feels reliable; one that stutters feels fragile, regardless of what's happening underneath. Optimistic UI, skeleton states, and instant feedback on every tap tell the user the product is alive and listening. The goal isn't to hide slowness — it's to keep the user oriented while the work happens.",
      "## Design for the anxious moment",
      "Users don't judge a product by its happy path. They judge it by what happens when something goes wrong — a failed payment, a lost connection, a form rejected on the last field. Those are the moments trust is won or lost.",
      "- **Error messages should diagnose, not scold.** Say what happened and what to do about it.\n- **Never lose the user's work.** Preserve input across failures and retries.\n- **Make recovery obvious.** A clear path forward turns a frustrating dead end into a minor bump.",
      "Designing carefully for failure is one of the strongest signals that a product respects the person using it.",
      "## Consistency compounds",
      "Every pattern a user learns in one part of a product is a promise about the rest of it. When that promise holds — the same gesture always does the same thing, the same words always mean the same thing — the interface becomes predictable, and predictability feels safe. When it breaks, users stop trusting their own instincts and slow down. A shared design language isn't a nicety; it's how trust scales across an entire product.",
      "## Accessibility is trust, made concrete",
      "An interface that works for everyone — readable contrast, keyboard navigation, meaningful labels, sensible touch targets — tells every user that care went into the details they can't see. Accessibility and trust are the same discipline viewed from two angles: both are about removing the friction that stands between a person and what they came to do.",
      "## The takeaway",
      "Designing for trust isn't about adding reassurance — badges, guarantees, testimonials. It's about removing doubt. Make the next step obvious, respond instantly, handle failure gracefully, stay consistent, and leave no one behind. Do that, and the product earns confidence long before anyone reads a word of marketing.",
      "Because in the end, users don't trust what a product *says*. They trust how it *feels* to use.",
    ],
  },
  {
    slug: "multi-tenant-saas-architecture",
    title: "Multi-Tenant SaaS Architecture: Scale to Thousands Without Breaking",
    excerpt:
      "One codebase, countless organizations. How modern multi-tenant design delivers rock-solid data isolation, role-based access, and effortless scale — the engineering behind SaaS that grows without grinding to a halt.",
    date: "2026-07-10",
    category: "Architecture",
    tags: ["SaaS", "Architecture", "Scale"],
    author: "Sumago Engineering",
    readingTime: "7 min read",
    cover: "/images/stock/blog/multi-tenant-saas-architecture.jpg",
    metaTitle: "Multi-Tenant SaaS Architecture: A Guide to Scaling Safely",
    metaDescription:
      "How multi-tenant SaaS architecture delivers data isolation, role-based access, and effortless scale from one shared codebase — patterns that hold under growth.",
    body: [
      "The promise of SaaS is simple: build once, serve everyone. The engineering behind that promise is anything but. A single application has to host hundreds or thousands of organizations — each convinced their data is theirs alone, each with different users, roles, and rules — all running on the same code, at the same time, without ever bleeding into one another.",
      "That's the multi-tenancy problem. Solved well, it's invisible. Solved poorly, it surfaces as the worst kind of incident: one customer seeing another's data.",
      "## What \"tenant\" really means",
      "A tenant is one isolated customer world inside a shared system — an organization, a company, a society, a store. Everything a tenant does happens inside boundaries the architecture enforces automatically, so that no query, no request, and no background job can ever reach across into another tenant's world.",
      "The central design question is where to draw that boundary — and the answer is a spectrum, not a switch.",
      "## Three isolation models",
      "- **Shared database, shared schema.** Every tenant's rows live in the same tables, separated by a tenant ID on every record. Cheapest to run and easiest to scale, but isolation depends entirely on flawless query discipline — one missing filter is a leak.\n- **Shared database, separate schemas.** Each tenant gets its own schema inside a shared database. Stronger isolation, easier per-tenant backups, more overhead as tenant counts climb.\n- **Database per tenant.** Maximum isolation and the simplest mental model, at the highest operational cost. Reserved for tenants with strict compliance or data-residency needs.",
      "Most mature platforms blend these — a shared model for the long tail of tenants, dedicated infrastructure for the few that require it. The architecture should make moving a tenant between models a migration, not a rewrite.",
      "## Isolation you can't forget to apply",
      "The dangerous thing about tenant isolation is that it relies on developers remembering to scope every query — and humans forget. The durable fix is to make isolation the default, enforced below the application logic: row-level security in the database, a tenant context injected at the start of every request, and data-access layers that refuse to run an unscoped query at all. When the safe path is the only path, leaks stop being one careless line away.",
      "## Roles and permissions, done once",
      "Multi-tenancy and access control are two sides of the same coin. Within each tenant, different people need different powers — an administrator, a manager, a read-only viewer, an external guest. Rather than scatter permission checks through the code, a well-designed system centralizes them: roles map to permissions, permissions gate actions, and every screen and API asks the same authority the same way. Add a role once and it works everywhere.",
      "## Scaling without the cliff",
      "The point of a shared codebase is that scaling becomes an infrastructure problem, not a code problem. Stateless application servers scale horizontally behind a load balancer. Heavy or bursty work moves to background queues so a single tenant's spike never stalls everyone else. Caching absorbs read pressure. And per-tenant limits keep one noisy neighbor from consuming the resources of the whole building.",
      "The goal is a system where the difference between a hundred tenants and ten thousand is a bigger bill, not a rebuild.",
      "## The takeaway",
      "Great multi-tenant architecture is defined by what never happens: no data crosses a boundary, no tenant's load takes down another, no growth milestone forces a rewrite. That reliability comes from decisions made early — isolation enforced by default, access control centralized, and scale designed in from the first commit.",
      "Build those foundations once, and the platform can carry a business for a decade.",
    ],
  },
  {
    slug: "building-b2b2c-marketplace",
    title: "How to Build a B2B2C Marketplace People Actually Use",
    excerpt:
      "Two-sided marketplaces live or die on trust and timing. Cracking the chicken-and-egg of supply and demand, verifying participants, and aligning incentives so both sides keep coming back.",
    date: "2026-06-24",
    category: "Product Management",
    tags: ["Marketplace", "Product Management", "Platform"],
    author: "Sumago Product",
    readingTime: "7 min read",
    cover: "/images/stock/blog/building-b2b2c-marketplace.jpg",
    metaTitle: "How to Build a B2B2C Marketplace That People Actually Use",
    metaDescription:
      "A product-management guide to building a two-sided B2B2C marketplace — solving the supply-and-demand chicken-and-egg, verifying participants, and aligning incentives.",
    body: [
      "A marketplace is deceptively simple to describe: connect people who have something with people who want it, and take a small role in the middle. It's brutally hard to build. Unlike a normal product, a marketplace isn't finished when the software works — it only comes alive when two different groups of strangers show up at the same time and choose to trust each other through your platform.",
      "That's the real product challenge. The code is the easy part.",
      "## The chicken-and-egg problem",
      "No buyer wants to browse an empty marketplace. No seller wants to list where there are no buyers. Every two-sided platform starts stuck between those two facts, and solving it is less an engineering task than a sequencing decision.",
      "The platforms that break the deadlock rarely launch both sides at once. They pick the harder side to attract — usually supply — and make it irresistible to be there early, even before demand arrives. Seed one side with real value, and the other side has a reason to follow. Try to grow both evenly from day one, and neither reaches the density that makes the marketplace worth visiting.",
      "## Trust is the actual product",
      "On a marketplace, you're asking strangers to transact on your word. That means the thing you're really building isn't listings or search — it's trust infrastructure.",
      "- **Verification** — confirming that participants are who they claim to be, so neither side is trading blind.\n- **Transparency** — clear pricing, honest listings, and visible history that let people judge before they commit.\n- **Accountability** — ratings, dispute handling, and consequences that make good behavior the rational choice.",
      "Skip this layer and the marketplace fills with noise: fake listings, bad actors, and one burned user telling ten others. Trust is expensive to build and cheap to lose, which is exactly why it's the moat.",
      "## Design for two very different users",
      "A B2B2C marketplace serves a business on one side and a consumer on the other, and they want opposite things. The business side wants control, bulk actions, analytics, and speed — tools to run an operation. The consumer side wants simplicity, discovery, and a frictionless path to \"yes.\" Forcing both through one interface serves neither. The best marketplaces feel like two purpose-built products sharing a spine.",
      "## The metrics that actually matter",
      "It's tempting to celebrate total sign-ups. But registrations don't pay anyone. What signals a healthy marketplace is liquidity — the likelihood that a given request finds a match quickly. A buyer who searches and finds; a seller who lists and sells. When liquidity is high, every other number takes care of itself. When it's low, growth spending just fills a leaky bucket. Watch the match, not the crowd.",
      "## Aligning incentives so both sides stay",
      "A marketplace only compounds if participants come back — and they only come back if the platform stays on their side. That means pricing that feels fair to both, policies that don't quietly favor one side, and a genuine reason not to take the relationship off-platform once it's formed. The moment the marketplace feels like a tax rather than a service, disintermediation begins. Ongoing value — protection, convenience, reach — is what keeps everyone inside.",
      "## The takeaway",
      "Building a B2B2C marketplace is a product-management discipline more than a technical one. Solve the cold-start by seeding the hard side first. Invest early in verification and trust. Build for two audiences, not an average of them. Measure liquidity, not vanity. And keep both sides genuinely better off inside the platform than outside it.",
      "Get that right and the marketplace stops being software you maintain — and becomes a network that grows itself.",
    ],
  },
  {
    slug: "qa-that-scales",
    title: "Ship Faster, Break Less: QA That Scales With You",
    excerpt:
      "A bug caught late costs far more than one caught early. Why elite teams treat quality as a continuous process — automation, test strategy, and release discipline that protect every launch.",
    date: "2026-06-05",
    category: "QA",
    tags: ["Quality Engineering", "Test Automation", "Delivery"],
    author: "Sumago Quality",
    readingTime: "6 min read",
    cover: "/images/stock/blog/qa-that-scales.jpg",
    metaTitle: "Ship Faster, Break Less: Building QA That Scales",
    metaDescription:
      "Why high-performing teams treat quality assurance as a continuous process — test strategy, automation, and release discipline that let you ship faster with fewer defects.",
    body: [
      "There's a myth that quality and speed are opposites — that to move fast you have to accept more bugs, and to reduce bugs you have to slow down. The best engineering teams have quietly disproven it. They ship more often *and* break less, because they've stopped treating quality as a phase at the end and started treating it as a property of how they work.",
      "The difference isn't more testers. It's a different relationship with quality altogether.",
      "## Testing late is the expensive habit",
      "A defect is cheapest to fix the moment it's created and grows more expensive at every stage it survives — a flawed assumption caught in design costs a conversation; the same flaw caught in production costs an incident, a hotfix, and a dent in trust. Teams that only test at the end are, in effect, choosing the most expensive place to find their bugs. Shifting testing earlier — into design reviews, into the developer's own loop, into the pull request — turns quality from a gate you hit into a habit you keep.",
      "## The testing pyramid still holds",
      "Not all tests are equal, and a healthy suite is shaped like a pyramid:",
      "- **Unit tests** — many, fast, cheap. They check the small pieces and run in seconds, so developers get feedback while the code is still fresh in their minds.\n- **Integration tests** — fewer, verifying that the pieces work together and that the seams between systems hold.\n- **End-to-end tests** — fewest, slowest, most valuable per test. They confirm the critical journeys a user actually takes work from start to finish.",
      "Invert the pyramid — lean on slow, brittle end-to-end tests for everything — and the suite becomes so slow and flaky that people start ignoring it. A fast, trustworthy suite is one people actually run.",
      "## Automate the repetitive, reserve humans for judgment",
      "Automation's job is to make the boring, repeatable checks disappear into the pipeline, running on every change without anyone remembering to trigger them. That frees the people to do what automation can't: exploratory testing, judgment calls about user experience, and hunting for the strange edge cases no one wrote a script for. The aim isn't to replace human testing — it's to spend human attention where it's actually scarce.",
      "## Quality lives in the pipeline",
      "The most reliable teams encode their standards into the path to production. Every change runs the test suite automatically. A failing test blocks the merge. Static analysis and security checks run without being asked. Releases go out in small, reversible increments, so a problem is easy to spot and easy to roll back. When the pipeline enforces the standard, quality no longer depends on discipline or memory — it's simply how code reaches users.",
      "## Culture is the real test strategy",
      "Every tool here fails without one belief: that quality is everyone's job, not a department's. When developers own the tests for their code, when a broken build is treated as a stop-the-line moment, and when \"it works on my machine\" is the start of an investigation rather than the end of one, quality stops being something bolted on and becomes part of how the team thinks. Mature delivery processes — the kind certified against international standards — are really just this culture written down.",
      "## The takeaway",
      "QA that scales isn't about testing more at the end. It's about building quality in from the start — testing early, keeping the suite fast and trustworthy, automating the repetitive, enforcing standards in the pipeline, and making quality a shared responsibility. Do that, and shipping faster stops being a risk. It becomes the reward.",
    ],
  },
  {
    slug: "build-vs-buy-software",
    title: "Build vs. Buy Software: The Decision That Defines Your ROI",
    excerpt:
      "Off-the-shelf is fast; custom is precise. A no-nonsense framework for deciding when a tailored build pays for itself — so your next tech investment actually returns.",
    date: "2026-05-20",
    category: "Business",
    tags: ["Strategy", "Custom Software", "ROI"],
    author: "Sumago",
    readingTime: "6 min read",
    cover: "/images/stock/blog/build-vs-buy-software.jpg",
    metaTitle: "Build vs. Buy Software: A Framework for the Right Decision",
    metaDescription:
      "A practical build-vs-buy framework for business leaders — when off-the-shelf software wins, when a custom build pays back, and how to decide without regret.",
    body: [
      "Every growing business hits the same fork: a process is straining against the tools running it, and someone asks the obvious question — do we buy something off the shelf, or build exactly what we need? It sounds like a technical decision. It's really a business one, and it quietly shapes cost, speed, and competitiveness for years.",
      "The honest answer is that neither option is right in general. The skill is knowing which is right for *this* problem.",
      "## When buying is the smart move",
      "Off-the-shelf software exists because most business problems are shared problems. Email, accounting, payroll, scheduling — thousands of companies need the same thing, and a mature product has already solved it, hardened it, and priced it below what any single build would cost.",
      "Buy when the process is standard, when speed matters more than fit, and when the capability — however necessary — isn't what makes your business different. Paying to reinvent a solved problem is rarely where advantage comes from. A good product gets you running in days and improves without your effort.",
      "## When building pays back",
      "Custom software earns its cost in a narrower but crucial band: the places where your business doesn't work like everyone else's, and where that difference is the point.",
      "Build when your workflow is a genuine differentiator, when off-the-shelf tools force you to bend your operation to fit their assumptions, when you need systems to talk to each other in ways no vendor supports, or when the data and process are too central to hand to a black box. In those cases the \"cheaper\" bought option carries a hidden tax — every workaround, every manual bridge, every compromise the whole team pays daily.",
      "## The cost you can't see on the invoice",
      "Buying looks cheaper because its price is visible and its compromises aren't. The subscription is on the invoice; the hours lost to a tool that almost fits are not. Building looks more expensive because its cost is all upfront and obvious, while its return — a system shaped exactly to how you work, that you own and can evolve — accrues quietly over years.",
      "The right comparison isn't licence fee versus project cost. It's the total cost of living with each choice over the life of the system.",
      "## Ownership and the long game",
      "There's a strategic dimension beyond money. Buying means renting a capability on someone else's roadmap — you get their updates, but also their price changes, their priorities, and their limits. Building means owning the asset and its direction. For a capability at the core of how a business competes, that ownership is often the deciding factor: it's the difference between adapting your business to your software and adapting your software to your business.",
      "## A simple way to decide",
      "Ask three questions of the process in front of you:",
      "1. **Is this how we're different?** If yes, lean build. If it's just table stakes, lean buy.\n2. **Does an existing product fit without forcing us to change how we work?** If yes, buy. If every option needs heavy workarounds, that's the tax of buying.\n3. **How long will we live with this?** The longer the horizon, the more a tailored build's compounding return outweighs its upfront cost.",
      "Often the best answer is a blend — buy the commodity layers, build the parts that make you *you*, and integrate them cleanly.",
      "## The takeaway",
      "Build versus buy isn't about which is cheaper or more modern. It's about matching the decision to the problem: buy the shared, standard, undifferentiated work, and build where a system shaped to your business becomes a lasting advantage. Make that call deliberately, and your next software investment stops being a cost — and starts being a return.",
    ],
  },
  {
    slug: "ai-voice-agents-virtual-employee",
    title: "AI Voice Agents: Your 24/7 Virtual Employee That Never Sleeps",
    excerpt:
      "Autonomous voice AI now answers calls, qualifies leads, and books meetings — no hold music, no missed opportunities. What separates a true AI voice agent from a glorified phone menu, and where it pays off.",
    date: "2026-05-02",
    category: "AI",
    tags: ["AI", "Automation", "Customer Experience"],
    author: "Sumago AI",
    readingTime: "6 min read",
    cover: "/images/stock/blog/ai-voice-agents-virtual-employee.jpg",
    metaTitle: "AI Voice Agents: The 24/7 Virtual Employee Explained",
    metaDescription:
      "How autonomous AI voice agents answer calls, qualify leads, and book meetings around the clock — what makes them work, and where they deliver real value.",
    body: [
      "Think about what happens to a phone call your business can't answer. It rings out after hours. It lands in a queue during a rush. It reaches voicemail while everyone's on other lines. Each of those is a customer who was ready to talk — and a conversation that quietly became someone else's sale.",
      "For most of business history, the only fix was more people. Now there's another: an AI voice agent that answers every call, at any hour, and actually holds a conversation.",
      "## Beyond the phone menu",
      "It's easy to dismiss this as the old automated menu in new clothing. It isn't. The \"press 1 for sales\" system follows a rigid script and breaks the moment a caller says something it didn't expect. A modern voice agent understands natural speech, follows the thread of a conversation, and responds in real time — no menus, no keywords, no \"I didn't catch that.\"",
      "The leap is that the caller doesn't have to learn how to talk to it. They just talk, the way they would to a person, and the agent keeps up.",
      "## What a voice agent actually does",
      "The value isn't novelty — it's the routine, high-volume work that eats a team's day:",
      "- **Answering common questions** — hours, availability, pricing, status — instantly and consistently, every time.\n- **Qualifying and scoring leads** — asking the right questions, understanding the answers, and sorting genuine interest from noise before a human is ever involved.\n- **Booking meetings** — checking a calendar and confirming a slot inside the same call, while the caller is still engaged.\n- **Handling many calls at once** — no busy signal, no hold queue, whether one person calls or a hundred do at the same moment.",
      "Handled well, this is the work that determines whether a lead converts or cools — and it's exactly the work that overflows human capacity first.",
      "## Why \"never sleeps\" matters more than it sounds",
      "A human team works in shifts and takes breaks; demand doesn't. Customers call after hours, on weekends, in the gaps a business can't staff. An agent that's always on turns those dead zones into live conversations — capturing interest at the exact moment it's highest, instead of hoping the caller tries again tomorrow. And because it responds without the pause and hold-time of a stretched team, even peak-hour callers get an answer immediately.",
      "## The human handoff is the point",
      "The goal of a good voice agent isn't to remove people — it's to protect their time. It absorbs the repetitive, predictable calls that don't need a human, and routes the ones that do — the complex, the sensitive, the high-value — to a person with the context already gathered. The team stops spending its day on triage and starts spending it where judgment and relationship actually matter. Automation handles the volume; humans handle the meaning.",
      "## Where it pays off",
      "Voice automation earns its place anywhere the phone is a front door and volume is the bottleneck — fielding enquiries, qualifying interest, scheduling, and first-line support. Wherever missed calls quietly equal missed revenue, an always-on agent turns a leaky funnel into a reliable one.",
      "## The takeaway",
      "An AI voice agent is best understood not as a gadget but as a tireless team member — one that answers every call, holds a real conversation, does the routine work flawlessly, and hands the rest to a human at the right moment. In a world where the first business to respond usually wins, being the one that always answers is a quiet, durable advantage.",
    ],
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Deterministic date formatter (avoids locale-based hydration drift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** All posts, newest first (ISO dates sort lexicographically). */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
