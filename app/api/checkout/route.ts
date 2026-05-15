import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/db";
import {
  canRenewMembership,
  daysUntil,
  isMembershipStillActive,
  RENEWAL_WINDOW_DAYS,
} from "@/lib/membership-logic";

function formatExpirySq(date: Date): string {
  return date.toLocaleDateString("sq-AL", {
    dateStyle: "long",
    timeZone: "Europe/Zurich",
  });
}

export async function POST(req: Request) {
  console.log("SUCHE KEY:", process.env.STRIPE_SECRET_KEY ? "GEFUNDEN" : "NICHT GEFUNDEN");
  console.log("SUCHE URL:", process.env.NEXT_PUBLIC_URL ? "GEFUNDEN" : "NICHT GEFUNDEN");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("KRITISCHER FEHLER: STRIPE_SECRET_KEY wird nicht gefunden!");
    return NextResponse.json(
      {
        error:
          "Server-Konfiguration fehlt: STRIPE_SECRET_KEY ist undefined. Prüfe deine .env Datei.",
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.json();
    const {
      email: emailRaw,
      firstName,
      surname,
      lastName,
      name: legacyName,
      university,
      studyField,
      type,
      confirmEarlyRenewal: confirmRaw,
    } = body as {
      email?: string;
      firstName?: string;
      surname?: string;
      lastName?: string;
      name?: string;
      university?: string;
      studyField?: string;
      type?: string;
      confirmEarlyRenewal?: boolean;
    };

    const givenName = String(firstName ?? "").trim();
    const familyName = String(surname ?? lastName ?? "").trim();
    const email = String(emailRaw ?? "").trim().toLowerCase();
    const uni = String(university ?? "").trim();
    const studium = String(studyField ?? "").trim();
    const confirmEarlyRenewal = confirmRaw === true;

    let memberName = givenName;
    let memberSurname = familyName;
    if (!memberName && !memberSurname && legacyName) {
      const parts = String(legacyName).trim().split(/\s+/);
      memberName = parts[0] ?? "";
      memberSurname = parts.slice(1).join(" ");
    }

    if (!memberName || !memberSurname) {
      return NextResponse.json({ error: "Vor- und Nachname sind erforderlich." }, { status: 400 });
    }

    const fullName = `${memberName} ${memberSurname}`.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "E-Mail fehlt oder ist ungültig." }, { status: 400 });
    }

    if (!uni || !studium) {
      return NextResponse.json({ error: "Universität und Studiengang sind erforderlich." }, { status: 400 });
    }

    if (type !== "STUDENT" && type !== "ALUMNI") {
      return NextResponse.json({ error: "Ungültiger Mitgliedschaftstyp." }, { status: 400 });
    }

    const existing = await prisma.member.findUnique({
      where: { email },
      select: { expiresAt: true },
    });

    if (existing?.expiresAt && !canRenewMembership(existing.expiresAt)) {
      const until = formatExpirySq(existing.expiresAt);
      return NextResponse.json(
        {
          code: "RENEW_TOO_EARLY",
          activeUntil: existing.expiresAt.toISOString(),
          message: `Anëtarësimi me këtë email është ende aktiv deri më ${until}. Rinovimi nëpërmjet pagesës online është i mundur vetëm kur kanë mbetur më pak se një muaj deri në skadencë (pak se ${RENEWAL_WINDOW_DAYS} ditë).`,
        },
        { status: 403 }
      );
    }

    if (
      existing?.expiresAt &&
      canRenewMembership(existing.expiresAt) &&
      isMembershipStillActive(existing.expiresAt) &&
      !confirmEarlyRenewal
    ) {
      const until = formatExpirySq(existing.expiresAt);
      const roughlyDaysLeft = Math.max(1, Math.ceil(daysUntil(existing.expiresAt)));
      return NextResponse.json(
        {
          code: "CONFIRM_RENEWAL_REQUIRED",
          activeUntil: existing.expiresAt.toISOString(),
          message: `Anëtarësimi juaj është ende aktiv deri më ${until}. Kanë mbetur afërsisht ${roughlyDaysLeft} ditë deri në skadencë. Nëse vazhdon me pagesë një vit i ri do të shtohet datës aktuale të skadencës jo nga dita e sotme. Mund të anulosh ose të vazhdosh me pagesë.`,
        },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "twint"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: `Mitgliedschaft: ${type}`,
              description: `${fullName} - ${uni}`,
            },
            unit_amount: type === "STUDENT" ? 2000 : 10000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/membership/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/membership`,
      metadata: {
        email,
        firstName: memberName,
        surname: memberSurname,
        lastName: memberSurname,
        name: fullName,
        uni,
        university: uni,
        studium,
        studyField: studium,
        type,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Fehler beim Checkout:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der Stripe Session" }, { status: 500 });
  }
}
