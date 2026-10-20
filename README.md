# CA Mohit Agrawal: Website and Enquiry System

Website for **CA Mohit Agrawal**, Chartered Accountant, Gopalganj, Bihar. It covers taxation, GST, accounting and business compliance services for individuals, businesses, startups and MSMEs.

The site includes:

- Public pages: homepage, service catalogue with detail pages, interactive pricing and comparison, Smart Service Finder, About, Resources (articles), Contact, Privacy notice and Terms.
- WhatsApp lead generation from every key page. Links open only after a visitor clicks.
- A public enquiry form backed by PostgreSQL, with a reference code returned only after the record is saved.
- A protected admin panel for enquiries, services, plans, articles, FAQs and site settings, with role-based access.

> **Status:** proposal build for owner review. All business content (services, plans, FAQs, articles, Hindi name, rating) is seeded as a draft and must be approved before launch. Nothing has been deployed yet. See [Owner approval checklist](#owner-approval-checklist) and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 7, TypeScript 5.9, Tailwind CSS 4, React Router 7, React Hook Form, Zod 4, Lucide, react-markdown |
| Backend | Node.js 20.19+, Express 5, Zod 4, helmet, express-rate-limit, bcryptjs |
| Database | PostgreSQL (verified on 16), Prisma 7 with the `pg` driver adapter |
| Hosting | Frontend on Vercel, API on Render or any Node host, managed PostgreSQL |

## Repository layout

```
.
├── client/                 Vite + React frontend
│   ├── src/
│   │   ├── components/     ui, layout, home, services, pricing, finder, contact, admin, …
│   │   ├── pages/          public pages and pages/admin
│   │   ├── layouts/        PublicLayout, AdminLayout (route guard)
│   │   ├── hooks/          async loading, document meta, site settings and admin session providers
│   │   ├── lib/            API clients, WhatsApp link builder, validation, formatting, analytics hook
│   │   ├── config/         business contact configuration and navigation
│   │   └── data/           editorial copy, Smart Service Finder mapping
│   ├── e2e/                Playwright browser tests
│   └── scripts/            build-time robots.txt and sitemap.xml generator
├── server/                 Express API
│   ├── src/
│   │   ├── routes/         public and admin route tables with per-route role checks
│   │   ├── controllers/    thin HTTP handlers
│   │   ├── services/       database logic and business rules
│   │   ├── validators/     Zod schemas for every input
│   │   ├── middleware/     admin auth, CSRF, origin checks, rate limits, error handling
│   │   ├── data/           proposed seed content
│   │   ├── seed.ts         idempotent seed script
│   │   └── scripts/        createAdmin.ts (one-time owner account)
│   └── test/               backend integration tests (real PostgreSQL)
├── prisma/
│   ├── schema.prisma       data model
│   └── migrations/         SQL migrations
├── docs/DEPLOYMENT.md      production deployment guide
└── vercel.json             Vercel build and SPA routing
```

## Quick start (local)

Prerequisites: Node.js 20.19 or newer, npm, and a running PostgreSQL 14+ server.

```bash
# 1. Create the databases (use any names; the test database name must end in _test)
createdb ca_mohit_agrawal_dev
createdb ca_mohit_agrawal_test

# 2. Install dependencies
cd server && npm ci
cd ../client && npm ci

# 3. Configure environment files (never commit the real ones)
cp server/.env.example server/.env        # set DATABASE_URL and SESSION_SECRET
cp client/.env.example client/.env

# 4. Apply migrations and load the proposed content
cd ../server
npm run db:deploy                         # non-destructive; applies prisma/migrations
npm run db:seed                           # idempotent; never overwrites owner edits

# 5. Create the first admin account (one-time; there is no public sign-up)
ADMIN_EMAIL=owner@example.com ADMIN_PASSWORD='use-a-long-passphrase' npm run admin:create
unset ADMIN_PASSWORD                      # then remove it from any env files

# 6. Run both servers
npm run dev                               # API on http://localhost:4000
cd ../client && npm run dev               # site on http://localhost:5173 (proxies /api)
```

Open `http://localhost:5173`. The admin panel is at `/admin/login`.

> If you serve the built site with `vite preview` on port 4173, add that origin to the API's `CLIENT_ORIGIN` (for example `CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173`). Admin sign-in is refused from origins that are not on the list.

## Environment variables

### `server/.env`

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string. Read by the app and by Prisma CLI through `prisma.config.ts`. |
| `SESSION_SECRET` | yes | At least 32 random characters. Used to key-hash session tokens. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`. The app refuses to start in production with the example value. |
| `CLIENT_ORIGIN` | yes | Comma-separated frontend origins allowed to call the API and to perform admin changes. No trailing slash. |
| `NODE_ENV` | no | `development`, `test` or `production`. Production enables secure cookies. |
| `PORT` | no | API port. Default `4000`. |
| `COOKIE_SAME_SITE` | no | `lax`, `strict` or `none`. Default `lax` in development and `none` in production (needed when the frontend and API are on different domains). |
| `SESSION_TTL_HOURS` | no | Admin session lifetime, 1 to 72. Default `8`. |
| `TRUST_PROXY_HOPS` | no | Number of reverse proxies in front of the API. Use `1` on Render. |
| `BUSINESS_*` | no | Initial site settings, used only when the settings row is first created. The owner edits them in the admin panel afterwards. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_ROLE` | only for `admin:create` | Used once to create an account. Remove the password afterwards. |
| `TEST_DATABASE_URL` | for tests | Test database. The name must end in `_test`, because the test helpers delete rows. |

### `client/.env`

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL. `/api` locally (proxied by Vite). In production, the full API URL, for example `https://ca-mohit-api.onrender.com/api`. |
| `VITE_SITE_URL` | Public site address used for canonical links, Open Graph tags and the sitemap. |

Only `VITE_` variables reach the browser. Secrets stay in `server/.env` and the hosting provider's dashboard.

## Common commands

| Task | Command (run in the directory shown) |
| --- | --- |
| API in development | `server`: `npm run dev` |
| Site in development | `client`: `npm run dev` |
| Create a migration after changing the schema | `server`: `npm run db:migrate -- --name describe_change` |
| Apply migrations (production) | `server`: `npm run db:deploy` |
| Seed proposed content | `server`: `npm run db:seed` |
| Create an admin account | `server`: `ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create` |
| Backend tests (real PostgreSQL) | `server`: `npm test` |
| Frontend unit tests | `client`: `npm test` |
| Typecheck | `client`: `npm run typecheck`; `server`: `npm run typecheck` |
| Production builds | `server`: `npm run build` then `npm start`; `client`: `npm run build` |
| Browser tests | see below |

### Browser tests

Start the API and the built site first:

```bash
cd server && npm run build && PORT=4000 CLIENT_ORIGIN=http://localhost:4173 npm start &
cd client && npm run build && npx vite preview --port 4173 &

cd client
E2E_ADMIN_EMAIL=owner@example.com E2E_ADMIN_PASSWORD='…' npm run e2e
```

Admin tests are skipped unless the two `E2E_ADMIN_*` variables are set. They use an existing account, and no credentials are stored in the repository. Set `PLAYWRIGHT_CHROMIUM_PATH` if Playwright's bundled browser is not installed. The public tests need seeded content.

## Features

**Public site**

- Sticky header with a mobile menu (keyboard accessible, `Escape` closes, focus is managed). WhatsApp call-to-action on every page, plus a floating WhatsApp button.
- Homepage with hero, trust strip, featured services, customer segments, why-choose principles, how-it-works steps, featured plans, FAQs and a closing call-to-action.
- Service catalogue with category filter, and a detail page for each service: overview, who may need it, documentation checklist, deliverables, exclusions, FAQs, related plans and related services.
- Pricing: Individual, Business and Startup tabs; category filter; comparison of up to three plans; "Contact for Quotation" wherever no approved price exists; per-plan WhatsApp messages; custom quotation request. Prices are stored as integer paise and are never invented.
- Smart Service Finder: audience, service, plan, then WhatsApp, with back, reset and validation. It never asks for PAN, Aadhaar, OTPs or bank details.
- Contact page with WhatsApp, phone, address and Plus Code, an enquiry form and an optional map and Google profile link (both shown only once configured).
- Resources (general guides) with publication and update dates and a disclaimer.
- SEO: unique titles and descriptions per route, canonical URLs, Open Graph tags, local business structured data built only from verified details (no ratings markup), `robots.txt` and `sitemap.xml` generated at build time.
- Accessibility: semantic landmarks and headings, skip link, visible focus states, labelled form errors, reduced-motion support, and an accessible accordion and dialog.

**Enquiries**

- Fields: name, preferred contact method, phone or email, service or plan, optional message, and consent to the privacy notice.
- Server-side validation of every field, with per-field messages.
- Spam protection: honeypot field, minimum form-fill time, and rate limits per IP.
- Stored in PostgreSQL with a reference code (for example `CMA-2610-K7QF2M`). The UI shows success only after the server returns `201`.
- No email is sent (no email provider is configured). Staff see enquiries in the admin panel.

**Admin panel** (`/admin`)

- Sessions use an HTTP-only cookie. Only a keyed hash of the session token is stored in the database.
- Every state-changing request requires a CSRF token and an allowed `Origin`.
- Login is rate limited (10 failed attempts per 15 minutes per IP). Passwords are stored as bcrypt hashes (cost 12).
- Roles: `OWNER` (everything, including site settings), `EDITOR` (content and enquiries), `VIEWER` (read-only).
- Dashboard: totals, status breakdown, recent enquiries, most requested services.
- Enquiries: search by name or reference, filter by status, paginate, update status, add internal notes.
- Services and plans: create, edit, publish, feature, reorder. A service or plan with enquiries attached cannot be deleted (unpublish instead) so history stays intact.
- Articles and FAQs: create, edit, publish.
- Settings: business details, approved Hindi branding (hidden until approved), WhatsApp number, address, office hours, links, and Google rating display (off by default).

## Verification performed

These checks ran in this repository against a local PostgreSQL 16 database:

- **Backend integration tests:** 36 passing. They cover public visibility rules, enquiry validation and spam rejection, enquiry rate limiting, login lockout, the admin session lifecycle, CSRF and origin enforcement, role permissions, duplicate-slug handling, paise-only prices, and enquiry status updates.
- **Frontend unit tests:** 21 passing (WhatsApp link builder, message templates, validation parity with the server, price formatting, finder mapping).
- **Browser tests (Playwright, Chromium):** 11 passing: 6 desktop and 5 mobile. They cover contact validation and a real submission, the service filter, pricing tabs and comparison, the finder through to its WhatsApp link, the not-found page, admin sign-in with an enquiry status change, no horizontal overflow on mobile, and the mobile menu.
- **Production builds:** frontend builds (typecheck, bundle, sitemap generation), and the compiled API serves health, public, enquiry and admin endpoints.
- **Dependency audit:** `npm audit` reports zero vulnerabilities for both `client` and `server`.
- **Log hygiene:** application logs were checked for personal data after test enquiries. Logs record identifiers and status only. Prisma's query logging is disabled because it can echo query arguments.

Not measured: Lighthouse scores and Core Web Vitals. These must be measured on the deployed site before any performance claim is made.

## Owner approval checklist

Before the website goes live, the owner should review and approve each item in the admin panel or in code:

- [ ] **WhatsApp number** `+91 62990 33454` is confirmed to be on WhatsApp, and the number in Settings is correct.
- [ ] **Hindi name** `का मोहित अग्रवाल` is confirmed and approved in Settings (it stays hidden until approved).
- [ ] **Services:** tick "Provided" only for services the practice actually offers. Audit-related and other professional services are seeded as disabled.
- [ ] **Service content:** overviews, documentation checklists, exclusions and FAQs are accurate for the practice.
- [ ] **Plans and prices:** enter only approved prices. Everything else stays "Contact for Quotation". Confirm inclusions, exclusions and additional charges.
- [ ] **Qualifications:** the About page placeholders (professional qualifications, membership details, years of practice) are replaced with verified information, or removed.
- [ ] **Office hours:** set in Settings once confirmed. Until then the site says they will be confirmed.
- [ ] **Google:** verify the Google Business Profile link and map link before adding them. Enable the rating only if the 4.9 rating and 58 reviews are current. The site never shows reviews or review text.
- [ ] **Articles:** every tax and compliance article is checked against current rules and dates. Each article carries a "verify current rules" reminder.
- [ ] **Legal:** the Privacy notice and Terms are reviewed by the CA (retention period, jurisdiction clause). Both are marked as drafts until then.
- [ ] **Email address:** add one in Settings if the practice wants an email contact. Email notifications are not configured.

## Known limitations

- **Not deployed.** Vercel and Render steps are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). The Vercel configuration has been validated by a local production build, not by a Vercel deploy.
- **No email notifications** (no provider is configured). Enquiries are read in the admin panel.
- **No CAPTCHA.** Spam protection is a honeypot, a minimum form-fill time and rate limits. Adding Cloudflare Turnstile is recommended before heavy promotion.
- **No analytics.** A privacy-conscious `trackEvent` hook records WhatsApp clicks and enquiry submissions with non-personal context only. It does nothing until an analytics script is added.
- **No ESLint configuration.** TypeScript strict mode, unit tests and browser tests are the quality gates.
- **Public content is a draft.** Services, plans, FAQs and articles are proposals; see the approval checklist.
- **Free-tier hosting** may sleep and cold-start the API. Use a paid instance for production enquiries.

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): PostgreSQL, Render API, Vercel frontend, cookies and CORS, first admin account, custom domains, go-live checks.
