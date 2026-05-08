import { SubpageHero } from "@/components/subpage-hero";

export default function StrukturaPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Struktura" as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="overflow-hidden rounded-sm border border-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/organigram-shoqata.png"
            alt="Organigrami i Shoqates Studenti"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-black/80">
          <p>
            Struktura organizative e Shoqatës Studenti bazohet në parimet e përcaktuara në statutet
            e shoqatës. Organi më i lartë vendimmarrës është Kuvendi i Përgjithshëm, i cili
            përbëhet nga anëtarët aktivë me të drejtë vote. Të gjithë anëtarët aktivë kanë të
            drejtë vote dhe marrin pjesë në proceset kryesore vendimmarrëse të shoqatës.
          </p>

          <p>
            Kryesia funksionon si organ ekzekutiv i shoqatës dhe është përgjegjëse për zbatimin e
            vendimeve të Kuvendit të Përgjithshëm, administrimin e shoqatës dhe organizimin e
            aktiviteteve. Brenda kryesisë nuk ekziston një hierarki e brendshme - anëtarët e
            kryesisë bashkëpunojnë në mënyrë kolektive dhe funksionojnë mbi parimin e përgjegjësisë
            së përbashkët. Në këtë kuptim, anëtarësia e shoqatës qëndron institucionalisht mbi
            kryesinë, pasi kryesia zgjidhet dhe mandatohet nga vetë anëtarët.
          </p>

          <div>
            <p>Financimi i Shoqatës Studenti realizohet përmes:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 marker:text-[#E11D48]">
              <li>kontributeve të anëtarësisë,</li>
              <li>
                mbështetjes nga ETH Zürich (VSETH), Universität Zürich (VSUZH) dhe institucione të
                tjera akademike apo kulturore,
              </li>
              <li>të ardhurave nga aktivitetet dhe eventet e organizuara nga vetë shoqata,</li>
              <li>si dhe donacioneve vullnetare.</li>
            </ul>
          </div>

          <p>
            Në përputhje me statutet e shoqatës, Shoqata Studenti nuk ka sponsorë komercialë dhe
            nuk lejohet të pranojë apo të kërkojë sponsorizime monetare nga kompani fitimprurëse.
            Kjo strukturë financimi synon të ruajë pavarësinë, neutralitetin dhe autonominë
            institucionale të shoqatës.
          </p>
        </div>
      </section>
    </main>
  );
}
