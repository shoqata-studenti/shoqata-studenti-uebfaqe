import "server-only";

import { Resend } from "resend";

import type { Locale } from "@/lib/i18n/config";
import { getResendApiKey, resendFromAddress, SHOQATA_INFO_EMAIL } from "@/lib/resend-config";

export type DonationDetails = {
  name: string;
  email: string;
  /** Betrag in CHF. */
  amount: number;
  message: string;
  paymentMethod: string;
  sessionId: string;
  paidAt: Date;
  locale: Locale;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function send(params: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const apiKey = getResendApiKey();
    if (!apiKey) {
      return { ok: false, error: "RESEND_API_KEY fehlt" };
    }
    const { error } = await new Resend(apiKey).emails.send({ from: resendFromAddress(), ...params });
    return error ? { ok: false, error: error.message } : { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unbekannter Mail-Fehler" };
  }
}

/** Interne Meldung an info@ nach erfolgreicher Spende (auch ohne Nachricht). */
export function sendDonationNotificationToInfo(d: DonationDetails) {
  const amount = `CHF ${d.amount.toFixed(2)}`;
  const paidAt = d.paidAt.toLocaleString("de-CH", { timeZone: "Europe/Zurich" });
  return send({
    to: SHOQATA_INFO_EMAIL,
    replyTo: d.email,
    subject: `Neue Spende: ${amount} von ${d.name}`,
    html: `
      <p>Es ist eine neue Spende eingegangen.</p>
      <p><strong>Name:</strong> ${escapeHtml(d.name)}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></p>
      <p><strong>Betrag:</strong> ${amount}</p>
      <p><strong>Zahlungsart:</strong> ${escapeHtml(d.paymentMethod)}</p>
      <p><strong>Datum:</strong> ${escapeHtml(paidAt)}</p>
      <p><strong>Nachricht:</strong></p>
      <p style="white-space:pre-wrap">${d.message ? escapeHtml(d.message) : "<em>(keine Nachricht)</em>"}</p>
      <p style="color:#666;font-size:12px">Stripe Checkout Session: ${escapeHtml(d.sessionId)}</p>
    `,
  });
}

type ThanksNames = { firstName: string; fullName: string };

const THANKS: Record<Locale, { subject: string; body: (names: ThanksNames, amount: string) => string }> = {
  sq: {
    subject: "Faleminderit për donacionin tuaj!",
    body: ({ fullName }) => `
      <p>Përshëndetje ${fullName},</p>
      <p>Ju falënderojmë përzemërsisht për donacionin tuaj ndaj Shoqatës Studenti! Kontributi juaj ndihmon të financojë veprimtarinë e shoqatës dhe mbështet komunitetin studentor.<br/>
      E vlerësojmë sinqerisht besimin dhe bujarinë tuaj!</p>
      <p>Me shumë mirënjohje,<br/>Shoqata Studenti</p>
    `,
  },
  de: {
    subject: "Shoqata Studenti — Danke für deine Spende!",
    body: ({ firstName: name }, amount) => `
      <p>Liebe/r ${name}</p>
      <p>Deine Spende von <strong>${amount}</strong> ist erfolgreich eingegangen. Herzlichen Dank für deine Unterstützung!</p>
      <p>Dein Beitrag hilft uns direkt, die Tätigkeit und die Initiativen der Shoqata Studenti zu finanzieren und die studentische Gemeinschaft zu stärken.</p>
      <p>Bei Fragen erreichst du uns unter <a href="mailto:${SHOQATA_INFO_EMAIL}">${SHOQATA_INFO_EMAIL}</a>.</p>
      <p>Mit herzlichem Dank<br/>Shoqata Studenti</p>
    `,
  },
  en: {
    subject: "Shoqata Studenti — Thank you for your donation!",
    body: ({ firstName: name }, amount) => `
      <p>Hi ${name},</p>
      <p>Your donation of <strong>${amount}</strong> was successful. Thank you very much for your support!</p>
      <p>Your contribution directly helps us fund the activities and initiatives of Shoqata Studenti and strengthen the student community.</p>
      <p>If you have any questions, write to us at <a href="mailto:${SHOQATA_INFO_EMAIL}">${SHOQATA_INFO_EMAIL}</a>.</p>
      <p>With gratitude,<br/>Shoqata Studenti</p>
    `,
  },
};

/** Dankesmail an den Spender in der Sprache, in der gespendet wurde. */
export function sendDonationThanksEmail(d: DonationDetails) {
  const t = THANKS[d.locale];
  return send({
    to: d.email,
    replyTo: SHOQATA_INFO_EMAIL,
    subject: t.subject,
    // Albanisch mit vollem Namen, Deutsch/Englisch nur mit Vornamen (erstes Wort des Namensfelds).
    html: t.body(
      {
        firstName: escapeHtml(d.name.trim().split(/\s+/)[0] ?? ""),
        fullName: escapeHtml(d.name.trim()),
      },
      `CHF ${d.amount.toFixed(2)}`
    ),
  });
}
