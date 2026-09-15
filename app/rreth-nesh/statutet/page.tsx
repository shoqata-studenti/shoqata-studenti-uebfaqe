import { SubpageHero } from "@/components/subpage-hero";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function StatutetPage() {
  const copy = getDictionary(await getLocale()).statutet;

  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title={copy.title} as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>{copy.paragraphOne}</p>
          <p>{copy.paragraphTwo}</p>
        </div>

        <div className="mt-10 space-y-4">
          <div className="rounded-sm border border-black/10 bg-white p-4 sm:p-5">
            <p className="font-medium text-black">{copy.albanianPdf}</p>
            <p className="mt-1 text-sm text-black/55">{copy.documentsHint}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/Statuti%20Shqip.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center justify-center rounded-sm border border-black/20 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-black transition-colors hover:border-[#E11D48] hover:text-[#E11D48]"
              >
                {copy.open}
              </a>
              <a
                href="/Statuti%20Shqip.pdf"
                download
                className="inline-flex min-h-9 items-center justify-center rounded-sm bg-[#E11D48] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
              >
                {copy.download}
              </a>
            </div>
          </div>

          <div className="rounded-sm border border-black/10 bg-white p-4 sm:p-5">
            <p className="font-medium text-black">{copy.germanPdf}</p>
            <p className="mt-1 text-sm text-black/55">{copy.documentsHint}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/Statuten%20Deutsch.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center justify-center rounded-sm border border-black/20 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-black transition-colors hover:border-[#E11D48] hover:text-[#E11D48]"
              >
                {copy.open}
              </a>
              <a
                href="/Statuten%20Deutsch.pdf"
                download
                className="inline-flex min-h-9 items-center justify-center rounded-sm bg-[#E11D48] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
              >
                {copy.download}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
