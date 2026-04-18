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

/**
 * Verlängerung nur wenn weniger als 7 volle Tage Restlaufzeit
 * (eingeschlossen: bereits abgelaufen).
 */
export function canRenewMembership(expiresAt: Date | null): boolean {
  if (expiresAt == null) return true;
  return daysUntil(expiresAt) < 7;
}
