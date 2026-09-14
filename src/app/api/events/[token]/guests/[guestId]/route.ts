import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { token: string; guestId: string } }
) {
  const event = await prisma.event.findUnique({ where: { manageToken: params.token } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.guest.deleteMany({ where: { id: params.guestId, eventId: event.id } });
  return NextResponse.json({ ok: true });
}
