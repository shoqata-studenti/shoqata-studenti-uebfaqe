import { Playfair_Display } from "next/font/google";
import Link from "next/link";

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
          {i.p4 ? <p>{i.p4}</p> : null}
        </div>

        {i.vsuzhBody || i.vsethBody ? (
          <div className="mt-14 space-y-10 border-t border-black/10 pt-10 text-left">
            {i.vsuzhBody ? (
              <article>
                <h2 className="text-lg font-bold text-black md:text-xl">{i.vsuzhTitle}</h2>
                <p className="mt-3 text-base leading-relaxed text-black/80">{i.vsuzhBody}</p>
                <Link
                  href={i.vsuzhLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
                >
                  {i.vsuzhLink}
                </Link>
              </article>
            ) : null}

            {i.vsethBody ? (
              <article>
                <h2 className="text-lg font-bold text-black md:text-xl">{i.vsethTitle}</h2>
                <p className="mt-3 text-base leading-relaxed text-black/80">{i.vsethBody}</p>
                <Link
                  href={i.vsethLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-4 hover:decoration-[#E11D48]"
                >
                  {i.vsethLink}
                </Link>
              </article>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
