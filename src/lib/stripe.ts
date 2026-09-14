import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it in Railway variables, or leave it unset to use dev mode (events are auto-marked paid so you can test the rest of the flow)."
      );
    }
    _stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return _stripe;
}
