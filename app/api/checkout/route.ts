import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  // DEBUG-CHECK: Das wird in deinem Terminal (Terminal 1) ausgegeben
  console.log("SUCHE KEY:", process.env.STRIPE_SECRET_KEY ? "GEFUNDEN" : "NICHT GEFUNDEN");
  console.log("SUCHE URL:", process.env.NEXT_PUBLIC_URL ? "GEFUNDEN" : "NICHT GEFUNDEN");

  // Sicherheits-Check: Wir prüfen IN der Funktion, ob das Passwort da ist
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("KRITISCHER FEHLER: STRIPE_SECRET_KEY wird nicht gefunden!");
    return NextResponse.json({ 
      error: "Server-Konfiguration fehlt: STRIPE_SECRET_KEY ist undefined. Prüfe deine .env Datei." 
    }, { status: 500 });
  }

  // Stripe erst hier initialisieren!
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { email, name, university, studyField, type } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "twint"],
      line_items: [
        {
          price_data: {
            currency: "chf",
            product_data: {
              name: `Mitgliedschaft: ${type}`,
              description: `${name} - ${university}`,
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
        name,
        university,
        studyField,
        type,
      },
    });

    return NextResponse.json({ url: session.url });
    
  } catch (error) {
    console.error("Fehler beim Checkout:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der Stripe Session" }, { status: 500 });
  }
}