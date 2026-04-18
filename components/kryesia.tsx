type BoardMember = {
  name: string;
  role: string;
  bio: string;
};

const BOARD_MEMBERS: BoardMember[] = [
  {
    name: "Arber Krasniqi",
    role: "Kryetar",
    bio: "Koordinon projektet strategjike dhe perfaqeson shoqaten ne aktivitetet zyrtare.",
  },
  {
    name: "Elira Berisha",
    role: "Nenkryetare",
    bio: "Mbeshtet organizimin e aktiviteteve dhe menaxhon bashkepunimet me partneret.",
  },
  {
    name: "Dren Gashi",
    role: "Sekretar",
    bio: "Mban procesverbalet, dokumentimin e vendimeve dhe komunikimin institucional.",
  },
  {
    name: "Nora Hoxha",
    role: "Arketare",
    bio: "Mbikqyr buxhetin, pagesat dhe raportimin financiar te shoqates.",
  },
  {
    name: "Liridon Kelmendi",
    role: "Koordinator Projektesh",
    bio: "Drejton planifikimin dhe zbatimin e projekteve studentore gjate vitit.",
  },
  {
    name: "Bora Ramadani",
    role: "PR & Media",
    bio: "Kujdeset per prezencen publike dhe komunikimin me studentet ne rrjetet sociale.",
  },
  {
    name: "Arjeta Sopa",
    role: "Koordinatore Eventesh",
    bio: "Organizon takime kulturore, sporte dhe evente sociale per komunitetin.",
  },
  {
    name: "Leon Dema",
    role: "Marredhenie me Studentet",
    bio: "Mbledh nevojat e anetareve dhe ndihmon ne orientimin akademik dhe social.",
  },
];

type KryesiaProps = {
  /** Wenn false, kein Seitentitel (z. B. wenn bereits ein Hero den Titel zeigt). */
  showHeading?: boolean;
};

export function Kryesia({ showHeading = true }: KryesiaProps) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
      {showHeading ? (
        <h2 className="text-3xl font-bold tracking-tight text-black md:text-4xl">Kryesia</h2>
      ) : null}
      <p
        className={`max-w-3xl text-black/70 ${showHeading ? "mt-3" : "mt-6"}`}
      >
        Ekipi i bordit qe udheheq aktivitetet, projektet dhe bashkepunimet e Shoqates.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
        {BOARD_MEMBERS.map((member) => (
          <article
            key={member.name}
            className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
          >
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-black/15 to-black/5" />
            <h3 className="text-center text-lg font-semibold text-black">{member.name}</h3>
            <p className="text-center text-sm font-medium text-black/70">{member.role}</p>
            <p className="mt-3 text-sm leading-6 text-black/75">{member.bio}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
