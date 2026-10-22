/** Stripe-Metadaten erlauben höchstens 500 Zeichen pro Wert. */
export const DONATION_MESSAGE_MAX_LENGTH = 500;

export type DonationCheckoutState = {
  status: "idle" | "error";
  error?: "fields" | "amount" | "turnstile" | "config" | "stripe";
};

export const initialDonationCheckoutState: DonationCheckoutState = {
  status: "idle",
};

export type QrBillState = {
  status: "idle" | "success" | "error";
  error?: "amount" | "config" | "server";
  /** Nur der QR-Code (SVG); die ganze Rechnung gibt es als PDF unter /api/donacione/qr-bill. */
  qrCodeSvg?: string;
  amount?: number;
  /** Eigene Mitteilung des Spenders (bereinigt), für den PDF-Download. */
  note?: string;
  creditorName?: string;
  creditorAddress?: string;
  iban?: string;
  message?: string;
};

export const initialQrBillState: QrBillState = {
  status: "idle",
};
