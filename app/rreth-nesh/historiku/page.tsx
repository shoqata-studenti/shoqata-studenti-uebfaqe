import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function HistorikuPage() {
  const dict = getDictionary(await getLocale());

  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title={dict.nav.historiku} as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <p className="text-base leading-relaxed text-black/80">{dict.history.body}</p>
      </section>
    </main>
  );
}
