# AUREVIA Chartered Accountants: website template

A React and Vite website for a Chartered Accountant firm. Visitors explore services, compare plans and start an
enquiry on WhatsApp. The site is built to be re-branded for another firm by editing configuration and data files,
without changing components.

The firm name, logo, tagline, contact details, services, plans, prices, FAQs and legal text are all placeholders
until the client supplies approved content. See the [pre-launch checklist](#pre-launch-checklist).

## Stack

- React 19, Vite 8, JavaScript (no TypeScript)
- Tailwind CSS 4 (brand tokens live in `src/index.css`)
- React Router 8 (client-side routes)
- Lucide React icons
- Vitest and Testing Library for tests, ESLint 10 for linting

Requires Node.js 20.19 or newer (22 LTS recommended).

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

In development, a small notice in the bottom-left corner lists the configuration values that are still missing.
That notice never appears in production builds.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Generates `robots.txt` and `sitemap.xml` (see SEO below), then builds to `dist/`. |
| `npm run preview` | Serves the production build locally for a final check. |
| `npm run lint` | Runs ESLint over the project. |
| `npm test` | Runs the unit and component test suite once. |
| `npm run test:watch` | Runs the tests in watch mode. |
| `npm run check` | Lint, tests and build, in that order. Run this before every deployment. |

## Project structure

```
src/
  config/
    siteConfig.js      Firm identity, contact details, WhatsApp number, legal and SEO settings. Edit first.
    env.js             Reads the optional enquiry-form endpoint from VITE_ENQUIRY_FORM_ENDPOINT.
  data/
    audiences.js       The three customer groups (Individuals, Businesses, Startups).
    services.js        Every service: title, copy, inclusions, scope notes, additional charges, WhatsApp wording.
    plans.js           Every plan: price, billing, included and excluded items, WhatsApp wording.
    faqs.js            FAQ questions and answers.
    content.js         Home-page strip, process steps, principles, about text, partner profile,
                       document checklists and official portal links.
    legal.js           Privacy Policy, Terms of Use and Disclaimer text (draft).
    pages.js           Every route, with its page title and description. Drives navigation and the sitemap.
  utils/
    whatsapp.js        Number validation, click-to-chat link creation and all message builders.
    validation.js      Enquiry-form and requirement validation, plus a check for sensitive data.
    format.js          INR price formatting and billing labels.
    config.js          Lists missing configuration for the development notice.
  hooks/               Per-page title and meta tags, and scroll state for the header.
  components/          Reusable sections and UI (Navbar, Hero, Services, ServiceFinder, Pricing, …).
  pages/               One component per route.
  index.css            Brand colour and font tokens, and shared component classes.
public/                favicon.svg, og-image.png, and the generated robots.txt and sitemap.xml.
scripts/generate-seo.mjs  Generates robots.txt and sitemap.xml before each build.
```

## Customising the site for a new firm

Most changes need only the files below. You should not need to edit components.

1. **Identity and contact** (`src/config/siteConfig.js`): firm name, short name, tagline, description, logo
   (`logo.monogram`, `logo.wordmark`, `logo.subtitle`, or `logo.image` for an image logo), phone, email, city, office
   address, business hours, map embed URL, social links, copyright year and holder, and `websiteUrl`.
2. **Brand colours and fonts** (`src/index.css`, the `@theme` block): the `--color-navy-*`, `--color-champagne-*`,
   `--color-ivory-*` and `--color-charcoal-*` tokens, and `--font-display` and `--font-sans`. If you change the
   font families, also update the Google Fonts link in `index.html`.
3. **Services** (`src/data/services.js`): titles, summaries, intended customers, inclusions, scope notes, additional
   charges and enquiry wording. Each service's `audience` decides which section it appears in. Icons are Lucide
   names registered in `src/components/icons.js`.
4. **Plans and prices** (`src/data/plans.js`): `price` in INR (use `null` for a custom quotation), `billing`
   (`'one-time'`, `'monthly'`, `'annual'` or `'custom'`), inclusions, exclusions, additional-charge notes and the
   WhatsApp wording. `serviceIds` links a plan to the services it supports.
5. **Sample-price notice**: once client-approved prices are in `plans.js`, set `pricing.showSampleNotice` to `false`
   in `siteConfig.js`.
6. **FAQs** (`src/data/faqs.js`), **home-page copy and partner profile** (`src/data/content.js`). Keep
   `teamProfile.verified` set to `false` until the partner's qualifications and membership have been checked.
7. **Legal text** (`src/data/legal.js`). Have it reviewed by a qualified adviser, then set `legal.showDraftNotice` to
   `false`.
8. **Routes and SEO wording** (`src/data/pages.js`): page titles and meta descriptions.
9. **Images**: replace `public/favicon.svg` and `public/og-image.png` (1200 × 630 px). Use licensed images only.

## WhatsApp setup

Every WhatsApp button is built from `src/utils/whatsapp.js` and uses the official format
`https://wa.me/<number>?text=<encoded message>`.

- Set `whatsappNumber` in `siteConfig.js` to the country code followed by the number, digits only, for example
  `'919876543210'`. Spaces, `+`, dashes and brackets are removed automatically. A number that contains letters (such
  as the `91XXXXXXXXXX` placeholder) or has no country code is rejected.
- While the number is not configured, no link is generated. In development, buttons show a warning. In production,
  the buttons are disabled, and the floating WhatsApp button is hidden. This means no broken link is ever shown.
- Messages are never sent automatically. Each link opens WhatsApp only when a visitor clicks it, and the visitor
  reviews and sends the message.
- Each service and plan has its own opening text, so no two enquiries share a message. "Choose This Plan" states
  intent to proceed. "Ask on WhatsApp" asks the plan's questions. Neither is a payment.

## Enquiry form

The contact form validates every field and never claims a submission was delivered unless the endpoint confirms it.

- **No endpoint configured (default):** submitting prepares the enquiry for WhatsApp, with the visitor's details
  already written. Nothing is sent from the site. The page says so.
- **Endpoint configured:** set `VITE_ENQUIRY_FORM_ENDPOINT` (see `.env.example`). The form sends a JSON `POST` with the
  fields `name`, `service`, `contactMethod`, `contact`, `message`, `consent` and `source`. A `2xx` response shows the
  success message. Any other response shows an error with a WhatsApp fallback.

The endpoint must accept requests from the site's origin (CORS). Use a form-handling service or a serverless
function that you control. Do not put any secret key in a `VITE_` variable, because those values are public.
The form has no spam protection yet. Add it through your form service before launch.

## SEO

- Each route sets its own title, description, Open Graph tags and canonical URL. Canonical and sitemap URLs need
  `websiteUrl` to be set.
- `npm run build` writes `public/robots.txt` on every build. It writes `public/sitemap.xml` only when `websiteUrl` is
  set, so the sitemap never contains placeholder addresses.
- JSON-LD structured data is intentionally not included. Add it only after the firm's details, including its address
  and registrations, have been verified.

## Deploying to Vercel

1. Push the repository to GitHub, then choose **Add New Project** in Vercel and import it.
2. Keep the root directory as the repository root. `vercel.json` builds `package.json` with `@vercel/static-build`,
   publishes `dist/`, and rewrites all paths to `index.html` so that client-side routes work on refresh.
3. If you use the enquiry form endpoint, add `VITE_ENQUIRY_FORM_ENDPOINT` under **Settings → Environment Variables**
   for Production (and Preview if needed), then redeploy.
4. After the first deploy, set `websiteUrl` in `siteConfig.js` to the live domain, then commit and push again so
   that the sitemap and canonical links are generated.
5. Add the custom domain under **Settings → Domains**.

Before deploying, run `npm run check` locally.

## Pre-launch checklist

**Content and business (must be complete before launch)**

- [ ] Real firm name, short name, tagline and logo.
- [ ] WhatsApp Business number in `whatsappNumber`. Send a test message from a second phone to confirm it arrives.
- [ ] Phone, email, office address, city, business hours, map embed URL and map link.
- [ ] Client-approved prices and billing in `plans.js`. Set `pricing.showSampleNotice` to `false`.
- [ ] Service descriptions, inclusions and scope notes confirmed by the firm.
- [ ] Partner name, role, qualifications and ICAI membership details confirmed, then `teamProfile.verified` set to `true`.
  Do not describe any membership, qualification or experience that has not been verified.
- [ ] Partner portrait (optional), with the client's permission.
- [ ] Privacy Policy, Terms of Use and Disclaimer reviewed by a qualified adviser. Fill in the bracketed items
  (retention period, jurisdiction). Set `legal.showDraftNotice` to `false`.
- [ ] Social links, copyright holder and year.

**Technical**

- [ ] `websiteUrl` set to the live domain, so the sitemap and canonical links are generated.
- [ ] `og-image.png` and `favicon.svg` replaced with approved assets, if the client has them.
- [ ] Enquiry form delivery chosen (endpoint or WhatsApp-only), with spam protection in place if an endpoint is used.
- [ ] `npm run check` passes.
- [ ] Manual test on a real Android phone and a real iPhone. Check the menu, the WhatsApp links and the form.
- [ ] A WhatsApp click from desktop and from mobile opens a pre-filled message, and the text is correct.
- [ ] Check the site in Google Search Console and submit the sitemap, after the domain is verified.

## External setup still required

- A WhatsApp Business account for the firm's number, and a decision on the business profile.
- A domain name and DNS access, pointed at Vercel.
- A form-delivery service or endpoint, if the firm wants online form submissions rather than WhatsApp only.
- Analytics: none is included. If you add any, update the Privacy Policy first, because the site currently states that
  it uses no advertising or analytics trackers.
- Legal review of the policy texts and a decision on the retention period.

## Notes on privacy

The site loads fonts from Google Fonts, and the Privacy Policy says so. No analytics, advertising pixels or cookies are
set by the template. The enquiry form asks for basic details only and blocks text that looks like PAN, Aadhaar, bank
account numbers, passwords or OTPs.
