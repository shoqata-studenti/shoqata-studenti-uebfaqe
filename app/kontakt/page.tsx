import Link from "next/link";
import { Playfair_Display } from "next/font/google";

import { SocialLinks } from "@/components/social-links";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

import { sendContactMessage } from "./actions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

const fieldClass =
  "w-full rounded-sm border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition-[border-color,box-shadow] placeholder:text-black/40 focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20";

export default async function KontaktPage({ searchParams }: Props) {
  const q = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const k = dict.kontakt;

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

            {q.sent === "1" ? (
              <p className="mt-4 rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black/80">
                {k.sentSim}{" "}
                <a
                  href="mailto:info@shoqata-studenti.ch"
                  className="font-medium text-[#E11D48] underline-offset-2 hover:underline"
                >
                  info@shoqata-studenti.ch
                </a>
                .
              </p>
            ) : null}
            {q.error === "1" ? (
              <p className="mt-4 rounded-sm border border-[#E11D48]/35 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
                {k.errorFields}
              </p>
            ) : null}

            <form action={sendContactMessage} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="emri"
                  className="text-xs font-semibold uppercase tracking-wide text-black/80"
                >
                  {k.labelName}
                </label>
                <input
                  id="emri"
                  name="emri"
                  type="text"
                  required
                  autoComplete="name"
                  className={fieldClass}
                  placeholder={k.placeholderName}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wide text-black/80"
                >
                  {k.labelEmail}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                  placeholder={k.placeholderEmail}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="mesazhi"
                  className="text-xs font-semibold uppercase tracking-wide text-black/80"
                >
                  {k.labelMessage}
                </label>
                <textarea
                  id="mesazhi"
                  name="mesazhi"
                  required
                  rows={6}
                  className={`${fieldClass} resize-y`}
                  placeholder={k.placeholderMessage}
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-[#E11D48] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                {k.submit}
              </button>
            </form>
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
