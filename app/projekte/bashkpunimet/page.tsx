import Link from "next/link";
import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function BashkpunimetPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <>
      <SubpageHero title={dict.nav.bashkpunimet} variant="compact" />
      <div className="border-t border-black/10 bg-white pb-20 text-black">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
          <p className="max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.collaborations.intro}
          </p>
          <p className="mt-6 text-base font-semibold text-black">
            {dict.projectPages.collaborations.listTitle}
          </p>
          <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-base leading-relaxed text-black/80">
            <li>
              <Link
                href="https://www.swissalbmed.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
              >
                Lidhja e Mjekëve Shqiptarë në Zvicër
              </Link>
            </li>
            <li>
              <Link
                href="https://albanian-engineering.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
              >
                Lidhja e Inxhinierëve Shqiptarë në Zvicër
              </Link>
            </li>
            <li>
              <Link
                href="https://albphdcircle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
              >
                AlbPhD Circle
              </Link>
            </li>
          </ul>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-black/80">
            {dict.projectPages.collaborations.summary}
          </p>
        </div>
      </div>
    </>
  );
}
