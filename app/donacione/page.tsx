import { Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";

import { DONATION_QR_NOTE_MAX_LENGTH, donationsEnabled } from "@/lib/donation-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

import { QrBillDonationForm, StripeDonationForm } from "./donation-forms";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function DonacionePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  if (!donationsEnabled()) notFound();

  const { status } = await searchParams;
  const locale = await getLocale();
  const d = getDictionary(locale).donacione;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">{d.badge}</p>
          <h1 className={`${playfair.className} mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl`}>
            {d.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">{d.intro}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-black/65 md:text-base">{d.usage}</p>
        </div>

        {status === "success" ? (
          <p className="mx-auto mt-10 max-w-xl rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-center text-sm text-black/80">
            {d.thanks}
          </p>
        ) : null}

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{d.stripeTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65">{d.stripeIntro}</p>
            <StripeDonationForm dict={d} turnstileSiteKey={turnstileSiteKey} />
          </div>

          <div className="mx-auto w-full max-w-md border-t border-black/10 pt-12 lg:mx-0 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">{d.qrTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65">{d.qrIntro}</p>
            <QrBillDonationForm dict={d} qrNoteMaxLength={DONATION_QR_NOTE_MAX_LENGTH} />
          </div>
        </div>
      </section>
    </main>
  );
}
