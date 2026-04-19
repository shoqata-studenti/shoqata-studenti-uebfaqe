import { Playfair_Display } from "next/font/google";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function InfoPage() {
  const dict = getDictionary(await getLocale());
  const i = dict.infoPage;

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
          {i.badge}
        </p>
        <h1
          className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          {i.title}
        </h1>

        <div className="mt-14 space-y-8 text-center text-base leading-[1.85] text-black/80 md:text-lg">
          <p>{i.p1}</p>
          <p>{i.p2}</p>
          <p>{i.p3}</p>
        </div>
      </section>
    </main>
  );
}
