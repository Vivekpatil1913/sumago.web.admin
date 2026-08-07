# Sumago Admin Panel — setup & operations

Implementation of [`Admin Sumago Website PRD.pdf`](Admin%20Sumago%20Website%20PRD.pdf) v1.1 — all 25 modules,
plus the contact-and-presence split described below.

**Module 13 is five screens, not one.** Phone numbers, email addresses, office
addresses and social links were `jsonb` and `text[]` columns inside General
Settings; each is now its own table and module. The reason is that a blob has no
per-row state: an editor could not take one number off the site, order the
offices, see who changed a link, or stop a placeholder URL being published. The
tables give each entry its own Draft/Published status, active switch, sort
order, audit trail and validation — and the database enforces one headquarters,
one primary number, one primary address, and no `#` social links.

`npm run migrate` moves any existing blob contents into the new tables and then
drops the columns, so the two copies can never drift.

| Piece | Path | URL |
| --- | --- | --- |
| Website | [`src/app/(site)/`](src/app/) | `http://localhost:3100` |
| Admin panel | [`src/app/admin/`](src/app/admin/) | `http://localhost:3100/admin/login` |
| API | [`D:\sumago-website-backend`](../sumago-website-backend/) — separate project | `http://localhost:3100/api` (proxied to `:4000`) |

The panel is part of the website's Next.js app, so both are one build, one
deployment and one origin. That keeps the admin session cookie first-party and
removes CORS entirely.

The **backend is a separate project living beside this one**, with its own
`package.json`, `node_modules` and [`README`](../sumago-website-backend/README.md).
It can be run entirely on its own (`npm run dev` from that folder), or together
with the website using the scripts below — those resolve it at
`../sumago-website-backend`, so keep the two folders as siblings on `D:\` or
update the paths in `package.json`.

`(site)` is a route group holding the public pages and their header/footer — it
does not appear in any URL, so `/about` is still `/about`. The admin routes sit
outside it and never render site chrome.

---

## 1. First run

Uses the PostgreSQL already installed on this machine (v18, service
`postgresql-x64-18`, port 5432). No containers.

**Step 1 — create the database.** `psql` is not on PATH by default on Windows,
so call it by full path:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres sumago_admin
```

It will prompt for the `postgres` password you set during installation. To avoid
running the admin panel as a superuser, create a dedicated role instead:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE ROLE sumago LOGIN PASSWORD 'choose-a-password';"
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -O sumago sumago_admin
```

**Step 2 — set the database password.** [`.env` in the backend](../sumago-website-backend/) already exists
with a generated `JWT_SECRET`; the only value you must supply is the password:

```
DATABASE_URL=postgresql://sumago:<PASSWORD>@localhost:5432/sumago_admin
```

Then:

```bash
npm run setup                 # installs the API, migrates the schema, seeds
```

**Step 3 — run everything.**

```bash
npm run dev
```

`npm run dev` starts both processes with prefixed output:

- **web** — website on `http://localhost:3100`, panel at `/admin/login`
- **api** — Express on `http://localhost:4000`

Sign in with the credentials `npm run seed` prints. One user exists per role
(`admin` / `marketing` / `hr` / `sales` / `viewer`), all sharing
`SEED_ADMIN_PASSWORD`, so the role rules in PRD §2 can be checked immediately.

**Change those passwords before the panel is reachable from the internet.**

### Other scripts

| Command | Does |
| --- | --- |
| `npm run dev:web` / `dev:api` | Run one side on its own |
| `npm run build:all` | Build the API and the site+panel |
| `npm run db:migrate` / `db:seed` | Re-run either step |
| `npm run test:api` | The API test suite (needs a **separate** throwaway database) |

### Environment files

All four are gitignored — none of them are ever committed.

| File | Used by | Purpose |
| --- | --- | --- |
| `.env` in the backend | API | Local development |
| `.env.production` in the backend | API | Production template; every `<PLACEHOLDER>` must be replaced |
| `.env.local` | Next.js | Local development. **Never deploy this** — it overrides `.env.production` |
| `.env.production` | Next.js | Production. `NEXT_PUBLIC_*` values are baked in at build time |

`.env.example` in the backend stays committed as the documented list of every variable.

### Deploying to AWS later

Nothing here assumes local disk or a local database beyond `.env` in the backend:

- **Database** — point `DATABASE_URL` at RDS and set `PGSSL=true`.
- **Files** — `STORAGE_DIR` is behind an interface in
  [`storage.ts`](../sumago-website-backend/src/lib/storage.ts); moving résumés and media to S3 means
  replacing `saveFile` / `readFile` / `deleteFile`, not changing callers. On a
  container or Lambda the local default will not survive restarts, so this
  swap is required before production, not optional.
- **Email** — set the `SMTP_*` variables (SES works as-is).
- **Origins** — set `ADMIN_ORIGIN` and `SITE_ORIGIN` to the real domain, and
  `ADMIN_API_ORIGIN` (read by [`next.config.ts`](next.config.ts)) to wherever the
  Express API runs.

## 2. Tests

```bash
cd ../sumago-website-backend
TEST_DATABASE_URL=... npm test     # or set DATABASE_URL to a throwaway database
```

The suite drops and rebuilds the schema, so point it at a database you are happy
to destroy — never your development or production one.

It covers, per PRD section: authentication and lockout (Module 23), role-based
access for all five roles (§2), full CRUD + search + filter + sort + pagination +
export + duplicate + publish + version-restore + delete for every content module
(§4.2), field validation (§6), the featured cap (Module 1), consent gates
(Modules 3 & 5), delete guards (Modules 14, 18, 20), both public forms and both
inboxes including archive/erase (Modules 19 & 21), media upload rules (§4.4),
user-management rules (Module 22), the activity log (Module 25) and the
role-scoped dashboard (§5).

## 3. How it is put together

### One registry, everything else derived

[`src/modules/`](../sumago-website-backend/src/modules/) declares all 25 modules: their
fields, validation rules, table columns, filters, and which roles may read or
write them. From that single declaration comes:

- the **server-side validation** on every write,
- the **generic CRUD routes** ([`resource.routes.ts`](../sumago-website-backend/src/routes/resource.routes.ts)) mounted once per module,
- **CSV export**, bulk actions, duplicate and version history,
- and the **entire admin UI** — the panel fetches the registry from `GET /api/schema`
  and renders every table and form from it, which is why 25 modules need only
  three page files ([`src/app/admin/(panel)/m/[module]/`](src/app/admin/)).

Adding a field is one line in the registry plus one column in
[`schema.sql`](../sumago-website-backend/src/db/schema.sql). `npm run migrate` fails loudly if those
two ever disagree, naming the exact field and column.

Field names match the website's own names in [`src/lib/`](src/lib/), as the PRD
requires, so wiring the site to the admin is a direct mapping.

### Errors

Every failure produces the same envelope, formatted in exactly one place
([`error-handler.ts`](../sumago-website-backend/src/middleware/error-handler.ts)):

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [ { "field": "blurb", "message": "…" } ], "requestId": "…" } }
```

`message` is always safe to show a user verbatim; the admin panel displays it
rather than inventing its own wording, and maps `details` back onto the exact
form fields — including nested paths such as `whoFor[0].title`. Internal
failures are logged in full server-side and replaced with a generic message.

### The rules that are not just field validation

| Rule | PRD | Where |
| --- | --- | --- |
| Received records can never be deleted — archive instead | §4.6 | [`inbox.routes.ts`](../sumago-website-backend/src/routes/inbox.routes.ts) |
| Admin-only erasure needs a typed confirmation + reason | §4.6 | same |
| Résumés live in private storage behind 15-minute signed links | M19 | [`storage.ts`](../sumago-website-backend/src/lib/storage.ts) |
| Retention purge deletes old applications (Hired exempt) | M19 | [`scheduler.ts`](../sumago-website-backend/src/jobs/scheduler.ts) |
| Max 6 featured services | M1 | [`rules.ts`](../sumago-website-backend/src/services/rules.ts) |
| Publishing blocked without client/testimonial consent | M3, M5 | [`validate.ts`](../sumago-website-backend/src/lib/validate.ts) |
| Slug change on a published record warns first | M1 | [`rules.ts`](../sumago-website-backend/src/services/rules.ts) |
| Deleting a job with applications is blocked — Close instead | M18 | [`rules.ts`](../sumago-website-backend/src/services/rules.ts) |
| Deleting an in-use media asset is blocked, showing where | M14 | [`rules.ts`](../sumago-website-backend/src/services/rules.ts) |
| Alt text mandatory at upload | §4.4 | [`media.routes.ts`](../sumago-website-backend/src/routes/media.routes.ts) |
| A user cannot change their own role; last Admin protected | M22 | [`users.routes.ts`](../sumago-website-backend/src/routes/users.routes.ts) |
| 2FA required for Admin and HR | M23 | [`auth.routes.ts`](../sumago-website-backend/src/routes/auth.routes.ts) |

### Privacy

Résumés are written to `STORAGE_DIR/resumes/`, which is **never** served
statically — only `media/` is. A résumé is reachable only through a signed token
that expires after 15 minutes *and* still requires an HR or Admin session, and
every issue and download is written to the Activity Log for privacy audits. The
storage key never appears in an API response.

## 4. How the website reads the admin

| Purpose | Endpoint |
| --- | --- |
| Contact form (Module 21) | `POST /api/public/contact` |
| Apply form + résumé (Module 19) | `POST /api/public/apply` (multipart) |
| Published content | `GET /api/public/content/:module` |
| One record by slug | `GET /api/public/content/:module/:slug` |
| Published jobs | `GET /api/public/jobs`, `/api/public/jobs/:slug` |
| Settings, navigation, offices, phones, emails, social | `GET /api/public/settings` |

Both form endpoints save the record first and treat email as best-effort, so a
failing mail server can never lose an enquiry or an application — the failure is
reported in the response `meta` and logged, but the record is already committed.

### The site's side

[`src/lib/cms/`](src/lib/cms/) is the only place the website talks to the API:

| File | Holds |
| --- | --- |
| `client.ts` | The server-side fetch, with Next caching and per-module cache tags |
| `types.ts` | The API's record shapes, mirroring the backend registry |
| `index.ts` | One accessor per thing a page needs (`getBlogPosts`, `getOffices`, …) |
| `format.ts` | Hydration-safe date formatting and rich-text paragraph splitting |
| `forms.ts` | The two public form submissions (browser-side) |

Pages import from `@/lib/cms` and nowhere else, so moving a section from
hardcoded to CMS-driven is a change in that folder rather than in the page.

**Every read falls back to the committed content in `src/lib/*`.** The site has
to render whether or not the API answers, and `next build` has to succeed on a
machine where the API is not running — so `getBlogPosts()` returns the posts in
`lib/blog.ts` if `/content/blog` is unreachable, and so on. Failures are logged
once (`[cms] … using fallback content`) and never shown to a visitor. A clean
build log means every module resolved from the database.

The two exceptions are deliberate:

- **Jobs have no fallback.** A stale vacancy costs someone an evening writing an
  application for a role that closed. An empty careers board is the honest answer.
- **Social links have no fallback.** The committed list was five `#`
  placeholders; an icon that goes nowhere costs more trust than no icon. The
  database rejects `#` outright, and the footer renders no icons until a real
  profile URL is published.

Content is cached for 60 seconds (120 for the settings bundle), matching the
`s-maxage` the API sets on the same responses.

### Publishing shows up immediately

Waiting out a 60-second cache is fine for a visitor and maddening for an editor,
who publishes and then reloads an unchanged page wondering whether it saved. So
after any successful write the API POSTs to `/api/revalidate` on the website and
the affected cache tag is dropped.

Set the **same** `REVALIDATE_SECRET` in both environments to switch it on. Leave
it empty and the call is skipped — content still goes live on its own 60-second
schedule, so a missing variable degrades to *slower*, never to *broken*. The
same is true if the website is down or mid-deploy: the purge is best-effort and
its failure can never turn a successful save into an error the editor sees.

### What happens when the API is unavailable

| Situation | Behaviour |
| --- | --- |
| API returns 5xx / connection dropped | One retry after 150ms, then the fallback |
| API accepts the connection and stalls | Aborted at 4s, then the fallback |
| API returns 404 for a slug | `notFound()` → the site's 404 page |
| API returns HTML instead of JSON | Treated as a failure; logged with the content-type |
| API down during `next build` | Build succeeds on fallback content |

Every failure logs one `[cms] … using fallback content` line and is never shown
to a visitor. A build log with no `[cms]` lines means every module resolved from
the database. (Next also prints its own `TypeError: fetch failed` for the same
failures — that trace is the framework's, not an unhandled error.)

### Structured data, sitemap and robots

Because the content is in a database, the markup search engines read is
generated from the same records the page renders, so the two cannot drift:

| Page | Emits |
| --- | --- |
| Home | `Organization`, with `sameAs` from the published social links and one `LocalBusiness` per office |
| `/contact` | One `LocalBusiness` per office — the reason the address is stored in parts |
| `/blog/[slug]` | `BlogPosting` + breadcrumbs |
| `/impact/[slug]` | `Article` + breadcrumbs |
| `/careers/[slug]` | `JobPosting` + breadcrumbs — what lists a role in Google Jobs |

`sitemap.xml` is built from the same reads, so unpublishing a story removes it
on the next revalidation and a closed job disappears. `noIndex` records are
excluded, because asking Google to crawl a page you have told it not to index is
a contradiction it reports as an error.

**Salary is deliberately absent from `JobPosting`.** The field is free text in
the CMS ("competitive", "12–18 LPA"); guessing a currency and period from that
would publish a figure to Google that Sumago never stated.

## 5. Open decisions (PRD §9)

| # | Decision | Current state |
| --- | --- | --- |
| 1 | Résumé storage | Local disk behind an interface in `storage.ts`; S3/Cloudinary is one adapter |
| 2 | Email provider | SMTP via nodemailer; no-ops with a log when `SMTP_HOST` is unset |
| 3 | Résumé retention | 12 months (`RESUME_RETENTION_MONTHS`) |
| 4 | CRM push | Not built — enquiries stay in the panel |
| 5 | Admin domain | Not set; deploy the panel behind one and set `ADMIN_ORIGIN` |

Virus scanning is a **structural check only** (rejects executables and malformed
PDF/DOCX). Wiring a real engine such as ClamAV is a single function in
`storage.ts` — `scanForViruses` — and should happen before launch.
