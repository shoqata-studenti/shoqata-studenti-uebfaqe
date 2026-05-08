import Link from "next/link";

import { createPost } from "./actions";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const q = await searchParams;

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Krijo post të ri</h1>
        <p className="mt-3 text-sm">
          <Link href="/admin" className="text-black/70 underline-offset-2 hover:text-[#E11D48] hover:underline">
            ← Kthehu te paneli i adminit
          </Link>
        </p>
        <p className="mt-2 text-sm text-black/65">
          Teksti dhe një URL publik për kopertinën (http/https) — nuk ka ngarkim skedari për
          poste; për foto të eventit përdor «Foto eventesh».
        </p>

        <div className="mt-8 space-y-4">
          {q.success === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black">
              Posti u ruajt.{" "}
              <Link href="/" className="font-semibold text-[#E11D48] underline-offset-2 hover:underline">
                Shiko faqen kryesore
              </Link>
            </p>
          ) : null}
          {q.error === "1" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Të dhënat nuk janë të plota ose URL e imazhit / viti nuk është i vlefshëm.
            </p>
          ) : null}
        </div>

        <form action={createPost} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold uppercase tracking-wide">
              Titulli
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
              placeholder="Titulli i lajmit"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-semibold uppercase tracking-wide">
              Teksti
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              className="w-full resize-y rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
              placeholder="Përmbajtja e plotë e postit…"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-semibold uppercase tracking-wide">
              Viti
            </label>
            <select
              id="year"
              name="year"
              required
              defaultValue={2026}
              className="w-full max-w-xs rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
            >
              {[2026, 2025, 2024, 2023].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="eventSlug" className="text-sm font-semibold uppercase tracking-wide">
              Event (opsionale)
            </label>
            <select
              id="eventSlug"
              name="eventSlug"
              defaultValue=""
              className="w-full max-w-md rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
            >
              <option value="">— Pa event (vetëm në ballinë)</option>
              <option value="kafe-llafe">Kafe Llafe</option>
              <option value="festa-e-flamurit">Festa e Flamurit</option>
              <option value="udhetime">Udhetime</option>
              <option value="ligjerata">Ligjërata</option>
              <option value="sofra">Sofra</option>
            </select>
            <p className="text-xs text-black/55">
              Nëse zgjedh një event, posti shfaqet edhe në faqen e atij eventi (galeri zig-zag +
              kartë).
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-semibold uppercase tracking-wide">
              URL e imazhit
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              className="w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
              placeholder="https://…"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-sm bg-[#E11D48] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Ruaj postin
            </button>
            <Link
              href="/admin"
              className="inline-flex min-h-10 items-center justify-center rounded-sm border border-black/25 bg-white px-6 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:border-black hover:bg-black/[0.04]"
            >
              Anulo
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
