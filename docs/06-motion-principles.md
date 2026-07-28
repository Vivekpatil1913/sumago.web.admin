# 06 — Motion Principles

## The rule
**Every animation must earn its place** by doing exactly one of:
1. **Guide attention** — direct the eye to what matters next.
2. **Build trust** — reveal real people, proof, process with intent.
3. **Explain a concept** — make an abstract idea (transformation, process, architecture) tangible.
4. **Aid navigation** — orient the visitor in the story/scroll.

If it does none of these, it's decoration — **cut it.**

## Tooling
- **Native browser scroll** — the scroll foundation. *(Lenis smooth-scroll was removed: its per-frame JS repaint competed with heavy compositing and caused scroll jank. Native scroll runs on the compositor and holds 60fps. Use `scroll-behavior: smooth` for anchor jumps only, guarded by `prefers-reduced-motion`.)*
- **AOS (Animate On Scroll)** — lightweight declarative `data-aos` reveals for cards, sections, and CTAs. Disabled entirely under `prefers-reduced-motion`.
- **GSAP + ScrollTrigger** — scroll-driven storytelling, timelines, pinning.
- **Framer Motion** — component-level enter/exit, micro-interactions, layout animation (`Reveal` for orchestrated section reveals).
- **Three.js / R3F** — 3D scenes (see [07](07-3d-experience.md)). Render loops must park when off-screen.

Use one tool per job; don't animate the same property with two libraries.

## Motion tokens (from [03](03-design-system.md))
- Durations: fast 150ms · base 250ms · slow 400ms · cinematic 800ms.
- Easing: standard `(0.4,0,0.2,1)`, entrance `(0,0,0.2,1)`, emphasis `(0.2,0,0,1)`.
- Micro-interactions ≤ 250ms; section reveals 400–800ms; never block the user.

## Patterns
- **Scroll storytelling (homepage):** sections reveal as the narrative advances; pin + progress where it clarifies (e.g. the 9-step process). Subtle, not gimmicky.
- **Entrance reveals:** fade + small translate (≤24px), staggered for groups. No giant slides or bounces.
- **Hover/focus micro-interactions:** subtle scale (≤1.02), color/underline transitions; always also visible on keyboard focus.
- **Hero & 3D logo reveal:** cinematic one-time intro; must not delay content or LCP.

## Hard constraints
- **60 FPS** always. Animate only `transform` and `opacity`; avoid layout-triggering props (width/height/top/left).
- Never block LCP or interaction. Defer non-critical motion until after paint.
- **`prefers-reduced-motion: reduce`** → disable non-essential motion, replace with instant or simple fades; keep all content fully accessible.
- No autoplaying motion that loops indefinitely in the viewport without purpose (battery/distraction).
- Respect performance budget ([14](14-testing.md)); if an effect risks it, simplify or defer.

## Accessibility
- Motion never conveys information that isn't also available statically.
- Focus order and visible focus rings are never animated away.
- Pausable: any auto-advancing carousel/video has controls.
