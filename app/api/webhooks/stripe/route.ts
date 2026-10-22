import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MembershipType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { type DonationDetails, sendDonationNotificationToInfo, sendDonationThanksEmail } from "@/lib/donation-email";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { subscribeInfomaniakNewsletter } from "@/lib/infomaniak-newsletter";
import { addYears, memberFullName, splitMemberName } from "@/lib/membership-logic";
import { sendStripeWelcomeEmailSq } from "@/lib/membership-email-albanian";

type MembershipMetadata = {
  email: string;
  name: string;
  surname: string;
  uni: string;
  studium: string;
  type: MembershipType;
};

function parseMembershipType(value: string | undefined): MembershipType {
  return value === "ALUMNI" ? "ALUMNI" : "STUDENT";
}

function extractMembershipMetadata(
  session: Stripe.Checkout.Session
): MembershipMetadata | null {
  const metadata = session.metadata ?? {};
  const email = metadata.email ?? session.customer_details?.email ?? undefined;
  const uni = metadata.uni ?? metadata.university ?? undefined;
  const studium = metadata.studium ?? metadata.studyField ?? undefined;
  const type = parseMembershipType(metadata.type ?? undefined);

  const firstName = (metadata.firstName ?? "").trim();
  const surname = (metadata.surname ?? metadata.lastName ?? "").trim();
  const legacyFull = (metadata.name ?? session.customer_details?.name ?? "").trim();

  let name = firstName;
  let memberSurname = surname;
  if (!name && !memberSurname && legacyFull) {
    const split = splitMemberName(legacyFull);
    name = split.name;
    memberSurname = split.surname;
  }

  if (!email || !name || !memberSurname || !uni || !studium) {
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    name,
    surname: memberSurname,
    uni: uni.trim(),
    studium: studium.trim(),
    type,
  };
}

/**
 * Erfolgreiche Spende → Meldung an info@ und Dankesmail an den Spender.
 * Mail-Fehler werden nur geloggt (Antwort bleibt 200), damit Stripe nicht erneut sendet und doppelte Mails entstehen.
 */
async function handleDonationCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") {
    console.log("Spende noch nicht bezahlt:", session.id, session.payment_status);
    return;
  }

  const paymentIntent = await paymentIntentOf(stripe, session);
  if (paymentIntent?.metadata[PROCESSED_FLAG] === "1") {
    console.log("Spende bereits verarbeitet:", session.id);
    return;
  }

  const metadata = session.metadata ?? {};
  let paymentMethod = "unbekannt";
  const pm = paymentIntent?.payment_method as Stripe.PaymentMethod | null | undefined;
  if (pm?.type === "card") paymentMethod = `Karte${pm.card?.brand ? ` (${pm.card.brand})` : ""}`;
  else if (pm?.type === "twint") paymentMethod = "TWINT";
  else if (pm?.type) paymentMethod = pm.type;

  const details: DonationDetails = {
    name: metadata.name ?? session.customer_details?.name ?? "",
    email: metadata.email ?? session.customer_details?.email ?? "",
    amount: (session.amount_total ?? 0) / 100,
    message: metadata.message ?? "",
    paymentMethod,
    sessionId: session.id,
    paidAt: new Date(session.created * 1000),
    locale: isLocale(metadata.locale) ? metadata.locale : defaultLocale,
  };

  const [info, thanks] = await Promise.all([
    sendDonationNotificationToInfo(details),
    details.email ? sendDonationThanksEmail(details) : Promise.resolve({ ok: false, error: "keine E-Mail" }),
  ]);
  if (!info.ok) console.error("Spende: Mail an info@ fehlgeschlagen:", session.id, info.error);
  if (!thanks.ok) console.error("Spende: Dankesmail fehlgeschlagen:", session.id, thanks.error);
  console.log("Spende verarbeitet:", session.id, { info: info.ok, thanks: thanks.ok });
  if (paymentIntent) await markProcessed(stripe, paymentIntent);
}

/** Stripe kann dasselbe Ereignis mehrfach schicken; ein Merker am PaymentIntent verhindert doppelte Verarbeitung. */
const PROCESSED_FLAG = "webhook_processed";

async function paymentIntentOf(stripe: Stripe, session: Stripe.Checkout.Session): Promise<Stripe.PaymentIntent | null> {
  const id = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!id) return null;
  try {
    return await stripe.paymentIntents.retrieve(id, { expand: ["payment_method"] });
  } catch (err) {
    console.error("PaymentIntent nicht lesbar:", id, err);
    return null;
  }
}

async function markProcessed(stripe: Stripe, paymentIntent: Stripe.PaymentIntent) {
  try {
    await stripe.paymentIntents.update(paymentIntent.id, { metadata: { [PROCESSED_FLAG]: "1" } });
  } catch (err) {
    console.error("Merker am PaymentIntent nicht gesetzt:", paymentIntent.id, err);
  }
}

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured on server." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing webhook signature or secret." }, { status: 400 });
  }
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown webhook validation error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Wird eine Zahlung erst nach Abschluss des Checkouts bestätigt, kommt sie als eigenes Event
  // (checkout.session.async_payment_succeeded); bis dahin ist payment_status noch "unpaid".
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Spenden laufen über denselben Webhook, sind aber keine Mitgliedschaft (siehe app/donacione/actions.ts).
    if (session.metadata?.kind === "donation") {
      await handleDonationCompleted(stripe, session);
      return NextResponse.json({ received: true }, { status: 200 });
    }
    // Mitgliedschaft nur bei bestätigter Zahlung anlegen oder verlängern.
    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
      console.log("Mitgliedschaft: Zahlung noch nicht bestätigt:", session.id, session.payment_status);
      return NextResponse.json({ received: true }, { status: 200 });
    }
    const metadata = extractMembershipMetadata(session);
    if (!metadata) {
      // Z. B. Payment Links aus dem Dashboard: mit 200 quittieren, sonst versucht Stripe es tagelang erneut.
      console.warn("Checkout ohne Mitgliedsdaten ignoriert:", session.id);
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }
    const paymentIntent = await paymentIntentOf(stripe, session);
    if (paymentIntent?.metadata[PROCESSED_FLAG] === "1") {
      console.log("Mitgliedschaft bereits verarbeitet:", session.id);
      return NextResponse.json({ received: true }, { status: 200 });
    }
    try {
      const prior = await prisma.member.findUnique({
        where: { email: metadata.email },
        select: { expiresAt: true },
      });

      const nextExpiry = prior?.expiresAt
        ? addYears(prior.expiresAt, 1)
        : addYears(new Date(), 1);

      const member = await prisma.member.upsert({
        where: { email: metadata.email },
        update: {
          name: metadata.name,
          surname: metadata.surname,
          uni: metadata.uni,
          studium: metadata.studium,
          type: metadata.type,
          status: "ACTIVE",
          stripeId: session.customer ? String(session.customer) : null,
          expiresAt: nextExpiry,
          lastRenewalAt: new Date(),
        },
        create: {
          email: metadata.email,
          name: metadata.name,
          surname: metadata.surname,
          uni: metadata.uni,
          studium: metadata.studium,
          type: metadata.type,
          status: "ACTIVE",
          stripeId: session.customer ? String(session.customer) : null,
          expiresAt: nextExpiry,
          lastRenewalAt: new Date(),
        },
      });

      console.log("Mitglied erfolgreich gespeichert:", member.email);
      if (paymentIntent) await markProcessed(stripe, paymentIntent);

      try {
        await subscribeInfomaniakNewsletter(metadata.email, {
          firstName: metadata.name,
          lastName: metadata.surname,
        });
      } catch (newsletterError) {
        console.error("Infomaniak Newsletter (Stripe-Webhook):", newsletterError);
      }

      if (process.env.RESEND_API_KEY) {
        const mail = await sendStripeWelcomeEmailSq(
          metadata.email,
          memberFullName(metadata.name, metadata.surname),
          metadata.uni,
          metadata.type
        );
        if (!mail.sent && mail.error) {
          console.error("Resend Willkommens-Mail:", mail.error);
        }
      }

    } catch (dbError) {
      console.error("Datenbank-Fehler im Webhook:", dbError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}