import PDFDocument from "pdfkit";
import { SwissQRBill } from "swissqrbill/pdf";

import {
  cleanQrNote,
  DONATION_LABEL,
  DONATION_MAX_QR_CHF,
  donationQrBillData,
  donationsEnabled,
  getDonationCreditor,
  parseChfAmount,
} from "@/lib/donation-config";
import { getLocale } from "@/lib/i18n/server";

const QR_LANGUAGE = { sq: "DE", de: "DE", en: "EN" } as const;

/** QR-Rechnung als PDF (A4, Zahlteil unten) zum Herunterladen. */
export async function GET(req: Request) {
  const creditor = getDonationCreditor();
  if (!donationsEnabled() || !creditor) {
    return new Response("Not found", { status: 404 });
  }

  const amount = parseChfAmount(new URL(req.url).searchParams.get("amount") ?? "", DONATION_MAX_QR_CHF);
  if (amount === null) {
    return new Response("Invalid amount", { status: 400 });
  }

  const note = cleanQrNote(new URL(req.url).searchParams.get("message") ?? "");
  const locale = await getLocale();
  const doc = new PDFDocument({ size: "A4", margin: 56, info: { Title: DONATION_LABEL } });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  doc.font("Helvetica-Bold").fontSize(18).text(DONATION_LABEL);
  doc.moveDown(0.5).font("Helvetica").fontSize(11).text(`CHF ${amount.toFixed(2)}`);
  new SwissQRBill(donationQrBillData(creditor, amount, note), { language: QR_LANGUAGE[locale] }).attachTo(doc);
  doc.end();

  const pdf = await done;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="qr-rechnung-spende-${amount.toFixed(2)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
