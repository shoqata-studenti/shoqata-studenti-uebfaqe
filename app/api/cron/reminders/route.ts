import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { utcDayRange } from "@/lib/membership-logic";

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * Liefert Mitglieder, deren expiresAt am heutigen UTC-Tag oder genau in 7 Tagen (UTC) liegt.
 * Aufruf z. B. per Cron mit Header: Authorization: Bearer $CRON_SECRET
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

  return NextResponse.json({
    count: members.length,
    members,
  });
}
