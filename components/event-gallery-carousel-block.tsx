"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  useCarousel,
} from "@/components/ui/carousel";

import { EventGallerySlide } from "@/components/event-gallery-slide";

type Item = { id: number; mimeType: string };

const navBtnBaseClass =
  "pointer-events-auto absolute top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white p-2 rounded-full flex items-center justify-center outline-none [&_svg]:pointer-events-none";

function GalleryCarouselNav({ side }: { side: "prev" | "next" }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const isPrev = side === "prev";
  const scroll = isPrev ? scrollPrev : scrollNext;
  const can = isPrev ? canScrollPrev : canScrollNext;

  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      disabled={!can}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        scroll();
      }}
      className={`${navBtnBaseClass} ${isPrev ? "left-4" : "right-4"}`}
    >
      {isPrev ? (
        <ChevronLeft className="size-5 shrink-0" strokeWidth={2} aria-hidden />
      ) : (
        <ChevronRight className="size-5 shrink-0" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}

export function EventGalleryCarouselBlock({ items }: { items: Item[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (items.length === 0) return null;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <Carousel
        className="relative w-full"
        opts={{ loop: false, align: "center" }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-0">
          {items.map((item, slideIndex) => (
            <CarouselItem key={item.id} className="basis-full pl-0">
              <EventGallerySlide
                id={item.id}
                mimeType={item.mimeType}
                isActive={items.length === 1 ? true : slideIndex === current}
                slideshowVideo={item.mimeType.startsWith("video/")}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 1 ? (
          <>
            <GalleryCarouselNav side="prev" />
            <GalleryCarouselNav side="next" />
          </>
        ) : null}
      </Carousel>
      {items.length > 1 ? (
        <div className="mt-2 flex justify-center gap-1.5" role="tablist" aria-label="Slideshow">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === current ? "bg-[#E11D48]" : "bg-black/25 hover:bg-black/40"}`}
              onClick={() => api?.scrollTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
