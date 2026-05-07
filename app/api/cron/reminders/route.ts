import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import {
  sendMembershipExpiredEmailSq,
  sendMembershipReminderEmailSq,
} from "@/lib/membership-email-albanian";
import { utcDayRange } from "@/lib/membership-logic";

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

function isInUtcDayRange(iso: Date, range: { start: Date; end: Date }): boolean {
  const t = iso.getTime();
  return t >= range.start.getTime() && t < range.end.getTime();
}

/**
 * Mitglieder mit expiresAt am heutigen UTC-Tag → Ablauf-Mail (albanisch).
 * Mit expiresAt in genau 7 Tagen (UTC) → Erinnerungs-Mail (albanisch).
 * Aufruf z. B. täglich per Cron: Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = utcDayRange(now, 0);
  const inSeven = utcDayRange(now, 7);

  const members = await prisma.member.findMany({
    where: {
      OR: [
        { expiresAt: { gte: today.start, lt: today.end } },
        { expiresAt: { gte: inSeven.start, lt: inSeven.end } },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      expiresAt: true,
      type: true,
    },
    orderBy: { expiresAt: "asc" },
  });

  const results: { id: number; email: string; kind: "reminder" | "expired"; ok: boolean; error?: string }[] =
    [];

  for (const m of members) {
    if (!m.expiresAt) continue;

    if (isInUtcDayRange(m.expiresAt, today)) {
      const r = await sendMembershipExpiredEmailSq(m.email, m.name);
      results.push({
        id: m.id,
        email: m.email,
        kind: "expired",
        ok: r.ok,
        error: r.error,
      });
      continue;
    }

    if (isInUtcDayRange(m.expiresAt, inSeven)) {
      const r = await sendMembershipReminderEmailSq(m.email, m.name, m.expiresAt);
      results.push({
        id: m.id,
        email: m.email,
        kind: "reminder",
        ok: r.ok,
        error: r.error,
      });
    }
  }

  return NextResponse.json({
    count: members.length,
    members,
    emails: results,
  });
}
