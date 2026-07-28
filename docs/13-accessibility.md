# 13 — Accessibility

Accessibility is a **build requirement**, not a final pass. Target: **WCAG 2.1 AA** and **Lighthouse Accessibility = 100**.

## Core requirements
- **Keyboard:** every interactive element reachable and operable by keyboard; logical tab order; no traps.
- **Visible focus:** clear focus indicators on all focusable elements; never removed by motion or styling.
- **Semantic HTML:** landmarks (`header/nav/main/footer`), proper headings, lists, buttons vs links used correctly.
- **ARIA:** only when semantics aren't enough; never redundant/incorrect ARIA.
- **Screen readers:** meaningful labels, `alt` text on all real imagery, `aria-hidden` on decorative 3D/visuals, `VisuallyHidden` for context.
- **Color contrast:** AA — 4.5:1 body, 3:1 large text/UI. Verify brand red and tech blue combinations (see [03](03-design-system.md)).
- **Reduced motion:** honor `prefers-reduced-motion`; provide static equivalents (see [06](06-motion-principles.md), [07](07-3d-experience.md)).
- **High contrast / zoom:** usable at 200% zoom; supports forced-colors mode.

## Component rules
- Forms: every field labeled; errors announced (`aria-live`), associated with inputs; never color-only error signaling.
- Modals/sheets: focus trap *within* (intentional), return focus on close, `Esc` to close.
- Media: video captions + transcripts (founder/client videos); accessible player controls; no autoplay with sound.
- 3D/canvas: decorative scenes `aria-hidden`; any conveyed info also available as text.
- Carousels: pause/controls, keyboard navigable.

## Content accessibility
- Plain-language headings; descriptive link text (no "click here").
- Don't rely on color alone to convey meaning.
- Real images get descriptive alt; purely decorative get empty `alt=""`.

## Process & tooling
- `eslint-plugin-jsx-a11y` in CI.
- Automated checks: axe (Playwright/Storybook) in test suite ([14](14-testing.md)).
- Manual: keyboard-only walkthrough + screen reader (NVDA/VoiceOver) on key flows before release.
- Accessibility is part of the Definition of Done for every component.
