"use client";

import Image from "next/image";
import Link from "next/link";

import { useDictionary } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

const HERO_IMAGE_SRC = "/ballina/hero.png";

export function HeroCarousel({ headingFontClassName }: { headingFontClassName: string }) {
  const dict = useDictionary();

  return (
    <div className="relative h-[min(85vh,760px)] w-full min-h-[420px] overflow-hidden md:min-h-[520px]">
      <Image
        src={HERO_IMAGE_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className={cn(
            "max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl",
            headingFontClassName,
          )}
        >
          {dict.home.hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
          {dict.home.hero.subtitle}
        </p>
        <Link
          href="/membership"
          className="mt-10 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#E11D48] px-8 py-2.5 text-sm font-bold uppercase tracking-[0.07em] text-white shadow-md ring-1 ring-black/15 transition-[background,box-shadow,transform] hover:bg-[#be123c] hover:shadow-lg hover:ring-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
        >
          {dict.nav.register}
        </Link>
      </div>
    </div>
  );
}
