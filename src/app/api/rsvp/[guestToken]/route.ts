import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { guestToken: string } }) {
  const guest = await prisma.guest.findUnique({ where: { token: params.guestToken } });
  if (!guest) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const status = body.status === "DECLINED" ? "DECLINED" : "ATTENDING";
  const rsvpGuests = Number.isFinite(body.partySize) ? Math.max(1, Math.min(20, Number(body.partySize))) : 1;
  const rsvpNote = typeof body.note === "string" ? body.note.slice(0, 500) : undefined;

  const updated = await prisma.guest.update({
    where: { id: guest.id },
    data: { rsvpStatus: status, rsvpGuests, rsvpNote },
  });

  return NextResponse.json({ ok: true, rsvpStatus: updated.rsvpStatus });
}
