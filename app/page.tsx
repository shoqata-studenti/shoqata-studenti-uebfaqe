export default function Home() {
  return (
    <main className="relative overflow-hidden bg-white text-black">
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#E11D48]/12 blur-3xl"
      />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-24 md:px-10 lg:px-16">
        <div className="max-w-3xl space-y-10">
          <p className="inline-flex rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 px-4 py-1.5 text-sm font-medium tracking-wide text-[#E11D48]">
            Shoqata Studenti
          </p>

          <div className="space-y-6">
            <h1 className="font-serif text-5xl leading-tight tracking-tight text-black md:text-7xl">
              Tradition trifft Zukunft.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-black/70 md:text-xl">
              Eine moderne Plattform fuer unseren Verein mit Fokus auf
              Geschichte, Mitgliedschaft und einfachem Status-Check.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/membership"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#E11D48] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#be123c]"
            >
              Mitglied werden
            </a>
            <a
              href="/history"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/15 px-6 text-sm font-semibold text-black transition-colors hover:border-black hover:bg-black/5"
            >
              Unsere Geschichte
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
