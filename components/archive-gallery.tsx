"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, XIcon } from "lucide-react";

import { useDictionary } from "@/components/locale-provider";
import { interpolate } from "@/lib/i18n/interpolate";
import { cn } from "@/lib/utils";

export type ArchiveGalleryPhoto = {
  full: string;
  thumb: string;
  /** Miniaturë katrore për shiritin poshtë pamjes së madhe. */
  mini: string;
  /** Lidhje që e shkarkon foton si skedar (edhe nga një domen tjetër, p.sh. Cloudinary). */
  download: string;
  width: number;
  height: number;
};

type Props = {
  photos: ArchiveGalleryPhoto[];
  eventTitle: string;
};

const roundBtn =
  "inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Rrjetë me rreshta të barazuar (si te Google Photos): çdo foto ruan proporcionin e vet,
 * pa prerje. Klikimi hap pamjen e madhe ku mund të rrëshqitet me gisht, shigjeta ose tastierë.
 */
export function ArchiveGallery({ photos, eventTitle }: Props) {
  const d = useDictionary().archive;
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const lastTrigger = React.useRef<HTMLElement | null>(null);

  const close = React.useCallback(() => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  }, []);

  return (
    <>
      <ul className="mt-10 flex flex-wrap gap-1.5 [--row-h:110px] sm:gap-2 sm:[--row-h:220px] lg:[--row-h:290px]">
        {photos.map((photo, index) => {
          const ratio = photo.width / photo.height;
          return (
            <li
              key={photo.full}
              className="relative overflow-hidden rounded-md bg-black/5"
              style={{
                flexGrow: ratio,
                flexBasis: `calc(var(--row-h) * ${ratio.toFixed(4)})`,
                aspectRatio: `${photo.width} / ${photo.height}`,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpenIndex(index);
                }}
                aria-label={interpolate(d.openPhoto, { n: String(index + 1), total: String(photos.length) })}
                className="group absolute inset-0 block h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#E11D48]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.thumb}
                  alt={`${eventTitle} – ${index + 1}`}
                  width={photo.width}
                  height={photo.height}
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover transition-[transform,filter] duration-300 group-hover:scale-[1.03] group-hover:brightness-90"
                />
              </button>
            </li>
          );
        })}
        {/* Mban rreshtin e fundit në lartësinë normale në vend që ta shtrijë në gjithë gjerësinë. */}
        <li aria-hidden className="h-0 grow-[1000] basis-0" />
      </ul>

      {openIndex !== null ? (
        <ArchiveLightbox photos={photos} eventTitle={eventTitle} startIndex={openIndex} onClose={close} />
      ) : null}
    </>
  );
}

function ArchiveLightbox({
  photos,
  eventTitle,
  startIndex,
  onClose,
}: Props & { startIndex: number; onClose: () => void }) {
  const d = useDictionary().archive;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: photos.length > 1, startIndex, duration: 22 });
  const [selected, setSelected] = React.useState(startIndex);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const stripRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  React.useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      else if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi, onClose]);

  /** Mban miniaturën aktive në mes të shiritit poshtë. */
  React.useEffect(() => {
    const strip = stripRef.current;
    const active = strip?.children[selected] as HTMLElement | undefined;
    if (!strip || !active) return;
    strip.scrollTo({
      left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [selected]);

  const total = photos.length;
  /** Ngarko vetëm foton aktive dhe fqinjët e saj (edhe përtej skajeve, për rrëshqitje pa fund). */
  const isNear = (index: number) => {
    const diff = Math.abs(index - selected);
    return Math.min(diff, total - diff) <= 1;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={eventTitle}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-3 py-2 sm:px-5 sm:py-3">
        <p className="min-w-0 truncate text-sm font-medium text-white/85" aria-live="polite">
          <span className="tabular-nums">
            {selected + 1} / {total}
          </span>
          <span className="ml-3 hidden text-white/55 sm:inline">{eventTitle}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={photos[selected].download}
            download
            aria-label={d.download}
            title={d.download}
            className={roundBtn}
          >
            <DownloadIcon className="size-5" aria-hidden />
          </a>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={d.close} title={d.close} className={roundBtn}>
            <XIcon className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {photos.map((photo, index) => (
              <div
                key={photo.full}
                className="flex h-full min-w-0 shrink-0 grow-0 basis-full items-center justify-center px-2 sm:px-16"
                onClick={(e) => {
                  if (e.target === e.currentTarget) onClose();
                }}
              >
                {isNear(index) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.full}
                    alt={`${eventTitle} – ${index + 1}`}
                    width={photo.width}
                    height={photo.height}
                    decoding="async"
                    draggable={false}
                    className="max-h-full max-w-full select-none rounded-sm object-contain"
                    style={{ width: "auto", height: "auto", backgroundImage: `url(${photo.thumb})`, backgroundSize: "cover" }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={d.previous}
              className={cn(roundBtn, "absolute left-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
            >
              <ChevronLeftIcon className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={d.next}
              className={cn(roundBtn, "absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex")}
            >
              <ChevronRightIcon className="size-6" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div
          ref={stripRef}
          className="relative flex shrink-0 gap-1.5 overflow-x-auto px-3 py-3 [scrollbar-width:none] sm:px-5 [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.full}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={interpolate(d.openPhoto, { n: String(index + 1), total: String(total) })}
              aria-current={index === selected ? "true" : undefined}
              className={cn(
                "h-14 w-14 shrink-0 overflow-hidden rounded-sm transition-opacity first:ml-auto last:mr-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:h-16 sm:w-16",
                index === selected ? "opacity-100 ring-2 ring-white" : "opacity-45 hover:opacity-80"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.mini} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
