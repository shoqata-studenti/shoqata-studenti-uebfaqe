import type { Locale } from "@/lib/i18n/config";

/**
 * Kurztext über der Regjistrohu-Form (eine Quelle, unabhängig von JSON-Cache).
 */
const MEMBERSHIP_PAGE_INTRO: Record<Locale, string> = {
  sq: "Anëtarësimi është i vlefshëm për një vit. Mund ta rinovosh deri në 30 ditë para skadencës. Viti i ri shtohet te data aktuale e skadencës jo nga dita e sotme.",
  de: "Die Mitgliedschaft gilt ein Jahr. Du kannst bis zu 30 Tage vor Ablauf verlängern. Das neue Jahr wird an das aktuelle Ablaufdatum angehängt, nicht ab heute.",
  en: "Membership is valid for one year. You can renew up to 30 days before expiry. The new year is added to the current expiry date, not from today.",
};

export function getMembershipPageIntro(locale: Locale): string {
  return MEMBERSHIP_PAGE_INTRO[locale];
}
