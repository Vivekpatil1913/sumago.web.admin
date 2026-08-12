/**
 * Responsive audit — every public route at every breakpoint.
 *
 *   node scripts/responsive-audit.mjs            # audit, table to stdout
 *   node scripts/responsive-audit.mjs --shots    # also write screenshots
 *
 * ## What this actually checks
 *
 * Horizontal overflow is the failure mode that matters for a CMS-driven site.
 * A layout that holds with the committed copy can break the moment an editor
 * publishes a longer client name or a service title that will not wrap — and
 * nothing in a type-checker or a unit test sees it. So the audit measures
 * `documentElement.scrollWidth` against `clientWidth` at each width and, when
 * they disagree, walks the DOM to name the element responsible rather than just
 * reporting that the page is wide.
 *
 * It also checks what a screenshot cannot: images that resolved to nothing
 * (`naturalWidth === 0` catches a 404 that still renders an alt box), and tap
 * targets below the 24px minimum on touch widths.
 *
 * Runs against the *built* site (`next start`), not the dev server, so what is
 * measured is what ships. Uses the installed Chrome via `channel: "chrome"` so
 * no browser download is needed.
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3100";
const SHOTS = process.argv.includes("--shots");
const SHOT_DIR = "screenshots";

/** The widths that matter, not a device list — layout breaks at widths. */
const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 568, touch: true },
  { name: "mobile-390", width: 390, height: 844, touch: true },
  { name: "tablet-768", width: 768, height: 1024, touch: true },
  { name: "tablet-1024", width: 1024, height: 768, touch: true },
  { name: "laptop-1280", width: 1280, height: 800, touch: false },
  { name: "desktop-1920", width: 1920, height: 1080, touch: false },
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

/**
 * Find what is actually sticking out past the viewport.
 *
 * Walks every element and keeps the ones whose right edge clears the document
 * width by more than a rounding pixel. Fixed/sticky elements are skipped: an
 * off-canvas mobile menu parked at translateX(100%) is deliberate, not a bug.
 */
const FIND_OVERFLOW = () => {
  const docWidth = document.documentElement.clientWidth;
  const guilty = [];
  for (const el of document.querySelectorAll("*")) {
    const style = getComputedStyle(el);
    if (style.position === "fixed" || style.position === "sticky") continue;
    if (style.visibility === "hidden" || style.display === "none") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) continue;
    if (rect.right > docWidth + 1) {
      guilty.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 70),
        right: Math.round(rect.right),
        over: Math.round(rect.right - docWidth),
      });
    }
  }
  // The outermost offender explains the inner ones; report the widest few.
  guilty.sort((a, b) => b.over - a.over);
  return guilty.slice(0, 3);
};

/** Images the browser tried to load and got nothing back for. */
const FIND_BROKEN_IMAGES = () =>
  [...document.querySelectorAll("img")]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => (img.currentSrc || img.src || "(no src)").slice(-70))
    .slice(0, 5);

/**
 * Interactive controls smaller than 24×24 CSS px.
 *
 * WCAG 2.2 target size (minimum). Zero-size elements are skipped — a
 * visually-hidden skip link or a collapsed menu item is not a live target.
 */
const FIND_SMALL_TAPS = () =>
  [...document.querySelectorAll("a, button, [role=button], summary")]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ el, r }) => {
      if (r.width === 0 || r.height === 0) return false;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") return false;
      return r.width < 24 || r.height < 24;
    })
    .map(({ el, r }) => ({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
      size: Math.round(r.width) + "x" + Math.round(r.height),
    }))
    .slice(0, 5);

/**
 * Dismiss the first-visit brand gateway.
 *
 * It is a real `<dialog>` covering the viewport, so every click before it is
 * closed hits the dialog instead of the page. A visitor closes it once; the
 * audit has to do the same or it measures a modal, not the site.
 */
async function dismissGateway(page) {
  const dialog = page.locator("dialog[open]");
  if ((await dialog.count()) === 0) return;
  const close = page.getByRole("button", { name: /close|continue|skip|sumago/i }).first();
  if (await close.count()) {
    await close.click({ timeout: 3000 }).catch(() => {});
  } else {
    await page.keyboard.press("Escape").catch(() => {});
  }
  await page.waitForTimeout(300);
}

const findings = [];
const consoleErrors = [];

const browser = await chromium.launch({ channel: "chrome" });

if (SHOTS) await mkdir(SHOT_DIR, { recursive: true });

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push({ viewport: viewport.name, text: message.text().slice(0, 120) });
    }
  });
  page.on("pageerror", (error) => {
    consoleErrors.push({ viewport: viewport.name, text: `pageerror: ${String(error).slice(0, 120)}` });
  });

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 45_000 });
    await dismissGateway(page);
    // Scroll the page so lazy sections and reveal animations settle before the
    // measurement — an element that overflows only once revealed still overflows.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(350);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const overflows = scrollWidth > clientWidth + 1;

    const record = {
      viewport: viewport.name,
      route,
      overflow: overflows ? scrollWidth - clientWidth : 0,
      culprits: overflows ? await page.evaluate(FIND_OVERFLOW) : [],
      brokenImages: await page.evaluate(FIND_BROKEN_IMAGES),
      smallTaps: viewport.touch ? await page.evaluate(FIND_SMALL_TAPS) : [],
    };

    findings.push(record);

    if (SHOTS) {
      const safe = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
      await page.screenshot({
        path: `${SHOT_DIR}/${viewport.name}__${safe}.png`,
        fullPage: false,
      });
    }
  }

  await context.close();
}

/* ------------------------------------------------------------------------ */
/* The mobile menu — the one piece of the layout that only exists on touch   */
/* ------------------------------------------------------------------------ */

const navResults = [];
for (const viewport of VIEWPORTS.filter((v) => v.width < 1024)) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await dismissGateway(page);

  const toggle = page.locator("button[aria-label*='menu' i], button[aria-controls*='nav' i]").first();
  const opened = await toggle
    .click({ timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  await page.waitForTimeout(400);

  // With the menu open the panel must be reachable and must not itself
  // introduce a horizontal scrollbar.
  const menuOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  // Counted from the *enabled* set: the collapsed panel is `inert`, so its
  // links must not be reachable until the menu is actually open.
  const visibleLinks = await page.locator("nav[aria-label='Mobile'] a:visible").count();
  const expanded = (await toggle.getAttribute("aria-expanded").catch(() => null)) === "true";

  navResults.push({
    viewport: viewport.name,
    opened: opened && expanded,
    visibleLinks,
    overflow: Math.max(0, menuOverflow),
  });

  await context.close();
}

await browser.close();

/* ------------------------------------------------------------------------ */
/* Report                                                                    */
/* ------------------------------------------------------------------------ */

const overflowing = findings.filter((f) => f.overflow > 0);
const withBrokenImages = findings.filter((f) => f.brokenImages.length > 0);
const withSmallTaps = findings.filter((f) => f.smallTaps.length > 0);

console.log(`\nAudited ${ROUTES.length} routes x ${VIEWPORTS.length} viewports = ${findings.length} page loads\n`);

console.log("HORIZONTAL OVERFLOW");
if (overflowing.length === 0) {
  console.log("  none — no page scrolls sideways at any width\n");
} else {
  for (const f of overflowing) {
    console.log(`  ${f.viewport.padEnd(13)} ${f.route.padEnd(38)} +${f.overflow}px`);
    for (const c of f.culprits) {
      console.log(`      <${c.tag}> +${c.over}px  ${c.cls}`);
    }
  }
  console.log("");
}

console.log("BROKEN IMAGES");
if (withBrokenImages.length === 0) {
  console.log("  none — every <img> resolved\n");
} else {
  for (const f of withBrokenImages) {
    console.log(`  ${f.viewport.padEnd(13)} ${f.route}`);
    for (const src of f.brokenImages) console.log(`      ${src}`);
  }
  console.log("");
}

console.log("TAP TARGETS UNDER 24px (touch widths)");
if (withSmallTaps.length === 0) {
  console.log("  none\n");
} else {
  const seen = new Set();
  for (const f of withSmallTaps) {
    for (const t of f.smallTaps) {
      const key = `${t.tag}|${t.text}|${t.size}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  ${f.viewport.padEnd(13)} <${t.tag}> ${t.size}  "${t.text}"  (${f.route})`);
    }
  }
  console.log("");
}

console.log("MOBILE MENU");
for (const n of navResults) {
  console.log(
    `  ${n.viewport.padEnd(13)} opened=${String(n.opened).padEnd(5)} links=${String(n.visibleLinks).padEnd(3)} overflow=${n.overflow}px`,
  );
}

console.log("\nCONSOLE ERRORS");
if (consoleErrors.length === 0) {
  console.log("  none");
} else {
  const seen = new Set();
  for (const e of consoleErrors) {
    if (seen.has(e.text)) continue;
    seen.add(e.text);
    console.log(`  [${e.viewport}] ${e.text}`);
  }
}

const failed =
  overflowing.length > 0 ||
  withBrokenImages.length > 0 ||
  navResults.some((n) => !n.opened || n.visibleLinks === 0 || n.overflow > 0);

console.log(`\n${failed ? "ISSUES FOUND" : "ALL CLEAR"}\n`);
if (failed) process.exitCode = 1;
