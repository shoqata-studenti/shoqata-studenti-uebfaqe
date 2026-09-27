import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function StrukturaPage() {
  const copy = getDictionary(await getLocale()).strukturaPage;

  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title={copy.title} as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="overflow-hidden rounded-sm border border-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/organigram-shoqata.png"
            alt={copy.imageAlt}
            className="h-auto w-full"
          />
        </div>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-black/80">
          <p>{copy.p1}</p>

          <p>{copy.p2}</p>

          <div>
            <p>{copy.fundingIntro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 marker:text-[#E11D48]">
              {copy.funding.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <p>{copy.p3}</p>
        </div>
      </section>
    </main>
  );
}
