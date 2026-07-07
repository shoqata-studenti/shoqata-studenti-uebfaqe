import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { SocialLinks } from "@/components/social-links";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

import { KontaktForm } from "./contact-form";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function KontaktPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const k = dict.kontakt;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
            {k.badge}
          </p>
          <h1
            className={`${playfair.className} mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl`}
          >
            {k.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-black/65 md:text-base">
            {k.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{k.formTitle}</h2>

            <KontaktForm dict={k} turnstileSiteKey={turnstileSiteKey} />
          </div>

          <div className="mx-auto w-full max-w-md border-t border-black/10 pt-12 lg:mx-0 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{k.socialTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65">{k.socialHint}</p>
            <div className="mt-8">
              <SocialLinks />
            </div>

            <div className="mt-14 rounded-sm border border-black/10 bg-black/[0.02] p-6 text-left">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#E11D48]">
                {k.impressum}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-black/80">
                <strong className="text-black">Shoqata Studenti Zürich</strong>
                <br />
                <span className="text-black/70">{k.addressLine}</span>
                <br />
                {k.addressSample}
              </p>
              <p className="mt-4 text-sm">
                <Link
                  href="mailto:info@shoqata-studenti.ch"
                  className="font-medium text-[#E11D48] underline-offset-2 hover:underline"
                >
                  info@shoqata-studenti.ch
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
