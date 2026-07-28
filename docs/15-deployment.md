# 15 — Deployment

## Environments
| Env | Purpose | Host |
|---|---|---|
| Local | Development | dev machine |
| Preview | Per-PR review (auto) | Vercel preview |
| Production | Live site | Vercel production |

- **Frontend:** Vercel (Next.js). Automatic preview deploy per PR; production on merge to `main`.
- **CMS:** Sanity (hosted studio + content lake); studio deployable to a subpath or separate host.
- **Backend API:** NestJS deployed to a managed host (e.g. Render/Railway/Fly/containerized) — `[DECIDE]` final host; must be HTTPS, autoscaling-capable.
- **Database:** PostgreSQL (managed — e.g. Neon/Supabase/RDS) `[DECIDE]`; automated backups.
- **Media:** Cloudinary + Cloudflare Stream (CDN-delivered).

## CI/CD flow
```
PR ─► CI (typecheck, lint, test, build)
   ─► Vercel preview deploy
   ─► Lighthouse CI + axe assertions (must pass budget)
   ─► review + approve
merge ─► production deploy (Vercel) + ISR revalidate
```
Release gates from [14 — Testing](14-testing.md) must pass before merge.

## Configuration & secrets
- All secrets in environment variables (Vercel/host project settings) — never in the repo.
- Maintain `.env.example`; document required vars (Sanity project/dataset/token, Cloudinary, Cloudflare, NestJS API URL, DB URL).
- Separate Sanity datasets for `production` vs `staging` content if needed.

## Content publishing
- Editors publish in Sanity → webhook triggers Next.js ISR revalidation of affected routes.
- No redeploy needed for content changes.

## Observability
- Vercel Analytics + Web Vitals (field performance).
- Error monitoring (e.g. Sentry) on frontend + NestJS API.
- Uptime monitoring on production + API.
- Search Console post-launch indexation checks ([12](12-seo.md)).

## Launch checklist
- [ ] All release gates green (perf, a11y, SEO, tests)
- [ ] No `[VERIFY]` facts or stock assets shipped
- [ ] Real assets in place (or intentional placeholders removed)
- [ ] Metadata, OG images, sitemap, robots verified
- [ ] Forms deliver to NestJS/CRM + notifications work
- [ ] Redirects from old site URLs mapped
- [ ] Analytics + error + uptime monitoring live
- [ ] DNS / domain (sumagoinfotech.com) cutover plan confirmed
