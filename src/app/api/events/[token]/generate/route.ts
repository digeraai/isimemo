import { NextRequest, NextResponse } from "next/server";
import type { Guest } from "@prisma/client";
import { prisma } from "@/lib/db";
import { renderInviteToPng } from "@/lib/render";
import { writeGuestImage } from "@/lib/storage";
import { buildInviteData } from "@/lib/inviteData";

// Fires the render loop and returns immediately; the dashboard polls GET
// /api/events/[token] (event.status + per-guest generatedAt) for progress.
//
// This runs the loop in-process on a persistent Node server (Railway), which
// is fine up to the 500-guest ceiling. If isiMemo later moves to serverless
// hosting, replace this with a real job queue (BullMQ + Redis, or SQS) so a
// function timeout can't strand a batch half-rendered.
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const event = await prisma.event.findUnique({
    where: { manageToken: params.token },
    include: { guests: true },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (event.status !== "PAID" && event.status !== "GENERATING" && event.status !== "READY") {
    return NextResponse.json({ error: "Event must be paid before generating invitations." }, { status: 400 });
  }
  if (event.guests.length === 0) {
    return NextResponse.json({ error: "No guests to generate for." }, { status: 400 });
  }

  const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
  await prisma.event.update({ where: { id: event.id }, data: { status: "GENERATING" } });

  const pending = event.guests.filter((g: Guest) => !g.imageUrl);

  // Intentionally not awaited: the API responds immediately, rendering
  // continues in the background on this process.
  (async () => {
    for (const guest of pending) {
      try {
        const data = buildInviteData(event, guest, origin);
        const png = await renderInviteToPng(event.templateSlug, data);
        const url = writeGuestImage(event.id, guest.id, png);
        await prisma.guest.update({
          where: { id: guest.id },
          data: { imageUrl: url, generatedAt: new Date() },
        });
      } catch (err) {
        console.error(`Failed to render guest ${guest.id}:`, err);
      }
    }
    await prisma.event.update({ where: { id: event.id }, data: { status: "READY" } });
  })().catch((err) => console.error("Generation batch failed:", err));

  return NextResponse.json({ status: "GENERATING", queued: pending.length });
}
