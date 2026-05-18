import type { Dictionary } from "@/lib/i18n/get-dictionary";

export type PostI18nKey = keyof Dictionary["post"]["entries"];

const POST_I18N_KEYS = ["gv2026"] as const satisfies readonly PostI18nKey[];

export type PostForI18n = {
  title: string;
  content: string;
  i18nKey: string | null;
};

export function isPostI18nKey(key: string): key is PostI18nKey {
  return (POST_I18N_KEYS as readonly string[]).includes(key);
}

/** Titull dhe tekst sipas gjuhës aktive; pa çelës mbetet përmbajtja nga DB. */
export function getLocalizedPostFields(
  dict: Dictionary,
  post: PostForI18n
): { title: string; content: string } {
  const key = post.i18nKey?.trim();
  if (!key || !isPostI18nKey(key)) {
    return { title: post.title, content: post.content };
  }
  const entry = dict.post.entries[key];
  return { title: entry.title, content: entry.content };
}
