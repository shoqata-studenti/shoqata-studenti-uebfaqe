"use server";

import { prisma } from "@/lib/db";
import { formatDateWithWeekday } from "@/lib/format-datetime";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";
import { daysUntil, memberFullName } from "@/lib/membership-logic";
import { sendNewsletterWelcomeEmailSq } from "@/lib/membership-email-albanian";
import { subscribeInfomaniakNewsletter } from "@/lib/infomaniak-newsletter";

export type MembershipCheckState = {
  ok: boolean;
  message: string;
  expiresAtIso?: string;
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

  const member = await prisma.member.findUnique({
    where: { email },
    select: { expiresAt: true },
  });

  if (!member?.expiresAt) {
    return { ok: true, message: ma.none };
  }

  if (daysUntil(member.expiresAt) <= 0) {
    return { ok: true, message: ma.none };
  }

  const dateStr = formatDateWithWeekday(locale, member.expiresAt);

  return {
    ok: true,
    message: interpolate(ma.activeUntil, { date: dateStr }),
    expiresAtIso: member.expiresAt.toISOString(),
  };
}

export async function subscribeNewsletter(
  _prev: NewsletterSubscribeState,
  formData: FormData
): Promise<NewsletterSubscribeState> {
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
