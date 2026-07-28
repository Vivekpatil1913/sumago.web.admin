# 14 — Testing & Quality Gates

Quality is enforced, not hoped for. CI must be green before merge.

## Performance budget (release gate)
| Metric | Target |
|---|---|
| Lighthouse Performance | **≥ 95** |
| Lighthouse Accessibility | **100** |
| Lighthouse SEO | **100** |
| Lighthouse Best Practices | **100** |
| LCP | **< 2s** |
| CLS | **< 0.1** |
| Animation frame rate | **60 FPS** |

**Performance is never sacrificed for visual effect.** If a 3D/motion feature can't meet budget, simplify or defer it.

## Test layers
- **Static:** TypeScript `strict`, ESLint (incl. `jsx-a11y`), Prettier — pre-commit + CI.
- **Unit:** Vitest/Jest + React Testing Library for logic, hooks, utilities.
- **Component:** Storybook stories for every component; visual review + interaction tests.
- **Accessibility:** axe-core via Playwright/Storybook on key components & pages (target: zero violations).
- **E2E:** Playwright on critical journeys — homepage scroll/story, "Start Your Journey" form submission, navigation, Success Story flow.
- **Performance:** Lighthouse CI (assertions against the budget above) on preview deploys; track Core Web Vitals in the field (Vercel/web-vitals).
- **Visual regression:** snapshot key pages/components (e.g. Playwright/Chromatic) to catch unintended UI drift.

## Cross-device / cross-browser
- Latest Chrome, Safari, Firefox, Edge.
- Real mobile testing — remember mobile is **redesigned, not shrunk** (verify the redesigned experience, not just responsiveness).
- Low-power device check for 3D/motion fallbacks.

## CI pipeline (per PR)
1. Install + typecheck + lint
2. Unit + component tests
3. Build
4. Deploy preview (Vercel)
5. Lighthouse CI + axe against preview → **fail if budget/a11y not met**
6. E2E smoke on preview

## Manual QA before release
- Keyboard-only + screen reader pass on key flows ([13](13-accessibility.md)).
- Reduced-motion + no-WebGL fallback check ([07](07-3d-experience.md)).
- Content review for voice compliance + no `[VERIFY]`/stock assets shipped ([08](08-content-strategy.md), [02](02-brand-guidelines.md)).
