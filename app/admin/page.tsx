import Link from "next/link";

const cardClass =
  "block rounded-sm border border-black/12 bg-black/[0.02] p-6 transition-[border-color,box-shadow] hover:border-[#E11D48]/40 hover:shadow-md";

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Paneli</h1>
        <p className="mt-2 text-sm text-black/65">
          Zgjidh çfarë dëshiron të përditësosh.
        </p>

        <ul className="mt-10 space-y-4">
          <li>
            <Link href="/admin/evente" className={cardClass}>
              <h2 className="text-lg font-semibold tracking-tight">Foto eventesh</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/65">
                Ngarko foto për çdo event — shfaqen në faqen e eventit dhe si kopertinë në ballinë.
              </p>
              <p className="mt-4 text-sm font-semibold text-[#E11D48]">Vazhdo →</p>
            </Link>
          </li>
          <li>
            <Link href="/admin/posts" className={cardClass}>
              <h2 className="text-lg font-semibold tracking-tight">Poste (lajme)</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/65">
                Krijo post të veçantë me URL imazhi (opsionale: lidhje me një event).
              </p>
              <p className="mt-4 text-sm font-semibold text-[#E11D48]">Vazhdo →</p>
            </Link>
          </li>
          <li>
            <Link href="/admin/vargjet-e-lira" className={cardClass}>
              <h2 className="text-lg font-semibold tracking-tight">Vargjet e lira (Kultura)</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/65">
                Shto tema dhe ngarko dokumente (PDF, TXT, Word) për faqen publike të kulturës.
              </p>
              <p className="mt-4 text-sm font-semibold text-[#E11D48]">Vazhdo →</p>
            </Link>
          </li>
        </ul>

        <p className="mt-12 text-sm text-black/50">
          <Link href="/" className="text-[#E11D48] underline-offset-2 hover:underline">
            Kthehu në sajtin publik
          </Link>
        </p>
      </div>
    </main>
  );
}
