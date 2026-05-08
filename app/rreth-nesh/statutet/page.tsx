import { SubpageHero } from "@/components/subpage-hero";

export default function StatutetPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Statutet" as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>
            Statutet e Shoqatës Studenti përbëjnë bazën juridike dhe organizative të funksionimit
            të shoqatës. Ato përcaktojnë strukturën e organizatës, kompetencat e organeve
            drejtuese, të drejtat dhe obligimet e anëtarëve, si dhe parimet mbi të cilat ndërtohet
            veprimtaria e shoqatës. Përmes statuteve rregullohen proceset vendimmarrëse,
            organizimi i Kuvendit të Përgjithshëm, zgjedhja e kryesisë, financimi dhe funksionimi i
            përgjithshëm i shoqatës.
          </p>

          <p>
            Shoqata Studenti funksionon mbi parimet e transparencës, barazisë, pavarësisë politike
            dhe mbrojtjes së të dhënave personale të anëtarëve. Statutet gjithashtu përcaktojnë
            qartë qëllimin e shoqatës: krijimin e një platforme akademike, kulturore dhe shoqërore
            për studentët shqiptarë në Zürich dhe promovimin e identitetit, gjuhës dhe kulturës
            shqiptare.
          </p>
        </div>

        <div className="mt-10 rounded-sm border border-black/10 bg-white p-4 sm:p-5">
          <p className="font-medium text-black">Statutet 2024 (PDF)</p>
          <p className="mt-1 text-sm text-black/55">Hape në tab të ri ose shkarko dokumentin.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/statutet-2024.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center justify-center rounded-sm border border-black/20 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-black transition-colors hover:border-[#E11D48] hover:text-[#E11D48]"
            >
              Hape
            </a>
            <a
              href="/statutet-2024.pdf"
              download
              className="inline-flex min-h-9 items-center justify-center rounded-sm bg-[#E11D48] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c]"
            >
              Shkarko
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
