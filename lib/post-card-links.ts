import "server-only";

import { EVENT_SLUGS, type EventSlug } from "@/lib/event-slugs";

const EVENT_LABELS_SQ: Record<EventSlug, string> = {
  "kafe-llafe": "Kafe Llafe",
  "festa-e-flamurit": "Festa e Flamurit",
  udhetime: "Udhëtime",
  ligjerata: "Ligjërata",
  sofra: "Sofra",
};

/** Katër projektet në navigim (krahasuar me `header-nav.tsx`). */
const PROJECT_PATHS = [
  "/projekte/kultura/vargjet-e-lira",
  "/projekte/alumni",
  "/projekte/sporti",
  "/projekte/bashkpunimet",
] as const;

const PROJECT_LABELS: Record<(typeof PROJECT_PATHS)[number], string> = {
  "/projekte/kultura/vargjet-e-lira": "Vargjet e Lira",
  "/projekte/alumni": "Alumni",
  "/projekte/sporti": "Sporti",
  "/projekte/bashkpunimet": "Bashkëpunimet",
};

export const POST_CARD_LINK_OPTIONS = [
  ...EVENT_SLUGS.map((slug) => ({
    path: `/evente/${slug}` as const,
    label: EVENT_LABELS_SQ[slug],
  })),
  ...PROJECT_PATHS.map((path) => ({
    path,
    label: PROJECT_LABELS[path],
  })),
] as const;

export type PostCardLinkPath = (typeof POST_CARD_LINK_OPTIONS)[number]["path"];

const ALLOWED_SET = new Set<string>(POST_CARD_LINK_OPTIONS.map((o) => o.path));

export function isAllowedCardLinkPath(value: string): value is PostCardLinkPath {
  return ALLOWED_SET.has(value);
}

export function postCardHref(input: { id: number; cardLinkPath: string | null }): string {
  if (input.cardLinkPath && isAllowedCardLinkPath(input.cardLinkPath)) {
    return input.cardLinkPath;
  }
  return `/posts/${input.id}`;
}
