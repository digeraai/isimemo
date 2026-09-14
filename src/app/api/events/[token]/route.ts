import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const event = await prisma.event.findUnique({
    where: { manageToken: params.token },
    include: { guests: { orderBy: { createdAt: "asc" } } },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req: NextRequest, { params }: { params: { token: string } }) {
  const event = await prisma.event.findUnique({ where: { manageToken: params.token } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const allowed = [
    "title",
    "hostNames",
    "venueName",
    "venueAddress",
    "message",
    "themeColor",
    "quote",
    "quoteAttribution",
    "dressCode",
    "dressCodeNote",
    "giftListUrl",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  // JSON-array fields: validate before persisting rather than trusting the client blindly.
  for (const key of ["timeline", "dressCodeColors"] as const) {
    if (typeof body[key] === "string") {
      try {
        const parsed = JSON.parse(body[key]);
        if (Array.isArray(parsed)) data[key] = body[key];
      } catch {
        // ignore malformed JSON rather than failing the whole save
      }
    }
  }
  if (typeof body.eventDate === "string" && body.eventDate) {
    const d = new Date(body.eventDate);
    if (!isNaN(d.getTime())) data.eventDate = d;
  }
  if (typeof body.rsvpDeadline === "string" && body.rsvpDeadline) {
    const d = new Date(body.rsvpDeadline);
    if (!isNaN(d.getTime())) data.rsvpDeadline = d;
  }

  const updated = await prisma.event.update({ where: { id: event.id }, data });
  return NextResponse.json(updated);
}
