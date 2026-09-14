import type { Dictionary } from "@/lib/i18n/get-dictionary";

import { KryesiaMemberPhoto } from "@/components/kryesia-member-photo";

/**
 * Pfade exakt wie in `public/kryesia/` (Dateinamen laut Repo).
 * Namen, Rollen, Studium fest (albanisch); Überschrift + Intro aus i18n (`heading`, `intro`).
 */
const KRYESIA_BOARD = [
  {
    name: "Puhiza Selimi",
    role: "Kryetare",
    bio: "Master UZH Juridik",
    imageSrc: "/kryesia/Foto-Puhiza.png",
  },
  {
    name: "Idlir Begalla",
    role: "Koordinim",
    bio: "Bachelor ETH Arkitekturë",
    imageSrc: "/kryesia/Foto-Idliri.png",
  },
  {
    name: "Altina Orani",
    role: "Public Relations",
    bio: "Bachelor ETH Arkitekturë",
    imageSrc: "/kryesia/altina-foto.png",
  },
  {
    name: "Bletarta Sefedini",
    role: "Community Manager",
    bio: "Master ETH Farmaci",
    imageSrc: "/kryesia/bleta-foto.png",
  },
  {
    name: "Jon Stojkaj",
    role: "Financa/IT",
    bio: "Bachelor ETH Shkenca Kompjuterike",
    imageSrc: "/kryesia/Foto-Jon.png",
  },
  {
    name: "Anisa Kadriu",
    role: "Organizim",
    bio: "Bachelor UZH Juridik",
    imageSrc: "/kryesia/Foto-Anisa.png",
  },
 
] as const;

const gridClass = "grid grid-cols-1 sm:grid-cols-3 gap-5";

const cardClass =
  "mx-auto flex h-full w-full max-w-[280px] flex-col overflow-hidden rounded-xl border border-border shadow-sm md:max-w-none";

const textBlockClass = "flex flex-1 flex-col items-center p-3 text-center";

type KryesiaProps = {
  showHeading?: boolean;
  copy: Dictionary["kryesia"];
};

export function Kryesia({ showHeading = true, copy }: KryesiaProps) {
  const hasIntro = copy.intro.trim().length > 0;

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-6">
      {showHeading ? (
        <header className="mb-5">
          {/* i18n: messages.*.kryesia.heading (Abschnittstitel) */}
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {copy.heading}
          </h2>
          {hasIntro ? (
            <p className="mt-2 max-w-2xl text-pretty text-xs leading-relaxed text-muted-foreground md:text-sm">
              {copy.intro}
            </p>
          ) : null}
        </header>
      ) : hasIntro ? (
        <p className="mb-5 max-w-2xl text-pretty text-xs leading-relaxed text-muted-foreground md:text-sm">
          {copy.intro}
        </p>
      ) : null}

      <div className={gridClass}>
        {KRYESIA_BOARD.map((member) => (
          <article key={member.name} className={cardClass}>
            <KryesiaMemberPhoto src={member.imageSrc} alt={member.name} />

            <div className={textBlockClass}>
              <h3 className="text-sm font-bold text-foreground">{member.name}</h3>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{member.role}</p>
              <p className="mt-1 text-[11px] leading-tight text-muted-foreground/90">{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
