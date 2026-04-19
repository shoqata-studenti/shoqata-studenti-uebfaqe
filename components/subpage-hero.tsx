import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type SubpageHeroProps = {
  title: string;
  /** Standard: `main`. Für zusammengesetzte Seiten z. B. `div` innerhalb eines äußeren `main`. */
  as?: "main" | "div";
  /** `compact`: weniger vertikaler Raum, wenn direkt darunter viel Inhalt folgt (z. B. Kryesia). */
  variant?: "default" | "compact";
};

export function SubpageHero({
  title,
  as: Root = "main",
  variant = "default",
}: SubpageHeroProps) {
  const shell =
    variant === "compact"
      ? "min-h-0 bg-white text-black"
      : "min-h-[72vh] bg-white text-black";
  const sectionPad =
    variant === "compact"
      ? "mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16"
      : "mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-28";

  return (
    <Root className={shell}>
      <section className={sectionPad}>
        <div className="max-w-3xl border-l-4 border-[#E11D48] pl-6 md:pl-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E11D48]">
            Shoqata Studenti Zürich
          </p>
          <h1
            className={`${playfair.className} mt-4 text-3xl font-bold tracking-tight md:text-5xl`}
          >
            {title}
          </h1>
        </div>
      </section>
    </Root>
  );
}
