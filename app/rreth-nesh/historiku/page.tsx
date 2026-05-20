import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function HistorikuPage() {
  const dict = getDictionary(await getLocale());

  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title={dict.nav.historiku} as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:px-10 md:pb-24">
        <div className="mt-2 whitespace-pre-line text-[17px] leading-[1.85] text-black/80 md:mt-4 md:text-lg md:leading-[1.9]">
          {dict.history.body}
        </div>
      </section>
    </main>
  );
}
