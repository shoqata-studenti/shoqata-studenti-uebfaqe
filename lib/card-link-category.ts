import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { isAllowedCardLinkPath, type PostCardLinkPath } from "@/lib/post-card-links";

const LABEL_GETTERS: Record<PostCardLinkPath, (d: Dictionary) => string> = {
  "/evente/kafe-llafe": (d) => d.nav.kafeLlafe,
  "/evente/festa-e-flamurit": (d) => d.nav.festaEFlamurit,
  "/evente/udhetime": (d) => d.nav.udhetime,
  "/evente/ligjerata": (d) => d.nav.ligjerata,
  "/evente/sofra": (d) => d.nav.sofra,
  "/projekte/kultura/vargjet-e-lira": (d) => d.nav.vargjetELira,
  "/projekte/alumni": (d) => d.nav.alumni,
  "/projekte/sporti": (d) => d.nav.sporti,
  "/projekte/bashkpunimet": (d) => d.nav.bashkpunimet,
};

/** Emri i eventit/projektit sipas lidhjes së kartës (sipas gjuhës së faqes). */
export function cardLinkCategoryLabel(dict: Dictionary, path: string | null): string | null {
  if (!path || !isAllowedCardLinkPath(path)) return null;
  return LABEL_GETTERS[path](dict);
}
