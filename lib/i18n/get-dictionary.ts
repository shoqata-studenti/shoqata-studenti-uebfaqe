import de from "@/messages/de.json";
import en from "@/messages/en.json";
import sq from "@/messages/sq.json";

import type { Locale } from "./config";
import { defaultLocale, isLocale } from "./config";

export type Dictionary = typeof sq;

export function getDictionary(locale: string | undefined | null): Dictionary {
  const l = isLocale(locale) ? locale : defaultLocale;
  if (l === "de") return de;
  if (l === "en") return en;
  return sq;
}

export function dateLocaleFor(locale: Locale): string {
  if (locale === "de") return "de-CH";
  if (locale === "en") return "en-GB";
  return "sq-AL";
}

export function htmlLangFor(locale: Locale): string {
  if (locale === "de") return "de";
  if (locale === "en") return "en";
  return "sq";
}
