import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTemplate } from "@/lib/templates";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const templateSlug = body.templateSlug as string | undefined;

  if (!templateSlug || !getTemplate(templateSlug)) {
    return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      templateSlug,
      title: "My Event",
      hostNames: "Your Name",
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default: 30 days out
    },
  });

  return NextResponse.json({ id: event.id, manageToken: event.manageToken });
}
