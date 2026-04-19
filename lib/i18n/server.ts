import { cookies } from "next/headers";

import { LOCALE_COOKIE, defaultLocale, isLocale, type Locale } from "./config";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const raw = jar.get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : defaultLocale;
}
