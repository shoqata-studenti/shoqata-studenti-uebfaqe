import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

function contentDisposition(original: string, download: boolean): string {
  const ascii = original.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  const enc = encodeURIComponent(original);
  const kind = download ? "attachment" : "inline";
  return `${kind}; filename="${ascii}"; filename*=UTF-8''${enc}`;
}

export async function GET(request: Request, context: Ctx) {
  const { id } = await context.params;
  const numericId = Number.parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return new NextResponse(null, { status: 404 });
  }

  const doc = await prisma.vargjetDocument.findUnique({
    where: { id: numericId },
    select: {
      mimeType: true,
      originalFileName: true,
      fileData: true,
    },
  });

  if (!doc) {
    return new NextResponse(null, { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  const body = new Uint8Array(doc.fileData);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": contentDisposition(doc.originalFileName, download),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
