# City Steel BD — Handover

Living reference for the citysteelbd.com codebase. Update it when architecture,
deployment, or data conventions change.

**Last updated:** 2026-08-11

---

## 1. What this is

Marketing website + self-service CMS for **City Steel Corporation**, a
pre-engineered steel building (PEB) manufacturer in Dhaka, Bangladesh.

| | |
|---|---|
| Live URL | https://citysteelbd.com |
| Hosting | Vercel (auto-deploys from `main`) |
| Repository | https://github.com/citysteelofficial/citysteelbd |
| Framework | Next.js 16.2.4 (App Router, Turbopack), React 19.2 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), design tokens in `src/app/globals.css` |
| Backend | Supabase — Postgres + Auth + Storage |
| Analytics | Google Analytics 4 — `G-D2RXQZ3S1K` (wired in `src/app/layout.tsx`) |
| Search Console | Verified via `metadata.verification.google` in `src/app/layout.tsx` |

**The client edits content themselves at `/admin`.** Treat that panel as a
production tool: anything that breaks it blocks their day-to-day work.

---

## 2. Environment

Only two variables, both public by design (Supabase anon key is protected by
Row Level Security, not by secrecy):

```
NEXT_PUBLIC_SUPABASE_URL=https://inewueivmpqjhncccjun.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

`.env` is gitignored. The same two are set in Vercel → Project → Settings →
Environment Variables. There is **no service-role key in this project** — every
write goes through the anon key and is authorised by RLS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # always run this before pushing
npm run lint
```

---

## 3. Routing map

Note the deliberate **singular = detail, plural = listing/category** split.
These URLs are indexed by Google — do not rename them without setting up
redirects first.

| Route | Type | Source |
|---|---|---|
| `/` | static, 60s ISR | `site_settings` (hero + what-we-do) |
| `/about` | static, 60s ISR | `site_settings` (about_* columns) |
| `/products` | static, 60s ISR | `product_categories` → links to category pages |
| `/products/[slug]` | dynamic | products filtered by `category`; 404s on unknown category |
| `/product/[slug]` | dynamic, 60s ISR | a single `products` row |
| `/services` | static, 60s ISR | `services` → links to detail pages |
| `/services/[slug]` | dynamic | services filtered by `category`; 404s if none |
| `/service/[slug]` | dynamic, 60s ISR | a single `services` row |
| `/projects` | static, 60s ISR | `projects` |
| `/project/[slug]` | dynamic, 60s ISR | a single `projects` row |
| `/blogs`, `/blogs/[slug]` | 60s ISR | `blogs` where `is_published = true` |
| `/career` | static, 60s ISR | `job_circulars` where `is_active` and not past `deadline` |
| `/contact` | static, 60s ISR | form writes to `contact_messages` |
| `/admin/**` | client-rendered | protected by Supabase Auth |
| `/sitemap.xml` | 1h ISR | generated from all published content |
| `/robots.txt` | static | disallows `/admin` |

### Why almost every page exports `revalidate`

The root layout builds the header navigation from `product_categories` and
`services`. A page **without** a `revalidate` export is prerendered once at
build time, so its navigation — and its content — freezes until the next
deploy. When you add a new page, export `revalidate` from it too:

```ts
export const revalidate = 60;
```

This applies to `src/app/sitemap.ts` as well; without it, content the client
publishes never reaches Google until someone redeploys.

---

## 4. Database

Schema lives in the SQL files at the repo root. They are **idempotent** —
safe to re-run in the Supabase dashboard → SQL Editor.

| File | Creates |
|---|---|
| `supabase_schema.sql` | `projects`, `products`, `services`, `blogs`, `contact_messages` |
| `setup_settings.sql` | `site_settings` (homepage + about page copy) |
| `setup_product_categories.sql` | `product_categories` |
| `setup_job_circulars.sql` | `job_circulars` |
| `update_products_schema.sql` | adds `products.specifications` (JSONB) |
| `update_about_settings.sql` | adds the `about_*` columns to `site_settings` |

**`site_settings` always has exactly one row, `id = 1`.** The admin About and
Home screens update that row in place.

### Row Level Security

RLS is enabled on every table and is the *only* thing protecting writes:

- **Public read** on projects, products, product_categories, services, site_settings
- **Conditional public read** on blogs (`is_published = true`) and job_circulars (`is_active = true`)
- **Public insert only** on `contact_messages` — anonymous visitors can submit but never read
- **Authenticated = full access** on everything else

Any new table needs its own policies or it will be invisible to the site.

### Category conventions

`products.category` stores the **slug** of a `product_categories` row (not the
id, not the title). `services.category` is a free-text slug with no lookup
table — a service category "exists" only while some service references it.

---

## 5. Media

Images are uploaded through the admin panel to Supabase Storage
(`src/lib/upload.ts`, default bucket `project-images`) and stored as public
URLs. The bucket hostname is allow-listed in `next.config.ts` under
`images.remotePatterns` — a new bucket or project ref must be added there or
`next/image` will refuse to load it.

---

## 6. Rich text and XSS

The admin editor is `react-quill-new` (`src/components/admin/RichTextEditor.tsx`).
Its HTML is stored raw in the database and rendered with
`dangerouslySetInnerHTML`, so **every render path must pass it through
`sanitizeHtml()` from `src/lib/sanitize.ts` first.** That helper allow-lists
tags and attributes and permits iframes only from YouTube and Vimeo.

> Historical note: an earlier version used `isomorphic-dompurify`, which
> crashed in server components. Do not reintroduce it — `sanitize-html` is
> pure JS and safe in both environments.

---

## 7. Admin authentication

`src/app/admin/layout.tsx` guards the panel client-side: it calls
`supabase.auth.getSession()`, subscribes to `onAuthStateChange`, and renders a
spinner instead of the admin shell until a session is confirmed.

**Sessions live in `localStorage`, not cookies.** That is why there is no
`proxy.ts` (the Next 16 replacement for `middleware.ts`) doing auth — server
middleware cannot see a localStorage session, and adding a naive one would lock
the client out of their own panel. Real server-side route protection requires
migrating to `@supabase/ssr` with cookie-based sessions first.

The data itself is never exposed by this arrangement: RLS blocks every
unauthenticated write regardless of what the browser renders. `/admin` also
sends `X-Robots-Tag: noindex` via `next.config.ts`.

Admin accounts are created in Supabase Dashboard → Authentication → Users.
There is no self-service signup.

---

## 8. Contact form

`src/components/site/ContactClient.tsx` inserts into `contact_messages` and
then opens a prefilled WhatsApp thread to `+8801711787556`. If the browser
blocks the popup, a manual "Also send via WhatsApp" link is shown instead.

Spam defences are client-side: a visually hidden honeypot field
(`company_website`) and a minimum fill time of 3 seconds. Both fail silently so
bots get no feedback. Submissions are also length- and format-validated before
insert.

This does **not** stop a determined attacker posting to the Supabase REST API
directly — the anon key is public. Hardening that further means moving the
insert behind a route handler with a service-role key and revoking the public
insert policy. See "Known gaps" below.

The Career page's Apply button links to `/contact?subject=Job Application: <title>`
and the form prefills that subject on mount.

---

## 9. Deployment

Push to `main` → Vercel builds and deploys automatically. There is no
`vercel.json`; the project uses Vercel's Next.js defaults.

Before pushing:

```bash
npm run build    # must pass — it typechecks and prerenders every route
```

To sanity-check a build the way production serves it:

```bash
npx next start -p 3111
```

---

## 10. Known gaps / possible next steps

Not bugs — deliberate scope boundaries, recorded so the next person does not
rediscover them.

1. **No server-side admin route protection.** Requires the `@supabase/ssr`
   cookie migration described in §7. Would log every admin out once on deploy.
2. **Contact form insert is client-side.** A route handler with a service-role
   key plus rate limiting would close the direct-API spam vector.
3. **No CV upload for job applications.** Applicants are funnelled to the
   contact form. A `job_applications` table plus a Storage bucket would fix it.
4. **`logo.svg` is 306 KB** (auto-traced vector, `public/` and `src/assets/`)
   and `og-image.jpg` is 658 KB. Both ship on page load and would benefit from
   SVGO / recompression.
5. **Data hygiene, fixable by the client in `/admin`:**
   - Service "Civil Construction" has the leftover slug `test-service-jetski`
   - Service slug `Complete-solution-to-the-steel-structure` has a capital letter
   - `product_categories` contains both `rafter` (empty) and `steel-rafter`
   Changing a slug changes its public URL, so redirect or accept the 404.
6. **`blogs.slug` legacy prefix.** Some rows were saved as `/blogs/my-post`.
   `src/lib/slug.ts` (`cleanSlug`) and a fallback query in
   `src/app/blogs/[slug]/page.tsx` absorb this. Remove once the data is clean.

---

## 11. Gotchas

- **This is Next.js 16.** `middleware.ts` is now `proxy.ts`; several caching
  APIs changed. Read `node_modules/next/dist/docs/` before assuming an older
  API still applies — that is also what `AGENTS.md` instructs.
- **Route segment `revalidate` still works** because Cache Components is not
  enabled in `next.config.ts`. Turning it on removes `dynamic`, `dynamicParams`,
  `revalidate`, and `fetchCache` — that would be a project-wide migration.
- **Do not use `useSearchParams()` in a top-level page client component.** It
  forces the subtree behind a Suspense boundary and drops the content out of the
  server-rendered HTML. Read `window.location.search` in an effect instead.
- **Windows + git "dubious ownership".** After a Windows reinstall the SID
  changes and git refuses to run. Fix:
  `git config --global --add safe.directory '<repo path>'`
