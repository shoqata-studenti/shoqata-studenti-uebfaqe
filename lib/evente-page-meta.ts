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
      description = dict.evente.kafeLlafeBody;
      break;
    case "festa-e-flamurit":
      description = dict.evente.festaFlamuritShort;
      break;
    case "udhetime":
      description = dict.evente.udhetimeBody;
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
      description = dict.evente.sofraBody;
      break;
    default:
      description = "";
  }

  return { slug, name, description };
}
