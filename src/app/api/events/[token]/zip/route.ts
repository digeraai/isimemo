import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { PassThrough } from "node:stream";
import type { Guest } from "@prisma/client";
import { prisma } from "@/lib/db";
import { readGuestImage } from "@/lib/storage";

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const event = await prisma.event.findUnique({
    where: { manageToken: params.token },
    include: { guests: true },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const withImages = event.guests.filter((g: Guest) => g.imageUrl);
  if (withImages.length === 0) {
    return NextResponse.json({ error: "No generated invitations yet." }, { status: 400 });
  }

  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new PassThrough();
  archive.pipe(stream);

  for (const guest of withImages) {
    const data = readGuestImage(event.id, guest.id);
    if (!data) continue;
    const safeName = guest.name.replace(/[^a-z0-9\-_ ]/gi, "").trim() || guest.id;
    archive.append(data, { name: `${safeName}.png` });
  }
  archive.finalize();

  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  const zipBuffer = Buffer.concat(chunks);

  const safeTitle = event.title.replace(/[^a-z0-9\-_ ]/gi, "").trim() || "invitations";
  return new NextResponse(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeTitle}.zip"`,
    },
  });
}
