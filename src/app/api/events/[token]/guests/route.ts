import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseGuestCsv } from "@/lib/csv";

const MAX_GUESTS = 500;

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const event = await prisma.event.findUnique({
    where: { manageToken: params.token },
    include: { _count: { select: { guests: true } } },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const remaining = MAX_GUESTS - event._count.guests;
  if (remaining <= 0) {
    return NextResponse.json(
      { error: `isiMemo caps events at ${MAX_GUESTS} guests.` },
      { status: 400 }
    );
  }

  let toAdd: { name: string; email?: string; phone?: string; language?: string }[] = [];
  const errors: string[] = [];

  if (typeof body.csv === "string") {
    const parsed = parseGuestCsv(body.csv);
    toAdd = parsed.rows;
    errors.push(...parsed.errors);
  } else if (typeof body.name === "string" && body.name.trim()) {
    toAdd = [
      {
        name: body.name.trim(),
        email: body.email?.trim() || undefined,
        phone: body.phone?.trim() || undefined,
        language: body.language?.trim() || undefined,
      },
    ];
  } else {
    return NextResponse.json({ error: "Provide either csv text or a name." }, { status: 400 });
  }

  if (toAdd.length > remaining) {
    errors.push(
      `Only ${remaining} guest slot(s) left on this event (${MAX_GUESTS} max) — added the first ${remaining}, skipped the rest.`
    );
    toAdd = toAdd.slice(0, remaining);
  }

  const created = await prisma.$transaction(
    toAdd.map((g) =>
      prisma.guest.create({
        data: {
          eventId: event.id,
          name: g.name,
          email: g.email,
          phone: g.phone,
          language: g.language || "en",
        },
      })
    )
  );

  return NextResponse.json({ created: created.length, errors });
}
