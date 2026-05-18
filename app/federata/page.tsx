import Link from "next/link";
import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function Page() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={dict.nav.federata} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
            {dict.projectPages.federata.heading}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.federata.intro}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.federata.representation}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.federata.activities}
          </p>
          <p className="mt-8">
            <Link
              href="https://www.instagram.com/albstudent.ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
            >
              {dict.projectPages.federata.instagramLabel}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
