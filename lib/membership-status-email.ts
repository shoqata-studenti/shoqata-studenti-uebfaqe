import "server-only";

import { Resend } from "resend";

import { formatDateWithWeekday } from "@/lib/format-datetime";
import type { Locale } from "@/lib/i18n/config";
import { getResendApiKey, resendFromAddress, SHOQATA_INFO_EMAIL } from "@/lib/resend-config";
import { membershipPageUrl } from "@/lib/site-url";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type StatusText = {
  subject: string;
  greeting: (firstName: string) => string;
  intro: string;
  active: (date: string) => string;
  expired: (date: string) => string;
  renew: string;
  ignore: string;
  closing: string;
};

const TEXT: Record<Locale, StatusText> = {
  sq: {
    subject: "Shoqata Studenti — Statusi i anëtarësimit tënd",
    greeting: (n) => (n ? `I/E dashur ${n},` : "Përshëndetje,"),
    intro: "Ke kërkuar statusin e anëtarësimit tënd në Shoqatën Studenti.",
    active: (d) => `Anëtarësimi është aktiv deri më <strong>${d}</strong>.`,
    expired: (d) => `Anëtarësimi ka skaduar më <strong>${d}</strong>.`,
    renew: "Anëtarësimin mund ta rinovosh këtu:",
    ignore: "Nëse nuk e ke bërë ti këtë kërkesë, mund ta injorosh këtë email.",
    closing: "Përshëndetje,<br/>Shoqata Studenti",
  },
  de: {
    subject: "Shoqata Studenti — Status deiner Mitgliedschaft",
    greeting: (n) => (n ? `Hallo ${n}` : "Hallo"),
    intro: "Du hast den Status deiner Mitgliedschaft bei der Shoqata Studenti abgefragt.",
    active: (d) => `Die Mitgliedschaft ist aktiv bis <strong>${d}</strong>.`,
    expired: (d) => `Die Mitgliedschaft ist am <strong>${d}</strong> abgelaufen.`,
    renew: "Verlängern kannst du sie hier:",
    ignore: "Falls du das nicht warst, kannst du diese Mail ignorieren.",
    closing: "Liebe Grüsse<br/>Shoqata Studenti",
  },
  en: {
    subject: "Shoqata Studenti — Your membership status",
    greeting: (n) => (n ? `Hi ${n},` : "Hi,"),
    intro: "You requested the status of your Shoqata Studenti membership.",
    active: (d) => `The membership is active until <strong>${d}</strong>.`,
    expired: (d) => `The membership expired on <strong>${d}</strong>.`,
    renew: "You can renew it here:",
    ignore: "If this wasn't you, you can ignore this email.",
    closing: "Best regards,<br/>Shoqata Studenti",
  },
};

/** Status nur per Mail an die Adresse selbst, damit niemand fremde Mitgliedschaften abfragen kann. */
export async function sendMembershipStatusEmail(params: {
  email: string;
  firstName: string;
  expiresAt: Date;
  locale: Locale;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY fehlt" };

  const t = TEXT[params.locale];
  const date = escapeHtml(formatDateWithWeekday(params.locale, params.expiresAt));
  const isActive = params.expiresAt.getTime() > Date.now();
  const renewUrl = membershipPageUrl();

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: resendFromAddress(),
      to: params.email,
      replyTo: SHOQATA_INFO_EMAIL,
      subject: t.subject,
      html: `
        <p>${t.greeting(escapeHtml(params.firstName.trim()))}</p>
        <p>${t.intro}</p>
        <p>${isActive ? t.active(date) : t.expired(date)}</p>
        <p>${t.renew}<br/><a href="${renewUrl}">${renewUrl}</a></p>
        <p style="color:#666">${t.ignore}</p>
        <p>${t.closing}</p>
      `,
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unbekannter Mail-Fehler" };
  }
}
