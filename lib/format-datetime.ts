import type { Locale } from "@/lib/i18n/config";
import { dateLocaleFor } from "@/lib/i18n/get-dictionary";

const ZURICH = "Europe/Zurich";

/** Datë + kohë për evente (Wochentag ausgeschrieben, z. B. sq: «e mërkurë, 20 maj 2026, 18:30»). */
export function formatEventDateTime(locale: Locale, date: Date): string {
  return date.toLocaleString(dateLocaleFor(locale), {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ZURICH,
  });
}

/** Nur Datum mit ausgeschriebenem Wochentag. */
export function formatDateWithWeekday(locale: Locale, date: Date): string {
  return date.toLocaleDateString(dateLocaleFor(locale), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: ZURICH,
  });
}

/** Albanisch (E-Mails, Server-Meldungen ohne UI-Locale). */
export function formatDateWithWeekdaySq(date: Date): string {
  return formatDateWithWeekday("sq", date);
}
