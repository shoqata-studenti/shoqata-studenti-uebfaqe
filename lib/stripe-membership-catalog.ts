import type Stripe from "stripe";

export type MembershipStripeType = "STUDENT" | "ALUMNI";

/** Stripe-Produkt-IDs (Standardpreis wird beim Checkout aufgelöst). */
const DEFAULT_PRODUCT_IDS: Record<MembershipStripeType, string> = {
  STUDENT: "prod_UXXWbMKtTHbovG",
  ALUMNI: "prod_UXXXszYuxOfr4i",
};

/** `price_…` direkt, sonst `prod_…` (Default-Preis des Produkts). */
export function membershipStripeCatalogRef(type: MembershipStripeType): string {
  const fromEnv =
    type === "STUDENT"
      ? process.env.STRIPE_STUDENT_PRICE_ID ?? process.env.STRIPE_STUDENT_PRODUCT_ID
      : process.env.STRIPE_ALUMNI_PRICE_ID ?? process.env.STRIPE_ALUMNI_PRODUCT_ID;
  const ref = fromEnv?.trim();
  return ref && ref.length > 0 ? ref : DEFAULT_PRODUCT_IDS[type];
}

export async function resolveStripeCheckoutPriceId(
  stripe: Stripe,
  catalogRef: string
): Promise<string> {
  const id = catalogRef.trim();
  if (id.startsWith("price_")) return id;
  if (!id.startsWith("prod_")) {
    throw new Error(`Ungültige Stripe-Katalog-Referenz: ${id}`);
  }

  const { data } = await stripe.prices.list({ product: id, active: true, limit: 20 });
  const price =
    data.find((p) => p.active && p.type === "one_time") ?? data.find((p) => p.active);
  if (!price) {
    throw new Error(`Kein aktiver Preis für Stripe-Produkt ${id}`);
  }
  return price.id;
}
