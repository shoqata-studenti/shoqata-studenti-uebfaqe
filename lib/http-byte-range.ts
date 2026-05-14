/**
 * Safari (WebKit) shpesh kërkon `Range: bytes=…` për video nga URL — pa këtë,
 * `<video src="/api/…">` mund të mbetet i zi edhe pse të dhënat janë të sakta.
 */

export type ParsedByteRange =
  | { start: number; end: number }
  | "unsatisfiable"
  | null;

/**
 * Lexon një vlerë të vetme `Range: bytes=…` (e para nëse ka të shumta).
 */
export function parseByteRange(rangeHeader: string | null, size: number): ParsedByteRange {
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

export function byteStream(chunk: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(chunk);
      controller.close();
    },
  });
}
