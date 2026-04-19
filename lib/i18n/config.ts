export const LOCALE_COOKIE = "locale";

export const locales = ["sq", "de", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sq";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "sq" || value === "de" || value === "en";
}
