import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import { canRenewMembership, isMembershipStillActive, RENEWAL_WINDOW_DAYS } from "@/lib/membership-logic";
import { membershipStripeCatalogRef, resolveStripeCheckoutPriceId } from "@/lib/stripe-membership-catalog";
import { getSiteOrigin } from "@/lib/site-url";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Server-Konfiguration fehlt: STRIPE_SECRET_KEY ist undefined." }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.json() as {
      email?: string; firstName?: string; surname?: string; lastName?: string; name?: string;
      university?: string; studyField?: string; type?: string; confirmEarlyRenewal?: boolean;
      turnstileToken?: string;
    };
    const givenName = String(body.firstName ?? "").trim();
    const familyName = String(body.surname ?? body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const uni = String(body.university ?? "").trim();
    const studium = String(body.studyField ?? "").trim();
    const type = body.type;
    const confirmEarlyRenewal = body.confirmEarlyRenewal === true;

    if (!givenName || !familyName) return NextResponse.json({ error: "Vor- und Nachname sind erforderlich." }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "E-Mail fehlt oder ist ungültig." }, { status: 400 });
    if (!uni || !studium) return NextResponse.json({ error: "Universität und Studiengang sind erforderlich." }, { status: 400 });
    if (type !== "STUDENT" && type !== "ALUMNI") return NextResponse.json({ error: "Ungültiger Mitgliedschaftstyp." }, { status: 400 });

    const turnstile = await verifyTurnstileToken(String(body.turnstileToken ?? "").trim());
    if (!turnstile.ok) {
      console.warn("[Checkout] Turnstile verification failed:", turnstile.error ?? "unknown");
      const dict = getDictionary(await getLocale());
      return NextResponse.json({ error: dict.membershipActions.errorTurnstile }, { status: 403 });
    }

    // Keine Daten (Ablaufdatum, Resttage) in der Antwort: sonst liesse sich für fremde Adressen abfragen,
    // bis wann jemand Mitglied ist. Das genaue Datum gibt es per Mail über „Status prüfen“.
    const existing = await prisma.member.findUnique({ where: { email }, select: { expiresAt: true } });
    if (existing?.expiresAt && !canRenewMembership(existing.expiresAt)) {
      return NextResponse.json({ code: "RENEW_TOO_EARLY", message: `Me këtë email ekziston tashmë një anëtarësim aktiv. Rinovimi online është i mundur vetëm kur kanë mbetur më pak se ${RENEWAL_WINDOW_DAYS} ditë deri në skadencë. Datën e saktë mund ta marrësh me email te „Kontrollo statusin“.` }, { status: 403 });
    }
    if (existing?.expiresAt && canRenewMembership(existing.expiresAt) && isMembershipStillActive(existing.expiresAt) && !confirmEarlyRenewal) {
      return NextResponse.json({ code: "CONFIRM_RENEWAL_REQUIRED", message: "Anëtarësimi me këtë email është ende aktiv. Nëse vazhdon me pagesë, viti i ri shtohet te data aktuale e skadencës, jo nga dita e sotme. Mund të anulosh ose të vazhdosh me pagesë." }, { status: 409 });
    }

    const priceId = await resolveStripeCheckoutPriceId(stripe, membershipStripeCatalogRef(type));
    const fullName = `${givenName} ${familyName}`.trim();
    const siteOrigin = getSiteOrigin();
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${siteOrigin}/membership/success`,
      cancel_url: `${siteOrigin}/membership`,
      metadata: { email, firstName: givenName, surname: familyName, lastName: familyName, name: fullName, uni, university: uni, studium, studyField: studium, type },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Fehler beim Checkout:", error);
    const detail = error instanceof Stripe.errors.StripeError ? error.message : undefined;
    return NextResponse.json({ error: "Fehler beim Erstellen der Stripe Session", ...(detail ? { detail } : {}) }, { status: 500 });
  }
}
