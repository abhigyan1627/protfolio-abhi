# Production deployment guide

This guide deploys three pieces:

1. **PostgreSQL**: a managed database (for example Neon, Supabase, Render Postgres, or a cloud provider).
2. **API**: the Express server in `server/`, hosted on Render (or any Node host).
3. **Website**: the Vite build in `client/`, hosted on Vercel.

The API and the website run on different domains. Admin sign-in therefore uses `SameSite=None; Secure` cookies, and the API checks the request origin on every admin change. The steps below assume that setup. The alternative (routing `/api` through the same domain) is described at the end.

> Nothing in this guide has been run against live accounts yet. Each step is written so you can verify it. The checks in section 6 are the proof of a working deployment.

## 0. Before you start

- Approve the content in the README checklist. Production should not carry unreviewed prices, qualifications or ratings.
- Decide the public domain, for example `https://www.example-ca-domain.in`. Use the same address everywhere below.
- Generate a session secret and keep it safe:

  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
  ```

## 1. PostgreSQL

1. Create a PostgreSQL database (PostgreSQL 14 or newer; verified locally on 16).
2. Copy the connection string. It should require TLS, for example `postgresql://user:password@host:5432/dbname?sslmode=require`.
3. Turn on automated backups and point-in-time recovery if the provider offers them. Enquiries are the business's leads, so treat this database as critical.
4. Do not expose the database to the public internet unless the provider requires it. Render and Vercel must be able to reach it.

## 2. API on Render

1. In Render, create a **Web Service** from this repository.
2. Settings:
   - **Root directory:** `server`
   - **Runtime:** Node
   - **Node version:** 22 (or 20.19+). Set the `NODE_VERSION` environment variable to `22` if Render does not detect it.
   - **Build command:** `npm ci && npm run build`
   - **Start command:** `npm run start:prod` (runs `prisma migrate deploy`, then starts the server)
   - **Health check path:** `/api/health`
3. Environment variables:

   | Name | Value |
   | --- | --- |
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | the connection string from step 1 |
   | `SESSION_SECRET` | the secret generated in step 0 |
   | `CLIENT_ORIGIN` | `https://www.example-ca-domain.in,https://your-project.vercel.app` (every origin that serves the website, comma-separated) |
   | `TRUST_PROXY_HOPS` | `1` |
   | `COOKIE_SAME_SITE` | `none` (the default in production; set it explicitly for clarity) |
   | `SESSION_TTL_HOURS` | `8` |
   | `BUSINESS_NAME` | `CA Mohit Agrawal` |
   | `BUSINESS_PHONE` | `+91 62990 33454` |
   | `BUSINESS_WHATSAPP_NUMBER` | `916299033454` |
   | `BUSINESS_ADDRESS` | `Muskan, Kedia Lane, Town Thana, Gopalganj, Bihar 841428, India` |
   | `BUSINESS_PLUS_CODE` | `FC7V+QC, Gopalganj` |

4. Deploy. The first deploy applies the migrations automatically. Check the logs for `server_started`.
5. Confirm the health endpoint: `https://your-api.onrender.com/api/health` should return `{"status":"ok","database":"up",…}`.

Free instances sleep when idle and take several seconds to wake. Use a paid instance if enquiries must always be answered immediately.

### Seed the content (once)

Run the seed once against the production database. It is idempotent, so running it again is safe. Use Render's shell if your plan includes it, or run it from your machine with the production `DATABASE_URL` set temporarily:

```bash
cd server
DATABASE_URL='postgresql://…?sslmode=require' npm run db:seed
```

The seed creates draft content only. Services, plans, FAQs and articles are published, but you can unpublish or edit them in the admin panel. The Hindi name stays hidden until approved, and the Google rating stays hidden until enabled.

### Create the first admin account (once)

There is no public sign-up. Create the owner account from a trusted machine with the production database URL:

```bash
cd server
DATABASE_URL='postgresql://…?sslmode=require' \
ADMIN_EMAIL='owner@example.com' \
ADMIN_PASSWORD='a-long-unique-passphrase' \
ADMIN_ROLE=OWNER \
npm run admin:create
```

Then clear the password from your shell history and terminal session. Never put the admin password in the Render dashboard or in the repository. Add more staff the same way with `ADMIN_ROLE=EDITOR` or `VIEWER`.

## 3. Website on Vercel

1. In Vercel, import this repository. Leave **Root Directory** empty. The root `vercel.json` already runs `cd client && npm ci`, builds `client/dist`, and rewrites unknown routes to `index.html` so deep links such as `/services/gst-return-filing` work.
2. Environment variables (Production):

   | Name | Value |
   | --- | --- |
   | `VITE_API_BASE_URL` | `https://your-api.onrender.com/api` |
   | `VITE_SITE_URL` | `https://www.example-ca-domain.in` |

   `VITE_` values are built into the site, so redeploy after changing them.
3. Deploy. Vercel also generates `robots.txt` and `sitemap.xml` during the build (the build fetches service and article slugs from the API).
4. Open the Vercel URL. The site should show live services and plans. If it shows the built-in contact details and an error message on the services section, check `VITE_API_BASE_URL` and the API health endpoint.

### Add the final website origin to the API

Once you know the final Vercel or custom domain, add it to `CLIENT_ORIGIN` on Render (comma-separated, no trailing slash) and let Render restart the API. If you skip this step, enquiries still work, but admin sign-in and changes are refused with an "origin not allowed" message.

## 4. Custom domain

1. In Vercel, add the domain under **Settings → Domains** and follow the DNS instructions.
2. Update `VITE_SITE_URL` to the custom domain and redeploy. This keeps canonical links and the sitemap correct.
3. Add the custom domain to `CLIENT_ORIGIN` on Render.
4. In Google Search Console, add the property and submit `https://www.example-ca-domain.in/sitemap.xml`.

## 5. Optional: same-domain API

If you prefer the admin cookie to be first-party (`SameSite=Lax`), route `/api` through the website domain. Add a rewrite to `vercel.json` before the catch-all, then leave `VITE_API_BASE_URL=/api`:

```json
{ "source": "/api/:path*", "destination": "https://your-api.onrender.com/api/:path*" }
```

Keep `CLIENT_ORIGIN` set to the website origin. Set `COOKIE_SAME_SITE=lax` on Render. Test sign-in afterwards, because proxies sometimes strip `Set-Cookie`.

## 6. Verification checklist

Complete these checks after the first production deploy. Record the results rather than assuming them.

- [ ] `https://your-api.onrender.com/api/health` returns `database: "up"`.
- [ ] The website loads, and `https://www.example-ca-domain.in/services/gst-return-filing` works when opened directly and after a refresh.
- [ ] `https://www.example-ca-domain.in/robots.txt` disallows `/admin/` and lists the sitemap. `sitemap.xml` lists the services and articles.
- [ ] The WhatsApp button opens `https://wa.me/916299033454` with a pre-filled message, on a phone. Confirm the number is on WhatsApp first.
- [ ] Submitting the contact form with valid details shows a reference code. The enquiry appears in the admin panel.
- [ ] Submitting an empty form shows field errors and does not show a success message.
- [ ] Signing in at `/admin/login` works. The session cookie in browser developer tools shows `HttpOnly`, `Secure`, `SameSite=None`, and path `/api`.
- [ ] Changing an enquiry status in the admin panel persists after a page reload.
- [ ] The rating and Hindi name are hidden on the public site unless you enabled them in Settings.
- [ ] The site renders correctly on a 390px-wide phone screen, and the mobile menu opens and closes.
- [ ] Run Lighthouse on the live URL and record the scores. Do not quote scores that were not measured on the live site.

## 7. Operations

- **Migrations:** each deploy runs `prisma migrate deploy`. To change the schema, create a migration locally with `npm run db:migrate -- --name describe_change`, commit the new folder under `prisma/migrations`, and deploy.
- **Rotating the session secret:** changing `SESSION_SECRET` signs everyone out. Use it only after a suspected leak.
- **Removing a staff member:** sessions are server-side. Delete their `AdminUser` row (or change their role to `VIEWER`) and their sessions expire within `SESSION_TTL_HOURS`.
- **Logs:** the API writes JSON lines with identifiers and status codes only. Enquiry text and contact details are never logged.
- **Backups:** confirm restore works before launch. Export enquiries periodically if the business needs an offline copy.
- **Monitoring:** add an uptime check against `/api/health`.

## Not configured (decide before launch)

- **Email notifications:** not configured. Add a transactional email provider and a notification step if staff should be emailed on each enquiry.
- **Bot protection:** the form uses a honeypot, a minimum fill time and rate limits. Consider Cloudflare Turnstile if you see abuse.
- **Analytics:** the `trackEvent` hook in `client/src/lib/analytics.ts` sends nothing until an analytics script is added. Update the privacy notice before enabling any analytics.
