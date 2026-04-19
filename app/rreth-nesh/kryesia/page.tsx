import { Kryesia } from "@/components/kryesia";
import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function Page() {
  const dict = getDictionary(await getLocale());

  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title={dict.nav.kryesia} as="div" variant="compact" />
      <Kryesia showHeading={false} copy={dict.kryesia} />
    </main>
  );
}
