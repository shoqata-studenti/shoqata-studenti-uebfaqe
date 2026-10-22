import "server-only";

import type { Creditor, Data } from "swissqrbill/types";

/** Produktname in Stripe und Mitteilung auf der QR-Rechnung. */
export const DONATION_LABEL = "Spende Shoqata Studenti";

export const DONATION_MIN_CHF = 5;
/** Technische Obergrenze von Stripe Checkout für CHF; wird auf der Seite nicht erwähnt. */
export const DONATION_MAX_STRIPE_CHF = 999999.99;
/** TWINT erlaubt höchstens CHF 5000 pro Zahlung; darüber bietet Checkout nur Karte an. */
export const TWINT_MAX_CHF = 5000;
export const DONATION_MAX_QR_CHF = 100000;

/** Seite und Menüpunkt bleiben verborgen, bis DONATIONS_ENABLED=true gesetzt ist. */
export function donationsEnabled(): boolean {
  return process.env.DONATIONS_ENABLED?.trim() === "true";
}

/** Vereinskonto aus der Konfiguration; `null`, wenn etwas fehlt. */
export function getDonationCreditor(): Creditor | null {
  const account = process.env.DONATION_IBAN?.trim();
  const name = process.env.DONATION_CREDITOR_NAME?.trim();
  const address = process.env.DONATION_CREDITOR_STREET?.trim();
  const buildingNumber = process.env.DONATION_CREDITOR_BUILDING?.trim();
  const zip = process.env.DONATION_CREDITOR_ZIP?.trim();
  const city = process.env.DONATION_CREDITOR_CITY?.trim();
  if (!account || !name || !address || !zip || !city) return null;
  return { account, name, address, buildingNumber, zip, city, country: "CH" };
}

/** Die Mitteilung einer QR-Rechnung hat höchstens 140 Zeichen; davon gehen "Spende Shoqata Studenti: " ab. */
export const DONATION_QR_NOTE_MAX_LENGTH = 140 - (DONATION_LABEL.length + 2);

/** Eigene Mitteilung des Spenders: eine Zeile, gekürzt auf die erlaubte Länge. */
export function cleanQrNote(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, DONATION_QR_NOTE_MAX_LENGTH);
}

/** Daten der QR-Rechnung: normale IBAN, daher ohne Referenz, nur mit Mitteilung. */
export function donationQrBillData(creditor: Creditor, amount: number, note = ""): Data {
  const message = note ? `${DONATION_LABEL}: ${note}` : DONATION_LABEL;
  return { currency: "CHF", amount, creditor, message };
}

/** Betrag aus einem Formularfeld (akzeptiert "50", "50.5", "50,50"); `null`, wenn ungültig. */
export function parseChfAmount(raw: string, max: number): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < DONATION_MIN_CHF || amount > max) return null;
  return Math.round(amount * 100) / 100;
}
