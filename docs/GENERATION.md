# Invitation generation pipeline

**Note:** this pipeline produces the *optional* downloadable-image fallback. The primary guest
experience is the live, animated page at `/invite/[token]` (envelope open, scratch-to-reveal date,
timeline, countdown, map, RSVP — see each template's `Live` component) — that link works as soon as
the event is paid, with no generation step required. This PNG pipeline exists for hosts/guests who
still want a static image (e.g. for a WhatsApp status).

When a host clicks **Generate images**, `POST /api/events/[token]/generate`:

1. Marks the event `GENERATING`.
2. Responds immediately (so the request never times out).
3. In the background, loops over guests with no `imageUrl` yet, and for each one:
   - Builds the guest's personalized `InviteData` (event details + this guest's name and a unique RSVP URL).
   - Renders the template's `Static` component to SVG via `satori`, then to PNG via `@resvg/resvg-js` (see `src/lib/render.ts`).
   - Writes the PNG to disk under `GENERATED_DIR/<eventId>/<guestId>.png` (see `src/lib/storage.ts`) and updates the guest row.
4. Marks the event `READY` once every guest has been processed.

The dashboard polls `GET /api/events/[token]` every 2 seconds while the event is `GENERATING` and shows a live count.

## Why this is fine for the current 500-guest ceiling, and what changes if that ceiling ever goes up

This runs in-process on a long-lived Node server (Railway, not a serverless function), so there's no per-request timeout to worry about — a 500-guest batch just takes however long 500 renders take (a few minutes, depending on template complexity). That's the right amount of engineering for a v1.

It does **not** survive a server restart mid-batch (a deploy, a crash) — any guest not yet rendered stays without an image, and the host can just click **Generate remaining** again once the server's back, since the loop only processes guests missing an `imageUrl`. That's an acceptable gap for an MVP, not something to over-build before there are real customers.

If isiMemo later moves this to serverless hosting, or the guest ceiling goes well above 500, replace the in-process loop with a real job queue (BullMQ + Redis, or SQS + a worker) that fans out one job per guest — the render and storage functions (`renderInviteToPng`, `writeGuestImage`) don't need to change, only what calls them.
