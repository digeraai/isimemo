# isiMemo

Self-serve digital invitations. Pick a template, add a guest list, isiMemo generates a
personalized invitation (a live web page + a downloadable PNG) and RSVP link for every
guest, then hands back a delivery hub with per-guest share links and a "download all"
ZIP. One-time payment per event, tiered by guest count up to 500.

This is the Phase 1 MVP described in the isiMemo product plan: 3 templates (wedding,
birthday, corporate), CSV/manual guest import, background generation, RSVP capture,
Stripe checkout (or dev mode without it), delivery dashboard.

## Stack

Next.js 14 (App Router) + TypeScript + Tailwind · Prisma + Postgres · Stripe Checkout ·
`satori` + `@resvg/resvg-js` for server-side PNG rendering of each guest's invitation ·
plain Node filesystem for storage (a Railway Volume in production).

## Local development

1. `npm install`
2. Have a Postgres reachable locally (or point at the same Postgres this project
   provisioned on Railway — see below). Copy `.env.example` to `.env` and set
   `DATABASE_URL`.
3. `npm run db:push` — creates the tables (MVP uses `prisma db push`, not formal
   migrations yet; see the note in `railway.json`).
4. `npm run dev` — open http://localhost:3000.

Without `STRIPE_SECRET_KEY` set, checkout runs in **dev mode**: clicking "Pay & unlock
generation" marks the event paid immediately, so you can exercise the entire flow —
template → guests → generate → deliver → RSVP — with no payment integration required.

## What's built vs. what's next

Built: template gallery, event details form, CSV + manual guest import (500-guest cap
enforced), background PNG generation per guest (see `docs/GENERATION.md`), delivery hub
with copy-link/WhatsApp/download actions and a ZIP-all download, public per-guest
invitation page with an RSVP form, Stripe Checkout wired to the 5 pricing tiers (falls
back to dev mode if no Stripe key is set).

Deliberately not built yet (see the product plan's Phase 2/3): host accounts/auth (an
event's "manage" link is a secret token — anyone with the link can edit it, which is
fine for a single-founder MVP but not for launch), QR codes, PDF export, multi-language
content, live RSVP analytics/export, a real job queue for generation (the current
in-process loop is documented as the thing to swap out first if volume grows), more
templates, and the agency/subscription pricing tier.

## Deployment — Railway

A Railway project named **isimemo** already exists in the digeraai workspace, with:

- A `Postgres` service (Docker `postgres:16`, with a persistent volume at
  `/var/lib/postgresql/data`, credentials set as `POSTGRES_USER` /
  `POSTGRES_PASSWORD` / `POSTGRES_DB`).
- A `web` service (currently empty — no source connected yet) with a persistent
  volume at `/data` and its `DATABASE_URL` already pointed at the Postgres service
  via a variable reference, plus `GENERATED_DIR=/data/generated`.

To finish deploying:

1. Push this repository to GitHub (e.g. `digera-ai/isimemo`).
2. Connect the `web` service to that repo — either in the Railway dashboard
   ("Connect repo" on the `web` service), or tell me the `owner/repo` and I can wire
   it up the same way I provisioned the two services above.
3. Railway will build with Nixpacks (`npm run build`, which runs `prisma generate`
   first) and start with `railway.json`'s `startCommand`, which runs
   `prisma db push` before `npm run start` so the schema is applied automatically
   on deploy.
4. Generate a public domain for the `web` service (Railway dashboard → Settings →
   Networking → Generate Domain), then point `www.isimemo.com`'s DNS at it as a
   CNAME once you're ready to go live on the real domain.
5. Optional: add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as variables on the
   `web` service to take it out of dev-mode checkout.

## Repo layout

```
src/app/                  Pages + API routes (App Router)
src/lib/templates/        Each template: a Live (browser) component and a Static
                          (satori-safe) component sharing one InviteData shape
src/lib/render.ts         Static component -> SVG (satori) -> PNG (resvg)
src/lib/storage.ts        Where generated PNGs are written/read on disk
src/lib/tiers.ts          The 5 pricing tiers (single source of truth for pricing)
prisma/schema.prisma      Event / Guest data model
docs/GENERATION.md        How the background render pipeline works, and its limits
```
