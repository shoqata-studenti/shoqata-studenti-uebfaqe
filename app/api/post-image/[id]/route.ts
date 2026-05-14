import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { byteStream, parseByteRange } from "@/lib/http-byte-range";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Ctx) {
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
  const size = body.byteLength;
  const mimeType = row.imageMimeType;

  const baseHeaders: Record<string, string> = {
    "Content-Type": mimeType,
    "Cache-Control": "public, max-age=3600",
    "Accept-Ranges": "bytes",
  };

  const parsed = parseByteRange(request.headers.get("range"), size);

  if (parsed === "unsatisfiable") {
    return new NextResponse(null, {
      status: 416,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes */${size}`,
      },
    });
  }

  if (parsed) {
    const { start, end } = parsed;
    const chunk = body.subarray(start, end + 1);
    return new NextResponse(byteStream(chunk), {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Length": String(chunk.byteLength),
        "Content-Range": `bytes ${start}-${end}/${size}`,
      },
    });
  }

  return new NextResponse(byteStream(body), {
    status: 200,
    headers: {
      ...baseHeaders,
      "Content-Length": String(size),
    },
  });
}
