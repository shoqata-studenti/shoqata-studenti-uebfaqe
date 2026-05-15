import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MembershipType } from "@prisma/client";
import { prisma } from "@/lib/db";
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = extractMembershipMetadata(session);
    if (!metadata) {
      return NextResponse.json({ error: "Missing membership metadata in checkout session." }, { status: 400 });
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