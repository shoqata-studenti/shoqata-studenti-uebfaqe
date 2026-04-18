import "server-only";

import { Resend } from "resend";
import type { MembershipType } from "@prisma/client";

const typeLabel: Record<MembershipType, string> = {
  STUDENT: "Student",
  ALUMNI: "Alumni",
};

/**
 * Versendet eine Bestätigung zur Mitgliedschaft (neu oder verlängert).
 * Ohne gesetzten RESEND_API_KEY wird nichts gesendet.
 */
export async function sendMembershipEmail(
  email: string,
  type: MembershipType
): Promise<{ sent: boolean; skipped?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, skipped: "RESEND_API_KEY ist nicht gesetzt." };
  }

  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Mitgliedschaft — Bestätigung",
    html: `<p>Hallo,</p><p>deine Mitgliedschaft als <strong>${typeLabel[type]}</strong> wurde registriert.</p><p>Viele Grüße</p>`,
  });

  if (error) {
    return { sent: false, error: error.message };
  }

  return { sent: true };
}
