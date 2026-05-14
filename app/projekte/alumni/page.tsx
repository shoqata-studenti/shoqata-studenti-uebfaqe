import Link from "next/link";

import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function AlumniPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={dict.nav.alumni} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <p className="max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.alumni.intro}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.alumni.dinner}
          </p>
          <p className="mt-8">
            <Link
              href="/membership?type=ALUMNI"
              className="text-sm font-semibold uppercase tracking-[0.14em] text-[#E11D48] underline decoration-[#E11D48]/40 underline-offset-4 transition hover:decoration-[#E11D48]"
            >
              {dict.projectPages.alumni.cta}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
