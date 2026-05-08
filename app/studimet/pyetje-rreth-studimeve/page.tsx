import { SubpageHero } from "@/components/subpage-hero";
import Link from "next/link";

export default function PyetjeRrethStudimevePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Pyetje rreth studimeve" as="div" variant="compact" />
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
        <div className="space-y-6 text-base leading-relaxed text-black/80">
          <p>
            Studentët që kanë pyetje rreth drejtimit të tyre të studimeve mund të kontaktojnë
            anëtarë të Shoqatës Studenti që studiojnë në të njëjtën fushë apo program. Qëllimi
            është krijimi i një platforme mbështetëse mes studentëve për këshilla akademike, përvoja
            personale dhe orientim gjatë studimeve.
          </p>
          <p>
            Për kontakt, mund të përdorni formularin ose adresën tonë elektronike:{" "}
            <Link
              href="/kontakt#kontakt-formular"
              className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
            >
              LINK - EMAIL
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
