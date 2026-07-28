# 07 — 3D Experience

## Purpose
3D creates **immersion that deepens the story** — it is never tech-for-tech's-sake. Use it where it makes an abstract idea tangible (global reach, connected systems, intelligence, transformation) or creates a memorable arrival moment.

## Candidate 3D moments
- **3D Logo Reveal** (homepage hero) — cinematic brand arrival; one-time, fast, must not harm LCP.
- **Interactive globe** — global/multi-industry reach and "globally trusted partner" vision.
- **Digital city / network** — connected systems, integration, digital ecosystems.
- **AI network / particle systems** — intelligence, automation, innovation (Innovation & Knowledge, AI Lab).
- **Interactive lighting & camera movement** — depth and focus during scroll storytelling.
- **Scroll-driven 3D** — camera moves through a scene as the narrative advances.

Use selectively — 1–2 hero 3D moments plus restrained accents beat a 3D-everywhere site.

## Tech
- **React Three Fiber** (R3F) + **drei** helpers; **Three.js** underneath.
- Integrate scroll with GSAP ScrollTrigger / `@react-three/drei` `ScrollControls`.
- Post-processing only when it clearly adds value and stays within budget.

## Performance rules (non-negotiable)
- **Lazy-load** all 3D — dynamic import, never in the initial/critical bundle. 3D must not delay LCP (<2s) or inflate first load.
- **Budget the scene:** low poly counts, instancing for repeated geometry, compressed textures (KTX2/Basis), draco-compressed models.
- **Cap pixel ratio** (`min(devicePixelRatio, 2)`); pause/throttle rendering when off-screen or tab hidden.
- Maintain **60 FPS**; provide a lighter variant for low-power devices.
- **Reduced motion / no WebGL:** always provide a static, beautiful fallback (poster image or simple 2D). Never break the page.
- Mobile: simplify or replace heavy scenes; respect data/battery.

## Asset pipeline
- Models: glTF/GLB, draco-compressed; store/serve via CDN.
- Textures: KTX2/Basis where supported.
- Keep total 3D payload tracked against the performance budget ([14](14-testing.md)).

## Definition of done (3D feature)
Adds narrative/trust value · lazy-loaded · 60fps on target devices · graceful fallback (reduced-motion + no-WebGL) · within performance budget · accessible (decorative scenes marked `aria-hidden`, meaningful content available in text).
