"use server";

import { MembershipType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { formatDateWithWeekday } from "@/lib/format-datetime";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import { getLocale } from "@/lib/i18n/server";
import { addYears, canRenewMembership, daysUntil, memberFullName } from "@/lib/membership-logic";
import { sendMembershipEmail } from "@/lib/send-membership-email";
import { subscribeInfomaniakNewsletter } from "@/lib/infomaniak-newsletter";

export type MembershipSubmitState = {
  ok: boolean;
  error?: string;
  success?: string;
};

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

function parseType(raw: unknown): MembershipType | null {
  if (raw === "STUDENT" || raw === "ALUMNI") return raw;
  return null;
}

export async function submitMembership(
  _prev: MembershipSubmitState,
  formData: FormData
): Promise<MembershipSubmitState> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const ma = dict.membershipActions;

  const name = String(formData.get("firstName") ?? "").trim();
  const surname = String(formData.get("lastName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const uni = String(formData.get("uni") ?? "").trim();
  const studium = String(formData.get("studium") ?? "").trim();
  const type = parseType(formData.get("type"));

  if (!name || !surname || !email || !uni || !studium || !type) {
    return { ok: false, error: ma.fillAll };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: ma.invalidEmail };
  }

  const existing = await prisma.member.findUnique({ where: { email } });

  if (!existing) {
    const now = new Date();
    const expiresAt = addYears(now, 1);
    await prisma.member.create({
      data: {
        email,
        name,
        surname,
        uni,
        studium,
        type,
        status: "ACTIVE",
        expiresAt,
        lastRenewalAt: now,
      },
    });
    const mail = await sendMembershipEmail(email, type, memberFullName(name, surname));
    if (!mail.sent && mail.error) {
      return {
        ok: true,
        success: ma.createdNoEmail,
      };
    }
    return { ok: true, success: ma.createdOk };
  }

  if (!canRenewMembership(existing.expiresAt)) {
    const until = formatDateWithWeekday(locale, existing.expiresAt!);
    return {
      ok: false,
      error: interpolate(ma.renewBlocked, { until }),
    };
  }

  const base = existing.expiresAt ?? new Date();
  const newExpires = addYears(base, 1);
  const now = new Date();

  await prisma.member.update({
    where: { id: existing.id },
    data: {
      name,
      surname,
      uni,
      studium,
      type,
      status: "ACTIVE",
      expiresAt: newExpires,
      lastRenewalAt: now,
    },
  });

  const mail = await sendMembershipEmail(email, type, memberFullName(name, surname));
  if (!mail.sent && mail.error) {
    return {
      ok: true,
      success: ma.extendedNoEmail,
    };
  }
  return { ok: true, success: ma.extendedOk };
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
    await subscribeInfomaniakNewsletter(email, { firstName, lastName });
    return { ok: true, message: n.success };
  } catch {
    return { ok: false, message: n.errorGeneric };
  }
}
