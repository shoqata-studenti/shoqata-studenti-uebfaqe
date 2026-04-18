import { Playfair_Display } from "next/font/google";

import { HeroCarousel } from "@/components/hero-carousel";
import { LatestNews } from "@/components/latest-news";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

/** Lajmet lexohen nga DB në kërkesë, jo gjatë build-it statik. */
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="w-full bg-white text-black">
      <section className="w-full">
        <HeroCarousel headingFontClassName={`${playfair.className} font-semibold`} />
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <h2
          className={`${playfair.className} text-3xl font-bold tracking-tight text-black md:text-4xl`}
        >
          Rreth Shoqatës
        </h2>
      </section>

      <LatestNews headingClassName={playfair.className} />
    </main>
  );
}
