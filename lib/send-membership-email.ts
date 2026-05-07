import "server-only";

import type { MembershipType } from "@prisma/client";

import { sendMembershipConfirmationEmailSq } from "@/lib/membership-email-albanian";

/**
 * Bestätigung zur Mitgliedschaft (albanisch).
 */
export async function sendMembershipEmail(
  email: string,
  type: MembershipType,
  fullName?: string
): Promise<{ sent: boolean; skipped?: string; error?: string }> {
  return sendMembershipConfirmationEmailSq(email, type, fullName);
}
