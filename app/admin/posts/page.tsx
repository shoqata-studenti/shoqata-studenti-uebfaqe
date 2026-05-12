import Link from "next/link";

import { POST_IMAGE_MAX_BYTES } from "@/lib/post-image-upload";
import { POST_CARD_LINK_OPTIONS } from "@/lib/post-card-links";

import { createPost } from "./actions";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const q = await searchParams;
  const maxMb = Math.round(POST_IMAGE_MAX_BYTES / (1024 * 1024));

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
          Ngarko foto kopertine. Opsionale: zgjidh një nga 5 eventet ose 4 projektet në listën më poshtë
          — është vetëm një fushë. Për foto të veçanta të eventit përdor «Foto eventesh». Maks. ~{maxMb}{" "}
          MB.
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
              Të dhënat nuk janë të plota.
            </p>
          ) : null}
          {q.error === "file" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Zgjidh një skedar foto.
            </p>
          ) : null}
          {q.error === "size" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Skedari është shumë i madh.
            </p>
          ) : null}
          {q.error === "mime" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Lejohen vetëm JPEG, PNG, WebP ose GIF.
            </p>
          ) : null}
        </div>

        <form action={createPost} encType="multipart/form-data" className="mt-8 space-y-6">
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
            <label htmlFor="cover" className="text-sm font-semibold uppercase tracking-wide">
              Foto kopertine
            </label>
            <input
              id="cover"
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              className="w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cardLinkPath" className="text-sm font-semibold uppercase tracking-wide">
              Evente + projekte (opsionale — një listë)
            </label>
            <select
              id="cardLinkPath"
              name="cardLinkPath"
              defaultValue=""
              className="w-full max-w-md rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
            >
              <option value="">— Asnjë (vetëm /posts/…)</option>
              {POST_CARD_LINK_OPTIONS.map((o) => (
                <option key={o.path} value={o.path}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-black/55">
              Vetëm kjo listë: 5 evente, pastaj 4 projekte. Nëse zgjedh një event, posti shfaqet edhe
              në faqen e atij eventi.
            </p>
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
