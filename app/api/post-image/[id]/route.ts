import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return new NextResponse(null, { status: 404 });
  }

  const row = await prisma.post.findUnique({
    where: { id: numericId },
    select: { imageMimeType: true, imageData: true },
  });

  if (!row) {
    return new NextResponse(null, { status: 404 });
  }

  const body = new Uint8Array(row.imageData);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": row.imageMimeType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
