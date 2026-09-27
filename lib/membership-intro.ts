import type { Locale } from "@/lib/i18n/config";

/**
 * Kurztext über der Regjistrohu-Form (eine Quelle, unabhängig von JSON-Cache).
 */
const MEMBERSHIP_PAGE_INTRO: Record<Locale, string> = {
  sq: "Anëtarësimi është i vlefshëm për një vit dhe mund ta rinovosh në muajin e fundit të vlefshmërisë. Viti i ri shtohet te data aktuale e skadencës dhe jo nga dita e rinovimit. Këtu poshtë mund ta kontrollosh vlefshmërinë si dhe datën e skadencës të anëtarësisë tënde.",
  de: "Die Mitgliedschaft gilt ein Jahr und kann im letzten Gültigkeitsmonat verlängert werden. Das neue Jahr wird an das aktuelle Ablaufdatum angehängt und nicht ab dem Verlängerungstag berechnet. Unten kannst du die Gültigkeit und das Ablaufdatum deiner Mitgliedschaft prüfen.",
  en: "Membership is valid for one year and can be renewed during the final month of its validity. The new year is added to the current expiry date, not calculated from the renewal date. Below you can check your membership status and expiry date.",
};

export function getMembershipPageIntro(locale: Locale): string {
  return MEMBERSHIP_PAGE_INTRO[locale];
}
