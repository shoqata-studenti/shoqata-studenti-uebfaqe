import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export function SubpageHero({ title }: { title: string }) {
  return (
    <main className="min-h-[72vh] bg-white text-black">
      <section className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-3xl border-l-4 border-[#E11D48] pl-6 md:pl-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
            Shoqata Studenti Zürich
          </p>
          <h1
            className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight md:text-5xl`}
          >
            {title}
          </h1>
        </div>
      </section>
    </main>
  );
}
