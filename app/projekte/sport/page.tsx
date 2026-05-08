import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function Page() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={dict.nav.sporti} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <p className="max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.sport.intro}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.sport.goal}
          </p>
        </div>
      </div>
    </>
  );
}
