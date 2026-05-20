import "server-only";

/** Empfänger für Kontaktformular und Antwort-Adresse der Vereinigung. */
export const SHOQATA_INFO_EMAIL = "info@shoqata-studenti.ch";

/**
 * Absender für alle Resend-Mails.
 * In Vercel/.env: RESEND_FROM="Shoqata Studenti <info@shoqata-studenti.ch>"
 * (Domain shoqata-studenti.ch muss in Resend verifiziert sein.)
 */
export function resendFromAddress(): string {
  return process.env.RESEND_FROM ?? `Shoqata Studenti <${SHOQATA_INFO_EMAIL}>`;
}

export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim() || undefined;
}
