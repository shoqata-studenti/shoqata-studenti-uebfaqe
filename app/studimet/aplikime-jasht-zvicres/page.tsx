import Link from "next/link";
import { SubpageHero } from "@/components/subpage-hero";

export default function AplikimePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Aplikime jashtë Zvicrës" as="div" variant="compact" />

      <section className="mx-auto max-w-3xl px-6 pb-24 md:pb-32">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>
            Për studentët që janë të interesuar për shkëmbime, master apo aplikime akademike jashtë
            Zvicrës, universitetet ETH Zürich dhe UZH ofrojnë programe të ndryshme mobiliteti dhe
            partneritete ndërkombëtare. Në linket më poshtë mund të gjeni informata rreth
            mundësive për studime dhe aplikime ndërkombëtare.
          </p>

          <p>
            <Link
              href="https://ethz.ch/en/studies/international-immigration-housing/outgoing-exchange.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
            >
              ETH Zürich - Exchange & Mobility
            </Link>
          </p>

          <p>
            <Link
              href="https://www.int.uzh.ch/en/outgoing.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
            >
              Universität Zürich - International Mobility
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
