/** Kalender-Tag in UTC: [start, end) */
export function utcDayRange(reference: Date, offsetDaysFromReference: number) {
  const base = new Date(reference);
  const y = base.getUTCFullYear();
  const m = base.getUTCMonth();
  const d = base.getUTCDate() + offsetDaysFromReference;
  const start = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export function addYears(date: Date, years: number): Date {
  const out = new Date(date);
  out.setFullYear(out.getFullYear() + years);
  return out;
}

/** Verbleibende Zeit in Tagen (kann negativ sein). */
export function daysUntil(target: Date, from = new Date()): number {
  return (target.getTime() - from.getTime()) / 86_400_000;
}

/** Rinovim nëpërmjet pagesës: më pak se 1 muaj deri në skadencë (ose tashmë i skaduar). */
export const RENEWAL_WINDOW_DAYS = 30;

/**
 * Pagesë / rinovim i lejuar kur ka më pak se RENEWAL_WINDOW_DAYS ditë deri në skadencë,
 * ose kur anëtarësimi është skaduar / pa datë.
 */
export function canRenewMembership(expiresAt: Date | null): boolean {
  if (expiresAt == null) return true;
  return daysUntil(expiresAt) < RENEWAL_WINDOW_DAYS;
}

/** Ende aktiv (Skadenca në të ardhmen). */
export function isMembershipStillActive(expiresAt: Date | null): boolean {
  if (expiresAt == null) return false;
  return daysUntil(expiresAt) > 0;
}
