import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/db";
import { canRenewMembership, daysUntil, isMembershipStillActive, RENEWAL_WINDOW_DAYS } from "@/lib/membership-logic";
import { formatDateWithWeekdaySq } from "@/lib/format-datetime";
import { membershipStripeCatalogRef, resolveStripeCheckoutPriceId } from "@/lib/stripe-membership-catalog";
import { getSiteOrigin } from "@/lib/site-url";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Server-Konfiguration fehlt: STRIPE_SECRET_KEY ist undefined." }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.json() as {
      email?: string; firstName?: string; surname?: string; lastName?: string; name?: string;
      university?: string; studyField?: string; type?: string; confirmEarlyRenewal?: boolean;
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

    const existing = await prisma.member.findUnique({ where: { email }, select: { expiresAt: true } });
    if (existing?.expiresAt && !canRenewMembership(existing.expiresAt)) {
      const until = formatDateWithWeekdaySq(existing.expiresAt);
      return NextResponse.json({ code: "RENEW_TOO_EARLY", activeUntil: existing.expiresAt.toISOString(), message: `Anëtarësimi me këtë email është ende aktiv deri më ${until}. Rinovimi nëpërmjet pagesës online është i mundur vetëm kur kanë mbetur më pak se një muaj deri në skadencë (më pak se ${RENEWAL_WINDOW_DAYS} ditë).` }, { status: 403 });
    }
    if (existing?.expiresAt && canRenewMembership(existing.expiresAt) && isMembershipStillActive(existing.expiresAt) && !confirmEarlyRenewal) {
      const until = formatDateWithWeekdaySq(existing.expiresAt);
      const roughlyDaysLeft = Math.max(1, Math.ceil(daysUntil(existing.expiresAt)));
      return NextResponse.json({ code: "CONFIRM_RENEWAL_REQUIRED", activeUntil: existing.expiresAt.toISOString(), message: `Anëtarësimi juaj është ende aktiv deri më ${until}. Kanë mbetur afërsisht ${roughlyDaysLeft} ditë deri në skadencë. Nëse vazhdoni me pagesë, viti i ri do të shtohet datës aktuale të skadencës, jo nga dita e sotme. Mund të anuloni ose të vazhdoni me pagesë.` }, { status: 409 });
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
