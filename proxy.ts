import { NextResponse, type NextRequest } from "next/server";

/**
 * Passwortschutz für Vorschauen, die geteilt werden (z. B. für den Vorstand).
 * Aktiv nur lokal (`next dev`) oder auf Vercel-Vorschauen (VERCEL_ENV=preview), jeweils mit gesetztem
 * PREVIEW_PASSWORD; auf der echten Seite (Production) nie.
 * Benutzername: beliebig, Passwort: PREVIEW_PASSWORD.
 */
export function proxy(request: NextRequest) {
  // Leerzeichen und Anführungszeichen, die beim Eintragen in Vercel mitkopiert wurden, ignorieren.
  const password = process.env.PREVIEW_PASSWORD?.trim().replace(/^["']|["']$/g, "");
  const isPreview = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
  if (!isPreview || !password) return NextResponse.next();

  const auth = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = auth.split(" ");
  let hint = "";
  if (scheme === "Basic" && encoded) {
    try {
      // UTF-8 dekodieren, damit auch Passwörter mit ë, ç oder Umlauten funktionieren.
      const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      const user = decoded.slice(0, decoded.indexOf(":")).trim();
      const pass = decoded.slice(decoded.indexOf(":") + 1).trim();
      // Das Passwort zählt auch, wenn es im Feld „Benutzername“ eingegeben wurde.
      if (pass === password || user === password) return NextResponse.next();
      // Vorübergehende Diagnose (nur Längen, nie Inhalte); entfernen, sobald der Login klappt.
      hint = `\n\nEingegeben: Benutzername ${user.length} Zeichen, Passwort ${pass.length} Zeichen. Erwartet: ${password.length} Zeichen.`;
    } catch {
      // Ungültiger Header: wie falsches Passwort behandeln.
    }
  }

  return new NextResponse(`Passwort erforderlich${hint}`, {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Shoqata Studenti Vorschau", charset="UTF-8"' },
  });
}

export const config = {
  // Stripe-Webhooks (lokal über `stripe listen`) brauchen kein Passwort.
  matcher: ["/((?!api/webhooks).*)"],
};
