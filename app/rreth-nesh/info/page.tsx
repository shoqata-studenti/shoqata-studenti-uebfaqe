import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
          Rreth nesh
        </p>
        <h1
          className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          Info
        </h1>

        <div className="mt-14 space-y-8 text-center text-base leading-[1.85] text-black/80 md:text-lg">
          <p>
            Një grup studentësh shqiptarë takoheshin vazhdimisht në mënyrë informale rreth vitit
            2000. Vetëm një vit pas luftës në Kosovë dhe në prag të luftës në pjesën shqiptare të
            Maqedonisë së Veriut, vendosën të formonin Shoqatën Studentore Shqiptare “Studenti”.
          </p>
          <p>
            Konteksti në të cilin u formua “Studenti” ishte mjaft i trishtë, për të mos thënë
            tragjik, sidomos duke pasur parasysh që kishte anëtarë të asaj kohe që bënë burg për
            shpërndarjen e librave.
          </p>
          <p>
            Sot, situata është ndryshe. Por “Studenti” është dhe ka qenë i formuar nga dhe për
            studentët shqiptarë në Cyrih, dhe përbën një platformë informative, ndërrjetëzuese dhe
            zëdhënëse për studentët.
          </p>
        </div>
      </section>
    </main>
  );
}
