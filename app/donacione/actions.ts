"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { SwissQRCode } from "swissqrbill/svg";
import { formatIBAN } from "swissqrbill/utils";

import {
  cleanQrNote,
  DONATION_LABEL,
  DONATION_MAX_QR_CHF,
  DONATION_MAX_STRIPE_CHF,
  donationQrBillData,
  donationsEnabled,
  getDonationCreditor,
  parseChfAmount,
  TWINT_MAX_CHF,
} from "@/lib/donation-config";
import { getLocale } from "@/lib/i18n/server";
import { getSiteOrigin } from "@/lib/site-url";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { DONATION_MESSAGE_MAX_LENGTH, type DonationCheckoutState, type QrBillState } from "./form-state";

const STRIPE_LOCALE = { sq: "auto", de: "de", en: "en" } as const;

export async function startDonationCheckout(
  _prevState: DonationCheckoutState,
  formData: FormData
): Promise<DonationCheckoutState> {
  if (!donationsEnabled() || !process.env.STRIPE_SECRET_KEY || !process.env.TURNSTILE_SECRET_KEY?.trim()) {
    return { status: "error", error: "config" };
  }

  // Honeypot — Bots füllen dieses versteckte Feld aus, echte Nutzer nicht
  if (formData.get("website_url")?.toString()) {
    return { status: "error", error: "fields" };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", error: "fields" };
  }

  const amount = parseChfAmount(formData.get("amount")?.toString() ?? "", DONATION_MAX_STRIPE_CHF);
  if (amount === null) {
    return { status: "error", error: "amount" };
  }

  const message = (formData.get("message")?.toString().trim() ?? "").slice(0, DONATION_MESSAGE_MAX_LENGTH);

  const turnstileToken = formData.get("cf-turnstile-response")?.toString().trim() ?? "";
  const turnstileResult = await verifyTurnstileToken(turnstileToken);
  if (!turnstileResult.ok) {
    console.warn("[Spende] Turnstile verification failed:", turnstileResult.error ?? "unknown");
    return { status: "error", error: "turnstile" };
  }

  let checkoutUrl: string | null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const locale = await getLocale();
    // Next.js prüft bei Server Actions, dass Origin zum Host passt; so funktioniert die Rückleitung auch über einen Tunnel.
    const siteOrigin = (await headers()).get("origin") ?? getSiteOrigin();
    // Der Webhook liest diese Felder für die Mails an den Verein und an den Spender (lib/donation-email.ts).
    const metadata = { kind: "donation", name, email, message, locale };

    // Kunde mit Namen, damit jede Spende im Dashboard einer Person zugeordnet ist.
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] ?? (await stripe.customers.create({ email, name }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      payment_method_types: amount <= TWINT_MAX_CHF ? ["card", "twint"] : ["card"],
      customer: customer.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "chf",
            unit_amount: Math.round(amount * 100),
            product_data: { name: DONATION_LABEL },
          },
        },
      ],
      payment_intent_data: {
        description: `${DONATION_LABEL} – ${name}`,
        metadata,
      },
      metadata,
      locale: STRIPE_LOCALE[locale],
      success_url: `${siteOrigin}/donacione?status=success`,
      cancel_url: `${siteOrigin}/donacione`,
    });
    checkoutUrl = session.url;
  } catch (error) {
    console.error("[Spende] Stripe Checkout fehlgeschlagen:", error);
    return { status: "error", error: "stripe" };
  }

  if (!checkoutUrl) {
    return { status: "error", error: "stripe" };
  }
  redirect(checkoutUrl);
}

export async function createQrBill(_prevState: QrBillState, formData: FormData): Promise<QrBillState> {
  const creditor = getDonationCreditor();
  if (!donationsEnabled() || !creditor) {
    return { status: "error", error: "config" };
  }

  const amount = parseChfAmount(formData.get("amount")?.toString() ?? "", DONATION_MAX_QR_CHF);
  if (amount === null) {
    return { status: "error", error: "amount" };
  }

  const note = cleanQrNote(formData.get("message")?.toString() ?? "");

  try {
    const data = donationQrBillData(creditor, amount, note);
    const qrCode = new SwissQRCode(data);
    return {
      status: "success",
      qrCodeSvg: qrCode.toString(),
      amount,
      note,
      creditorName: creditor.name,
      creditorAddress: `${creditor.address} ${creditor.buildingNumber ?? ""}, ${creditor.zip} ${creditor.city}`.replace(" ,", ","),
      iban: formatIBAN(creditor.account),
      message: data.message,
    };
  } catch (error) {
    console.error("[Spende] QR-Rechnung fehlgeschlagen:", error);
    return { status: "error", error: "server" };
  }
}
