import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

type ParsedRange =
  | { start: number; end: number }
  | "unsatisfiable"
  | null;

/**
 * Parse a single `Range: bytes=…` value (first range only if multiple).
 */
function parseRange(rangeHeader: string | null, size: number): ParsedRange {
  if (size === 0) {
    if (!rangeHeader) return null;
    return "unsatisfiable";
  }

  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) {
    return null;
  }

  const spec = rangeHeader.slice(6).trim();
  const first = spec.split(",")[0]?.trim() ?? "";

  if (first.startsWith("-")) {
    const suffixLen = Number.parseInt(first.slice(1), 10);
    if (Number.isNaN(suffixLen) || suffixLen <= 0) return null;
    const start = Math.max(0, size - suffixLen);
    return { start, end: size - 1 };
  }

  const dash = first.indexOf("-");
  if (dash < 0) return null;
  const startStr = first.slice(0, dash);
  const endStr = first.slice(dash + 1);
  const start = Number.parseInt(startStr, 10);
  if (Number.isNaN(start) || start < 0) return null;

  let end: number;
  if (endStr === "") {
    end = size - 1;
  } else {
    end = Number.parseInt(endStr, 10);
    if (Number.isNaN(end)) return null;
  }

  if (start > end) return null;
  if (start >= size) return "unsatisfiable";

  end = Math.min(end, size - 1);
  return { start, end };
}

function byteStream(chunk: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(chunk);
      controller.close();
    },
  });
}

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

  const parsed = parseRange(request.headers.get("range"), size);

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
