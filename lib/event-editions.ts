export const EVENT_EDITION_YEARS = [2026, 2025, 2024] as const;

export type EventEditionYear = (typeof EVENT_EDITION_YEARS)[number];

export function isEventEditionYear(n: number): n is EventEditionYear {
  return (EVENT_EDITION_YEARS as readonly number[]).includes(n);
}

export function parseEventEditionYear(raw: string): EventEditionYear | null {
  const y = Number.parseInt(raw, 10);
  if (Number.isNaN(y) || !isEventEditionYear(y)) return null;
  return y;
}
