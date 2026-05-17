import "server-only";

/** Pausiert alle ausgehenden E-Mails/Newsletter (z. B. beim manuellen DB-Pflegen). In .env: DISABLE_OUTBOUND_EMAILS=true */
export function isOutboundEmailDisabled(): boolean {
  const v = process.env.DISABLE_OUTBOUND_EMAILS?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export const OUTBOUND_EMAIL_DISABLED_REASON =
  "Ausgehende E-Mails sind vorübergehend deaktiviert (DISABLE_OUTBOUND_EMAILS).";
