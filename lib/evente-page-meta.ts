import "server-only";

import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { isEventSlug, type EventSlug } from "@/lib/event-slugs";

export type EventPageMeta = {
  slug: EventSlug;
  name: string;
  description: string;
};

export function getEventPageMeta(
  dict: Dictionary,
  locale: Locale,
  slug: string
): EventPageMeta | null {
  if (!isEventSlug(slug)) return null;

  const name =
    slug === "kafe-llafe"
      ? dict.nav.kafeLlafe
      : slug === "festa-e-flamurit"
        ? dict.nav.festaEFlamurit
        : slug === "udhetime"
          ? dict.nav.udhetime
          : slug === "ligjerata"
            ? dict.nav.ligjerata
            : dict.nav.sofra;

  let description: string;
  switch (slug) {
    case "kafe-llafe":
      description =
        locale === "de"
          ? "Treffen und offener Austausch für Studierende in entspannter Atmosphäre."
          : locale === "en"
            ? "Meetups and open conversations for students in a relaxed atmosphere."
            : "Takime dhe biseda të hapura për studentë në një atmosferë të lirshme.";
      break;
    case "festa-e-flamurit":
      description =
        locale === "de"
          ? "Gemeinsame Feier mit Musik, Programm und Gemeinschaft rund um den 28. November."
          : locale === "en"
            ? "Community celebration with music, program, and activities around November 28."
            : "Festë e përbashkët me muzikë, program dhe aktivitete rreth 28 Nëntorit.";
      break;
    case "udhetime":
      description =
        locale === "de"
          ? "Ausflüge in der Schweiz für Vernetzung, Freizeit und neue Erlebnisse."
          : locale === "en"
            ? "Trips around Switzerland for networking, leisure, and new experiences."
            : "Udhëtime nëpër Zvicër për njohje, kohë të lirë dhe përvoja të reja.";
      break;
    case "ligjerata":
      description =
        locale === "de"
          ? "Vorträge und Diskussionsrunden zu Studium, Karriere und studentischem Leben."
          : locale === "en"
            ? "Lectures and discussions about studies, career, and student life."
            : "Ligjërata dhe diskutime rreth studimeve, karrierës dhe jetës studentore.";
      break;
    case "sofra":
      description =
        locale === "de"
          ? "Kulturelle Abende mit Essen, Musik und Begegnungen in albanischer Gemeinschaft."
          : locale === "en"
            ? "Cultural evenings with food, music, and gatherings in the Albanian community."
            : "Mbrëmje kulturore me ushqim, muzikë dhe shoqërim në komunitet shqiptar.";
      break;
    default:
      description = "";
  }

  return { slug, name, description };
}
