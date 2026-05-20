import type { Dictionary } from "@/lib/i18n/get-dictionary";

export const LIGJERATA_TOPIC_SLUGS = [
  "kongresi-i-berlinit",
  "transnationale-demokratie",
] as const;

export type LigjerataTopicSlug = (typeof LIGJERATA_TOPIC_SLUGS)[number];

export function isLigjerataTopicSlug(value: string): value is LigjerataTopicSlug {
  return (LIGJERATA_TOPIC_SLUGS as readonly string[]).includes(value);
}

export type LigjerataTopicContent = {
  slug: LigjerataTopicSlug;
  title: string;
  body: string;
};

export function getLigjerataTopicContent(
  dict: Dictionary,
  slug: LigjerataTopicSlug
): LigjerataTopicContent {
  const entry = dict.ligjerataTopics[slug];
  return { slug, title: entry.title, body: entry.body };
}
