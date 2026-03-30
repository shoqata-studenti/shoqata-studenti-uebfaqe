"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&q=80",
];

export function HeroCarousel({ headingFontClassName }: { headingFontClassName: string }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      className="w-full"
      opts={{ loop: true, align: "start" }}
      setApi={setApi}
    >
      <CarouselContent className="ml-0">
        {SLIDE_IMAGES.map((src, index) => (
          <CarouselItem key={src} className="pl-0">
            <div className="relative h-[min(85vh,760px)] w-full min-h-[420px] overflow-hidden md:min-h-[520px]">
              <Image
                src={src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/45" aria-hidden />

              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
                <h1
                  className={cn(
                    "max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl",
                    headingFontClassName
                  )}
                >
                  Zgjedhja me e mirë
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
                  Bëhu pjesë e Shoqata&apos;s Studenti për tu informuar me shumë rreth studimit ne
                  Zvicërr.
                </p>
                <Link
                  href="/membership"
                  className="mt-10 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#E11D48] px-8 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  REGJISTROHU
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious
        className="left-3 top-1/2 z-20 size-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/45 text-white shadow-sm hover:bg-black/55 md:left-6 md:size-11 [&_svg]:text-white"
        variant="outline"
      />
      <CarouselNext
        className="right-3 top-1/2 z-20 size-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/45 text-white shadow-sm hover:bg-black/55 md:right-6 md:size-11 [&_svg]:text-white"
        variant="outline"
      />

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDE_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 w-2 rounded-full bg-white/40 transition-[background,transform] hover:bg-white/70",
              i === current && "scale-110 bg-white"
            )}
            aria-label={`Shfaq slide ${i + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
}
