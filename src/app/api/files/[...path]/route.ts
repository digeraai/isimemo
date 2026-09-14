import { NextRequest, NextResponse } from "next/server";
import { readGuestImage } from "@/lib/storage";

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const [eventId, filename] = params.path;
  const guestId = (filename || "").replace(/\.png$/, "");
  if (!eventId || !guestId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = readGuestImage(eventId, guestId);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
