# 11 — Coding Standards

## Principles
- **SOLID**, clean architecture, **Atomic Design**.
- **Strong typing** — no `any` without an inline justification comment.
- Prefer **React Server Components**; `"use client"` only when needed.
- Reusable, documented, single-responsibility components.
- Readability first: code should read like the surrounding code.

## Language & types
- TypeScript `strict: true`. No implicit any, no non-null `!` without reason.
- Type all props, returns, and external data (GROQ/API). Derive types; avoid duplication.
- Prefer `type` for unions/props; `interface` for extendable object contracts — be consistent per file.

## Naming
- Components `PascalCase`; files match component name.
- Hooks `useX`. Utilities `camelCase`. Constants `UPPER_SNAKE`. Types `PascalCase`.
- Folders kebab-case; route segments per Next.js conventions.

## File & folder structure
Follow [10 — Technical Architecture](10-technical-architecture.md). One component per file; co-locate `Component.tsx`, `Component.stories.tsx`, `Component.test.tsx`.

## Styling
- Tailwind utility-first; extract repeated patterns into components, not `@apply` soup.
- Use design tokens/CSS variables — **no hardcoded hex/px** for brand values (see [03](03-design-system.md)).
- `cn()` helper for conditional classes; keep class lists readable.

## React/Next conventions
- Data fetching in Server Components or route handlers, not in client effects where avoidable.
- `next/image` (or Cloudinary loader) for images; `next/font` for self-hosted fonts.
- Lazy-load 3D/heavy/media via `next/dynamic`.
- No data fetching inside presentational components.

## Motion & 3D
Follow [06](06-motion-principles.md) and [07](07-3d-experience.md): animate transform/opacity only; respect reduced-motion; lazy-load + fallback for 3D.

## Comments & docs
- TSDoc on exported components/utilities (purpose + non-obvious props).
- Comment the *why*, not the *what*. Match surrounding comment density.

## Tooling & quality gates
- **ESLint** (next/core-web-vitals + ts) + **Prettier**; CI fails on lint/type errors.
- **Husky + lint-staged** pre-commit: format, lint, typecheck.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `chore:`).
- Small, focused PRs. Each PR references the relevant doc + meets the Definition of Done (see [CLAUDE.md](../CLAUDE.md)).

## Git workflow
- Branch from `main`: `feat/…`, `fix/…`, `docs/…`.
- PR review required; CI green (lint, types, tests, Lighthouse budget) before merge.
- Never commit secrets; `.env` git-ignored, `.env.example` maintained.

## Performance discipline
Every change is measured against the budget in [14](14-testing.md). If a feature can't meet budget, simplify or defer — performance is never traded for effect.
