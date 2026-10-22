"use server";

import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";
import { memberFullName } from "@/lib/membership-logic";
import { sendNewsletterWelcomeEmailSq } from "@/lib/membership-email-albanian";
import { sendMembershipStatusEmail } from "@/lib/membership-status-email";
import { subscribeInfomaniakNewsletter } from "@/lib/infomaniak-newsletter";
import { verifyTurnstileToken } from "@/lib/turnstile";

export type MembershipCheckState = {
  ok: boolean;
  message: string;
};

export type NewsletterSubscribeState = {
  ok: boolean;
  message: string;
};

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function checkMembershipStatus(
  _prev: MembershipCheckState,
  formData: FormData
): Promise<MembershipCheckState> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ma = dict.membershipActions;

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) {
    return { ok: false, message: ma.checkEmailMissing };
  }

  const turnstile = await verifyTurnstileToken(String(formData.get("cf-turnstile-response") ?? "").trim());
  if (!turnstile.ok) {
    console.warn("[Status] Turnstile verification failed:", turnstile.error ?? "unknown");
    return { ok: false, message: ma.errorTurnstile };
  }

  const member = await prisma.member.findUnique({
    where: { email },
    select: { expiresAt: true, name: true },
  });

  // Der Status geht nur per Mail an die Adresse selbst; die Antwort ist für alle Adressen gleich,
  // damit niemand über das Formular herausfinden kann, wer Mitglied ist.
  if (member?.expiresAt) {
    const mail = await sendMembershipStatusEmail({
      email,
      firstName: member.name,
      expiresAt: member.expiresAt,
      locale,
    });
    if (!mail.ok) console.error("[Status] Status-Mail fehlgeschlagen:", mail.error);
  }

  return { ok: true, message: ma.statusMailSent };
}

export async function subscribeNewsletter(
  _prev: NewsletterSubscribeState,
  formData: FormData
): Promise<NewsletterSubscribeState> {
  // Honeypot — Bots füllen dieses versteckte Feld aus, echte Nutzer nicht
  const botField = formData.get("website_url")?.toString() ?? "";
  if (botField) {
    // Bot erkannt: Erfolg vortäuschen, nichts tun
    const locale = await getLocale();
    const dict = getDictionary(locale);
    return { ok: true, message: dict.membership.newsletter.success };
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const n = dict.membership.newsletter;

  const ma = dict.membershipActions;
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!firstName || !lastName || !email) {
    return { ok: false, message: ma.fillAll };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: n.errorInvalidEmail };
  }

  const turnstile = await verifyTurnstileToken(String(formData.get("cf-turnstile-response") ?? "").trim());
  if (!turnstile.ok) {
    console.warn("[Newsletter] Turnstile verification failed:", turnstile.error ?? "unknown");
    return { ok: false, message: ma.errorTurnstile };
  }

  try {
    const result = await subscribeInfomaniakNewsletter(email, { firstName, lastName });

    if (result.status === "skipped") {
      return { ok: false, message: n.errorNotConfigured };
    }

    if (result.status === "already-subscribed") {
      return { ok: true, message: n.alreadySubscribed };
    }

    const welcome = await sendNewsletterWelcomeEmailSq(
      email,
      memberFullName(firstName, lastName)
    );
    if (!welcome.ok) {
      console.error("[Newsletter] Willkommens-Mail:", welcome.error ?? welcome.skipped);
    }

    return { ok: true, message: n.success };
  } catch {
    return { ok: false, message: n.errorGeneric };
  }
}
