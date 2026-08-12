/**
 * Accessibility audit — axe-core against the built site, mobile and desktop.
 *
 *   node scripts/a11y-audit.mjs
 *
 * Runs the WCAG 2.0/2.1 A and AA rulesets over every public route at a phone
 * width and a laptop width, because a violation can exist at one and not the
 * other: contrast is width-independent, but focus order, landmark structure and
 * anything behind a `lg:` breakpoint are not.
 *
 * Accessibility is a build requirement here, not a pass (CLAUDE.md), so this
 * exits non-zero on any violation rather than printing a score.
 *
 * The first-visit brand gateway is dismissed before scanning: it is a `<dialog>`
 * covering the page, so leaving it open would audit the modal on every route and
 * report the same handful of findings nineteen times.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3100";

const VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844, touch: true },
  { name: "laptop-1280", width: 1280, height: 800, touch: false },
];

const ROUTES = [
  "/",
  "/about",
  "/solutions",
  "/solutions/web-platform-engineering",
  "/industries",
  "/industries/manufacturing",
  "/impact",
  "/impact/webespoke-ai",
  "/blog",
  "/blog/ai-across-the-sdlc",
  "/team",
  "/contact",
  "/how-we-deliver",
  "/life-at-sumago",
  "/careers",
  "/careers/frontend-engineer",
  "/innovation",
  "/privacy",
  "/terms",
];

async function dismissGateway(page) {
  const dialog = page.locator("dialog[open]");
  if ((await dialog.count()) === 0) return;
  const close = page.getByRole("button", { name: /close|continue|skip|sumago/i }).first();
  if (await close.count()) await close.click({ timeout: 3000 }).catch(() => {});
  else await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({ channel: "chrome" });
const violations = [];

for (const viewport of VIEWPORTS) {
  /*
   * Reduced motion, deliberately.
   *
   * AOS reveals fade opacity from 0, and axe samples whatever colour it finds
   * at that instant — a white link half-faded over a red band measures as
   * #bea6a7 and reports a contrast failure that does not exist once the
   * transition lands. Measuring the settled state is both the accurate reading
   * and the one a reduced-motion visitor actually gets.
   */
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 45_000 });
    await dismissGateway(page);
    // Scroll through so every reveal fires, then return to the top.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    for (const v of results.violations) {
      violations.push({
        viewport: viewport.name,
        route,
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        sample: (v.nodes[0]?.html ?? "").slice(0, 110),
      });
    }
  }

  await context.close();
}

await browser.close();

console.log(`\nScanned ${ROUTES.length} routes x ${VIEWPORTS.length} viewports\n`);

if (violations.length === 0) {
  console.log("No WCAG 2.1 A/AA violations found.\n");
} else {
  // Group by rule: one rule failing on nineteen routes is one fix, not nineteen.
  const byRule = new Map();
  for (const v of violations) {
    const entry = byRule.get(v.id) ?? { ...v, routes: new Set(), total: 0 };
    entry.routes.add(`${v.viewport}${v.route}`);
    entry.total += v.nodes;
    byRule.set(v.id, entry);
  }

  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const rules = [...byRule.values()].sort(
    (a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9),
  );

  for (const rule of rules) {
    console.log(`[${rule.impact}] ${rule.id} — ${rule.help}`);
    console.log(`    ${rule.total} node(s) across ${rule.routes.size} page/viewport combination(s)`);
    console.log(`    e.g. ${rule.sample}`);
    console.log("");
  }
  console.log(`${rules.length} distinct rule(s) failing.\n`);
  process.exitCode = 1;
}
