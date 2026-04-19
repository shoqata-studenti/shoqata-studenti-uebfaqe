import type { Dictionary } from "@/lib/i18n/get-dictionary";

import { KryesiaMemberPhoto } from "@/components/kryesia-member-photo";

/**
 * Pfade exakt wie in `public/kryesia/` (Dateinamen laut Repo).
 * Namen, Rollen, Studium fest (albanisch); Überschrift + Intro aus i18n (`heading`, `intro`).
 */
const KRYESIA_BOARD = [
  {
    name: "Bardh Jashari",
    role: "Kryetar",
    bio: "Master ETH arkitekturë",
    imageSrc: "/kryesia/Bardh-Jashari.png",
  },
  {
    name: "Anton Krasniqi",
    role: "Financa",
    bio: "Master ETH inxhinieri ndërtimi",
    imageSrc: "/kryesia/Anton-Krasniqi.png",
  },
  {
    name: "Altina Orani",
    role: "Media sociale",
    bio: "Bachelor ETH arkitekturë",
    imageSrc: "/kryesia/Altina-Orani.png",
  },
  {
    name: "Hana Syla",
    role: "Komunikim",
    bio: "Master ETH studime krahasuese dhe ndërkombëtare",
    imageSrc: "/kryesia/Hana-Syla.png",
  },
  {
    name: "Idlir Begalla",
    role: "Menaxhim eventesh",
    bio: "Bachelor ETH arkitekturë",
    imageSrc: "/kryesia/Idlir.png",
  },
  {
    name: "Zana Krasniqi",
    role: "Menaxhim eventesh",
    bio: "Master ETH shkenca inxhinieri mjedisore",
    imageSrc: "/kryesia/Zana-Krasniqi01.png",
  },
  {
    name: "Driton Hasanaj",
    role: "Marketing",
    bio: "Master ETH arkitekturë",
    imageSrc: "/kryesia/Driton.png",
  },
  {
    name: "Jon Stojkaj",
    role: "IT",
    bio: "Bachelor ETH shkenca kompjuterike",
    imageSrc: "/kryesia/Jon-Stojkaj.png",
  },
] as const;

const gridClass = "grid grid-cols-1 gap-5 md:grid-cols-4 md:grid-rows-2";

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
