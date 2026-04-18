import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { MembershipType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

type MembershipMetadata = {
  email: string;
  name: string;
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
  const name = metadata.name ?? session.customer_details?.name ?? undefined;
  const uni = metadata.uni ?? metadata.university ?? undefined;
  const studium = metadata.studium ?? metadata.studyField ?? undefined;
  const type = parseMembershipType(metadata.type ?? undefined);

  if (!email || !name || !uni || !studium) {
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    name: name.trim(),
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
    const nextExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    try {
      const member = await prisma.member.upsert({
        where: { email: metadata.email },
        update: {
          name: metadata.name,
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

      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Mitgliedschaft <onboarding@resend.dev>",
          to: metadata.email,
          subject: "Willkommen bei der Shoqata!",
          html: `
            <h1>Hallo ${metadata.name}!</h1>
            <p>Vielen Dank für deine Zahlung. Deine Mitgliedschaft (${metadata.type}) ist nun aktiv.</p>
            <p>Deine Daten wurden erfolgreich für die Uni ${metadata.uni} hinterlegt.</p>
            <p>Viel Erfolg im Studium!</p>
          `,
        });
      }

    } catch (dbError) {
      console.error("Datenbank-Fehler im Webhook:", dbError);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}