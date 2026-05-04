import Link from "next/link";

import { prisma } from "@/lib/db";
import { VARGJET_MAX_FILE_BYTES } from "@/lib/vargjet-upload";

import {
  createVargjetTopic,
  deleteVargjetDocument,
  deleteVargjetTopic,
  uploadVargjetDocument,
} from "./actions";

const inputClass =
  "w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25";

type Props = {
  searchParams: Promise<{
    topicOk?: string;
    topicError?: string;
    docOk?: string;
    docError?: string;
    delTopicOk?: string;
    delDocOk?: string;
    delError?: string;
  }>;
};

export default async function AdminVargjetPage({ searchParams }: Props) {
  const q = await searchParams;

  const topics = await prisma.vargjetTopic.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  const maxMb = Math.round(VARGJET_MAX_FILE_BYTES / (1024 * 1024));

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto w-full max-w-3xl px-6 py-12 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E11D48]">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Vargjet e lira</h1>
        <p className="mt-2 text-sm text-black/65">
          Krijo tema (karta në faqe publike), pastaj ngarko PDF, TXT ose Word për çdo temë. Skedari
          deri në {maxMb} MB.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <Link href="/admin" className="text-black/70 underline-offset-2 hover:text-[#E11D48] hover:underline">
            ← Paneli i adminit
          </Link>
          <span className="text-black/30" aria-hidden>
            |
          </span>
          <Link
            href="/projekte/kultura/vargjet-e-lira"
            className="font-semibold text-[#E11D48] underline-offset-2 hover:underline"
          >
            Shiko faqen publike
          </Link>
        </div>

        <div className="mt-8 space-y-3">
          {q.topicOk === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm">
              Tema u krijua.
            </p>
          ) : null}
          {q.topicError === "1" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm">
              Titulli i temës mungon.
            </p>
          ) : null}
          {q.docOk === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm">
              Dokumenti u ngarkua.
            </p>
          ) : null}
          {q.docError === "topic" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm">
              Zgjidh një temë të vlefshme.
            </p>
          ) : null}
          {q.docError === "file" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm">
              Ngarko një skedar.
            </p>
          ) : null}
          {q.docError === "size" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm">
              Skedari është shumë i madh (maks. {maxMb} MB).
            </p>
          ) : null}
          {q.docError === "mime" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm">
              Lejohen vetëm PDF, TXT ose Word (.doc / .docx).
            </p>
          ) : null}
          {q.delTopicOk === "1" || q.delDocOk === "1" ? (
            <p className="rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm">
              U fshi.
            </p>
          ) : null}
          {q.delError === "1" ? (
            <p className="rounded-sm border border-[#E11D48]/40 bg-[#E11D48]/10 px-4 py-3 text-sm">
              Fshirja dështoi.
            </p>
          ) : null}
        </div>

        <section className="mt-10 border-t border-black/10 pt-10">
          <h2 className="text-lg font-bold tracking-tight">Tema e re</h2>
          <form action={createVargjetTopic} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <label htmlFor="new-topic-title" className="text-sm font-semibold uppercase tracking-wide">
                Titulli i temës
              </label>
              <input
                id="new-topic-title"
                name="title"
                type="text"
                required
                className={inputClass}
                placeholder="p.sh. Poezia e Rilindjes"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-sm bg-[#E11D48] px-5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Shto temën
            </button>
          </form>
        </section>

        <section className="mt-12 space-y-10">
          {topics.length === 0 ? (
            <p className="text-sm text-black/60">Nuk ka ende tema. Krijo një më sipër.</p>
          ) : null}

          {topics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-sm border border-black/12 bg-black/[0.02] p-5 md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{topic.title}</h3>
                  <p className="mt-1 text-xs text-black/50">
                    URL: /projekte/kultura/vargjet-e-lira/{topic.slug}
                  </p>
                </div>
                <form action={deleteVargjetTopic}>
                  <input type="hidden" name="topicId" value={topic.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold uppercase tracking-wide text-[#E11D48] underline-offset-2 hover:underline"
                  >
                    Fshi temën (dhe të gjithë dokumentet)
                  </button>
                </form>
              </div>

              <ul className="mt-4 space-y-2 border-t border-black/10 pt-4">
                {topic.documents.length === 0 ? (
                  <li className="text-sm text-black/55">Nuk ka dokumente ende.</li>
                ) : null}
                {topic.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-white px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-xs text-black/45">{doc.originalFileName}</span>
                    <form action={deleteVargjetDocument} className="ml-auto">
                      <input type="hidden" name="documentId" value={doc.id} />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-black/50 underline-offset-2 hover:text-[#E11D48] hover:underline"
                      >
                        Fshi
                      </button>
                    </form>
                  </li>
                ))}
              </ul>

              <form action={uploadVargjetDocument} encType="multipart/form-data" className="mt-5 space-y-3">
                <input type="hidden" name="topicId" value={topic.id} />
                <p className="text-sm font-semibold uppercase tracking-wide text-black/80">
                  Ngarko dokument
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/70" htmlFor={`title-${topic.id}`}>
                      Titulli në listë (opsional)
                    </label>
                    <input
                      id={`title-${topic.id}`}
                      name="title"
                      type="text"
                      className={inputClass}
                      placeholder="Nëse bosh, përdoret emri i skedarit"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-black/70" htmlFor={`file-${topic.id}`}>
                      Skedari
                    </label>
                    <input
                      id={`file-${topic.id}`}
                      name="file"
                      type="file"
                      required
                      accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="w-full text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-black/[0.06] file:px-3 file:py-2 file:text-sm file:font-medium"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-9 items-center justify-center rounded-sm bg-black px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-black/85"
                >
                  Ngarko
                </button>
              </form>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
