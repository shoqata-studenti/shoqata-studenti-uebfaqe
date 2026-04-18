"use server";

import { MembershipType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { addYears, canRenewMembership, daysUntil } from "@/lib/membership-logic";
import { sendMembershipEmail } from "@/lib/send-membership-email";

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
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const uni = String(formData.get("uni") ?? "").trim();
  const studium = String(formData.get("studium") ?? "").trim();
  const type = parseType(formData.get("type"));

  if (!name || !email || !uni || !studium || !type) {
    return { ok: false, error: "Bitte alle Felder ausfüllen." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ungültige E-Mail-Adresse." };
  }

  const existing = await prisma.member.findUnique({ where: { email } });

  if (!existing) {
    const now = new Date();
    const expiresAt = addYears(now, 1);
    await prisma.member.create({
      data: {
        email,
        name,
        uni,
        studium,
        type,
        status: "ACTIVE",
        expiresAt,
        lastRenewalAt: now,
      },
    });
    const mail = await sendMembershipEmail(email, type);
    if (!mail.sent && mail.error) {
      return {
        ok: true,
        success:
          "Mitgliedschaft wurde angelegt. Die Bestätigungs-E-Mail konnte nicht versendet werden.",
      };
    }
    return { ok: true, success: "Mitgliedschaft wurde angelegt. Du erhältst eine Bestätigung per E-Mail." };
  }

  if (!canRenewMembership(existing.expiresAt)) {
    const until = existing.expiresAt!.toLocaleDateString("de-DE", {
      dateStyle: "long",
    });
    return {
      ok: false,
      error: `Eine Mitgliedschaft mit dieser E-Mail besteht bereits. Verlängerung ist erst möglich, wenn weniger als 7 Tage Restlaufzeit bestehen (aktuell aktiv bis ${until}).`,
    };
  }

  const base = existing.expiresAt ?? new Date();
  const newExpires = addYears(base, 1);
  const now = new Date();

  await prisma.member.update({
    where: { id: existing.id },
    data: {
      name,
      uni,
      studium,
      type,
      status: "ACTIVE",
      expiresAt: newExpires,
      lastRenewalAt: now,
    },
  });

  const mail = await sendMembershipEmail(email, type);
  if (!mail.sent && mail.error) {
    return {
      ok: true,
      success:
        "Mitgliedschaft wurde verlängert. Die Bestätigungs-E-Mail konnte nicht versendet werden.",
    };
  }
  return { ok: true, success: "Mitgliedschaft wurde um ein Jahr verlängert." };
}

export async function checkMembershipStatus(
  _prev: MembershipCheckState,
  formData: FormData
): Promise<MembershipCheckState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) {
    return { ok: false, message: "Bitte eine E-Mail-Adresse eingeben." };
  }

  const member = await prisma.member.findUnique({
    where: { email },
    select: { expiresAt: true },
  });

  if (!member?.expiresAt) {
    return { ok: true, message: "Keine Mitgliedschaft." };
  }

  if (daysUntil(member.expiresAt) <= 0) {
    return { ok: true, message: "Keine Mitgliedschaft." };
  }

  return {
    ok: true,
    message: `Aktiv bis ${member.expiresAt.toLocaleDateString("de-DE", { dateStyle: "long" })}`,
    expiresAtIso: member.expiresAt.toISOString(),
  };
}
