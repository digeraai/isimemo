export type TierId = "STARTER" | "ESSENTIAL" | "PLUS" | "PREMIUM" | "GRAND";

export interface TierDef {
  id: TierId;
  label: string;
  maxGuests: number;
  priceZAR: number; // one-time price, South African Rand (Digera is SA-based)
  blurb: string;
}

// Pricing per the isiMemo plan: one-time per event, tiered by guest count up to 500.
// ZAR figures are a starting point translated from the ~$9-119 USD band proposed in
// the plan doc; adjust in one place here once real pricing is finalized.
export const TIERS: TierDef[] = [
  { id: "STARTER", label: "Starter", maxGuests: 25, priceZAR: 199, blurb: "Small gatherings & intimate parties" },
  { id: "ESSENTIAL", label: "Essential", maxGuests: 75, priceZAR: 399, blurb: "Birthdays & baby showers" },
  { id: "PLUS", label: "Plus", maxGuests: 150, priceZAR: 649, blurb: "Mid-size weddings" },
  { id: "PREMIUM", label: "Premium", maxGuests: 300, priceZAR: 999, blurb: "Large weddings & corporate events" },
  { id: "GRAND", label: "Grand", maxGuests: 500, priceZAR: 1499, blurb: "Galas & big launches" },
];

export function tierFor(guestCount: number): TierDef | null {
  return TIERS.find((t) => guestCount <= t.maxGuests) ?? null;
}

export function getTier(id: string | null | undefined): TierDef | undefined {
  return TIERS.find((t) => t.id === id);
}
