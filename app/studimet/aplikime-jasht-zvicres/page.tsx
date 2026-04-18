import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

function PlaceholderLink({
  href = "#",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-[#E11D48] underline decoration-[#E11D48]/35 underline-offset-[3px] transition-colors hover:decoration-[#E11D48]"
    >
      {children}
    </Link>
  );
}

export default function AplikimePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
          Studimet
        </p>
        <h1
          className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          Aplikime jashtë Zvicrës
        </h1>

        <p className="mx-auto mt-12 max-w-2xl text-base leading-relaxed text-black/80 md:text-lg">
          Në vazhdim gjeni disa informata dhe njoftime për kushtet e studimeve në Cyrih (për
          Universitetin e Cyrihut - UZH dhe ETH Zürich):
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 md:pb-32">
        <div className="space-y-16">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">
              Informatat e përgjithshme rreth aplikimit
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>UZH Bachelor</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>UZH Master</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>ETH Bachelor</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>ETH Master</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">
              Dokumentet të cilat nevojiten për aplikim
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>UZH Bachelor / Master</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>ETH Bachelor / Master</PlaceholderLink>
              </li>
            </ul>
            <p className="mt-8 rounded-sm border border-black/10 bg-black/[0.02] p-6 text-left text-sm leading-relaxed text-black/80 md:text-base">
              Si p.sh. për ETH Zürich klikoni te &apos;Master electrical engineering and information
              technology&apos;, faqe e cila ju tregon të gjitha dokumentet shtesë të cilat janë të
              domosdoshme për aplikim (GRE, English certificate etj.). Përvoja jonë ka treguar se
              studentët me diplomë të maturës ose të bachelor-it nga një shkollë publike (p.sh.
              Universiteti i Tiranës ose Universiteti i Prishtinës) kanë shanse më reale për
              pranim.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">
              Afatet për aplikim
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>UZH</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>ETH</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">
              Informata për vizë
            </h2>
            <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>Viza</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black">
              Financat dhe shpenzimet
            </h2>
            <p className="mt-6 text-base leading-relaxed text-black/85">
              Së fundi: Pa mjete financiare nuk bëhet sot asgjë, kështu që lidhur me këtë, të
              gjitha informatat rreth shpenzimeve për jetesë, aplikim, semestër, bursa etj. gjenden
              këtu:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-base leading-relaxed text-black/85 marker:text-[#E11D48]">
              <li>
                <PlaceholderLink>UZH</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>ETH</PlaceholderLink>
              </li>
            </ul>
          </div>

          <p className="border-t border-black/10 pt-12 text-center text-base leading-relaxed text-black/80 md:text-lg">
            Ju lutem informohuni në të gjitha lidhjet e shënuara më lart, para se të na dërgoni një
            pyetje shtesë. Gjithashtu ju informojmë se Shoqata Studenti nuk ofron ndihmë financiare
            për studentët. Ka shumë punë për të aplikuar. Por shpresojmë se keni vullnetin, kohën dhe
            dëshirën t&apos;i plotësoni të gjitha kushtet për studime në Cyrih. Ju dëshirojmë shumë
            sukses në aplikim!
          </p>
        </div>
      </section>
    </main>
  );
}
