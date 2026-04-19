import type { Dictionary } from "@/lib/i18n/get-dictionary";

import { KryesiaMemberPhoto } from "@/components/kryesia-member-photo";

/**
 * Fotot: vendos skedarët në `public/kryesia/` dhe përditëso `imageSrc` më poshtë
 * (rruga fillon me `/`, p.sh. `/kryesia/emri.png`).
 */
type BoardMember = {
  name: string;
  imageSrc: string;
};

const BOARD_MEMBERS: BoardMember[] = [
  { name: "Bardh Jashari", imageSrc: "/kryesia/Bardh-Jashari.png" },
  { name: "Anton Krasniqi", imageSrc: "/kryesia/Anton-Krasniqi.png" },
  { name: "Altina Orani", imageSrc: "/kryesia/Altina-Orani.png" },
  { name: "Hana Syla", imageSrc: "/kryesia/Hana-Syla.png" },
  { name: "Idlir Begalla", imageSrc: "/kryesia/Ildir.png" },
  { name: "Zana Krasniqi", imageSrc: "/kryesia/Zana-Krasniqi01.png" },
  { name: "Driton Hasanaj", imageSrc: "/kryesia/Driton.png" },
  { name: "Jon Stojkaj", imageSrc: "/kryesia/Jon-Stojkaj.png" },
];

type KryesiaProps = {
  showHeading?: boolean;
  copy: Dictionary["kryesia"];
};

export function Kryesia({ showHeading = true, copy }: KryesiaProps) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
      {showHeading ? (
        <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">{copy.heading}</h2>
      ) : null}
      <p
        className={`max-w-3xl text-black/70 ${showHeading ? "mt-3" : "mt-6"}`}
      >
        {copy.intro}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        {BOARD_MEMBERS.map((member, index) => {
          const meta = copy.members[index];
          return (
            <article
              key={member.name}
              className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <KryesiaMemberPhoto src={member.imageSrc} alt={member.name} />
              <h3 className="text-center text-lg font-semibold text-black">{member.name}</h3>
              <p className="text-center text-sm font-medium text-black/70">{meta?.role ?? ""}</p>
              <p className="mt-3 text-sm leading-6 text-black/75">{meta?.bio ?? ""}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
