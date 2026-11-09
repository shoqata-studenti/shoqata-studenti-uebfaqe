import { NextResponse, type NextRequest } from "next/server";

/**
 * Passwortschutz für Vorschauen, die geteilt werden (z. B. für den Vorstand).
 * Aktiv nur lokal (`next dev`) oder auf Vercel-Vorschauen (VERCEL_ENV=preview), jeweils mit gesetztem
 * PREVIEW_PASSWORD; auf der echten Seite (Production) nie.
 * Benutzername: beliebig, Passwort: PREVIEW_PASSWORD.
 */
export function proxy(request: NextRequest) {
  const password = process.env.PREVIEW_PASSWORD;
  const isPreview = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
  if (!isPreview || !password) return NextResponse.next();

  const auth = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    if (decoded.slice(decoded.indexOf(":") + 1) === password) return NextResponse.next();
  }

  return new NextResponse("Passwort erforderlich", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Shoqata Studenti Vorschau", charset="UTF-8"' },
  });
}

export const config = {
  // Stripe-Webhooks (lokal über `stripe listen`) brauchen kein Passwort.
  matcher: ["/((?!api/webhooks).*)"],
};
