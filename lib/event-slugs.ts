export const EVENT_SLUGS = [
  "kafe-llafe",
  "festa-e-flamurit",
  "udhetime",
  "ligjerata",
  "sofra",
] as const;

export type EventSlug = (typeof EVENT_SLUGS)[number];

export function isEventSlug(value: string): value is EventSlug {
  return (EVENT_SLUGS as readonly string[]).includes(value);
}
