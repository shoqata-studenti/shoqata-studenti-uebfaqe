import Link from "next/link";

import {
  POST_COVER_IMAGE_MAX_BYTES,
  POST_COVER_VIDEO_MAX_BYTES,
} from "@/lib/post-image-upload";
import { prisma } from "@/lib/db";
import { POST_CARD_LINK_OPTIONS } from "@/lib/post-card-links";

import { AdminPostsDeleteList } from "@/components/admin-posts-delete-list";

import { createPost } from "./actions";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const q = await searchParams;
  const maxImgMb = Math.round(POST_COVER_IMAGE_MAX_BYTES / (1024 * 1024));
  const maxVidMb = Math.round(POST_COVER_VIDEO_MAX_BYTES / (1024 * 1024));

  let existingPosts: { id: number; title: string; createdAt: Date }[] = [];
  try {
    existingPosts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { id: true, title: true, createdAt: true },
    });
  } catch {
    existingPosts = [];
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Postet</h1>
        <p className="mt-2 text-sm text-black/65">
          Lista më poshtë: fshi poste ose krijo të reja (forma në fund).
        </p>
        <p className="mt-3 text-sm">
          <Link href="/admin" className="text-black/70 underline-offset-2 hover:text-[#E11D48] hover:underline">
            ← Kthehu te paneli i adminit
          </Link>
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
              Zgjidh një skedar foto ose video.
            </p>
          ) : null}
          {q.error === "size" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Skedari është shumë i madh.
            </p>
          ) : null}
          {q.error === "mime" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
              Lejohen JPEG, PNG, WebP, GIF, ose video MP4/WebM/MOV (QuickTime).
            </p>
          ) : null}
        </div>

        <section className="mt-10 border-t border-black/10 pt-10">
          <h2 className="text-lg font-bold tracking-tight">Postet ekzistuese — fshi</h2>
          <p className="mt-2 text-sm text-black/60">
            Butoni «Fshi» heq postin nga databaza (ballina, «Në vijim», faqet e eventeve).
          </p>
          <AdminPostsDeleteList
            initialPosts={existingPosts.map((p) => ({
              id: p.id,
              title: p.title,
              createdAt: p.createdAt.toISOString(),
            }))}
          />
        </section>

        <section className="mt-12 border-t border-black/10 pt-10">
          <h2 className="text-lg font-bold tracking-tight">Krijo post të ri</h2>
          <p className="mt-2 text-sm text-black/65">
            Ngarko foto ose video kopertine. Opsionale: zgjidh një nga 5 eventet ose 4 projektet në listën më
            poshtë. Për foto të veçanta të eventit përdor «Foto eventesh». Imazh deri ~{maxImgMb} MB, video deri
            ~{maxVidMb} MB.
          </p>
          <form action={createPost} className="mt-6 space-y-6">
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
                Foto ose video kopertine
              </label>
              <input
                id="cover"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
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
                Vetëm kjo listë: 5 evente, pastaj 4 projekte. Nëse zgjedh një event, posti shfaqet edhe në faqen e
                atij eventi.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="eventAt" className="text-sm font-semibold uppercase tracking-wide">
                Data e aktivitetit (për «Në vijim» në ballinë — opsionale)
              </label>
              <input
                id="eventAt"
                name="eventAt"
                type="datetime-local"
                className="w-full max-w-md rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
              />
              <p className="text-xs text-black/55">Pa datë, posti nuk shfaqet te seksioni «Në vijim».</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="venue" className="text-sm font-semibold uppercase tracking-wide">
                Vendi (opsional)
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                maxLength={240}
                className="w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
                placeholder="p.sh. Zürich, adresë ose sallë"
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
        </section>
      </div>
    </main>
  );
}
