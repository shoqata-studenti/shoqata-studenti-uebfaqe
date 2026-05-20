export const EVENT_EDITION_YEARS = [2026, 2025, 2024] as const;

export type EventEditionYear = (typeof EVENT_EDITION_YEARS)[number];

export const FESTA_E_FLAMURIT_SLUG = "festa-e-flamurit" as const;

/**
 * Vitet e edicioneve që shfaqen në hub-in e secilit event.
 * Çdo slug e ka konfiguruar listën e tij; përdoret edhe si burim i së vërtetës
 * për të bllokuar URL-të direkte të edicioneve që nuk ekzistojnë më.
 */
export function editionYearsForEventHub(slug: string): readonly EventEditionYear[] {
  switch (slug) {
    case "sofra":
      return [2026];
    case "udhetime":
      return [2026, 2025];
    case FESTA_E_FLAMURIT_SLUG:
      return [2025];
    default:
      return EVENT_EDITION_YEARS;
  }
}

export function isEventEditionYear(n: number): n is EventEditionYear {
  return (EVENT_EDITION_YEARS as readonly number[]).includes(n);
}

export function parseEventEditionYear(raw: string): EventEditionYear | null {
  const y = Number.parseInt(raw, 10);
  if (Number.isNaN(y) || !isEventEditionYear(y)) return null;
  return y;
}

/** A është ky edicion i lejuar për këtë event hub? Përdoret për të bllokuar URL-të e fshira. */
export function isEditionAvailableForEvent(slug: string, year: EventEditionYear): boolean {
  return editionYearsForEventHub(slug).includes(year);
}
