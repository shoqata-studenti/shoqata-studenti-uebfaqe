import de from "@/messages/de.json";
import en from "@/messages/en.json";
import sq from "@/messages/sq.json";

import type { Locale } from "./config";
import { defaultLocale, isLocale } from "./config";

export type Dictionary = typeof sq;

const MEDIA_FALLBACK: Record<Locale, Dictionary["media"]> = {
  sq: { videoUnmute: "Ndiz tingujt", videoMute: "Heshto" },
  de: { videoUnmute: "Ton einschalten", videoMute: "Stumm schalten" },
  en: { videoUnmute: "Turn sound on", videoMute: "Mute" },
};

function ensureMedia(raw: Dictionary, locale: Locale): Dictionary {
  if (raw.media?.videoUnmute && raw.media?.videoMute) {
    return raw;
  }
  return {
    ...raw,
    media: { ...MEDIA_FALLBACK[locale], ...raw.media },
  };
}

export function getDictionary(locale: string | undefined | null): Dictionary {
  const l = isLocale(locale) ? locale : defaultLocale;
  const raw = l === "de" ? de : l === "en" ? en : sq;
  return ensureMedia(raw, l);
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
