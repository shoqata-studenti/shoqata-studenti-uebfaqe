import "server-only";

/** Öffentliche Produktions-Domain (ohne trailing slash). */
export const PRODUCTION_ORIGIN = "https://shoqata-studenti.ch";

/**
 * Basis-URL für Redirects (z. B. Stripe Checkout).
 * Priorität: NEXT_PUBLIC_URL → VERCEL_URL (Preview) → shoqata-studenti.ch
 */
export function getSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return PRODUCTION_ORIGIN;
}

/** Links in E-Mails: immer die echte Domain, nicht Preview/localhost. */
export function getEmailSiteOrigin(): string {
  return PRODUCTION_ORIGIN;
}

export function membershipPageUrl(): string {
  return `${getEmailSiteOrigin()}/membership`;
}

export function siteHomeUrl(): string {
  return `${getEmailSiteOrigin()}/`;
}
