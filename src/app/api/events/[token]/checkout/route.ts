import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { tierFor } from "@/lib/tiers";
import { getStripe, stripeEnabled } from "@/lib/stripe";

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const event = await prisma.event.findUnique({
    where: { manageToken: params.token },
    include: { _count: { select: { guests: true } } },
  });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const guestCount = event._count.guests;
  if (guestCount === 0) {
    return NextResponse.json({ error: "Add at least one guest before checking out." }, { status: 400 });
  }
  const tier = tierFor(guestCount);
  if (!tier) {
    return NextResponse.json({ error: "Guest count exceeds isiMemo's 500-guest ceiling." }, { status: 400 });
  }

  const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;

  // Dev/demo mode: no Stripe key configured. Mark the event paid immediately
  // so the rest of the flow (generation, delivery, RSVP) can be exercised
  // end-to-end without a live payment integration.
  if (!stripeEnabled()) {
    await prisma.event.update({ where: { id: event.id }, data: { status: "PAID", tier: tier.id } });
    return NextResponse.json({ devMode: true, redirectUrl: `/manage/${params.token}?paid=1` });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "zar",
          unit_amount: tier.priceZAR * 100,
          product_data: {
            name: `isiMemo — ${tier.label} (up to ${tier.maxGuests} guests)`,
            description: event.title,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { manageToken: params.token, tier: tier.id },
    success_url: `${origin}/manage/${params.token}?paid=1`,
    cancel_url: `${origin}/manage/${params.token}?paid=0`,
  });

  await prisma.event.update({
    where: { id: event.id },
    data: { stripeSessionId: session.id, tier: tier.id },
  });

  return NextResponse.json({ redirectUrl: session.url });
}
