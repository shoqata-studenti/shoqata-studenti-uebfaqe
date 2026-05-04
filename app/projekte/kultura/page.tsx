import Link from "next/link";

import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

const teaserCardClass =
  "block max-w-xl rounded-sm border border-black/12 bg-black/[0.02] p-6 transition-[border-color,box-shadow] hover:border-[#E11D48]/40 hover:shadow-md";

export default async function Page() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={dict.nav.kultura} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
            {dict.vargjet.kulturaSectionKicker}
          </h2>
          <Link href="/projekte/kultura/vargjet-e-lira" className={`${teaserCardClass} mt-4`}>
            <p className="text-xl font-semibold tracking-tight">{dict.vargjet.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-black/70">{dict.vargjet.kulturaTeaser}</p>
            <p className="mt-4 text-sm font-semibold text-[#E11D48]">{dict.vargjet.kulturaTeaserCta} →</p>
          </Link>
        </div>
      </div>
    </>
  );
}
