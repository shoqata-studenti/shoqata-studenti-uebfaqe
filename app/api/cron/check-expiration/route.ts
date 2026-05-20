import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { utcDayRange } from "@/lib/membership-logic";

function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Täglich (Vercel Cron): ACTIVE-Mitglieder mit abgelaufenem expiresAt → status EXPIRED.
 * Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todayStart = utcDayRange(new Date(), 0).start;

  const result = await prisma.member.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: todayStart },
    },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ updated: result.count });
}
