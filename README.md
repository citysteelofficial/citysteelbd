# City Steel BD

Marketing website and self-service CMS for **City Steel Corporation** — a
pre-engineered steel building (PEB) manufacturer in Dhaka, Bangladesh.

Live at **[citysteelbd.com](https://citysteelbd.com)**.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Supabase.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the Supabase values
npm run dev              # http://localhost:3000
```

The admin panel is at `/admin`. Accounts are created in the Supabase dashboard
under Authentication → Users; there is no public signup.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build — typechecks and prerenders every route |
| `npm start` | Serve a production build locally |
| `npm run lint` | ESLint |

Run `npm run build` before pushing. `main` auto-deploys to Vercel.

## Database

Supabase Postgres. The idempotent SQL setup scripts live at the repo root and
can be re-run safely in the Supabase SQL Editor — start with
`supabase_schema.sql`.

## Documentation

**[HANDOVER.md](HANDOVER.md)** is the real reference: routing map, database
conventions, RLS rules, auth design, deployment, and known gaps. Read it before
making changes.

`AGENTS.md` carries instructions for AI coding agents working in this repo.
