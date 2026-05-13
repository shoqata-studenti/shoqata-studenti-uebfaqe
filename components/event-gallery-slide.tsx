"use client";

import * as React from "react";

import { useDictionary } from "@/components/locale-provider";

const MEDIA_WRAP =
  "relative w-full max-w-2xl mx-auto overflow-hidden rounded-xl bg-black shadow-md mt-6";

const MEDIA_INNER = "w-full h-auto max-h-[75vh] object-contain";

/** Vetëm brenda karuselit — 4:5 si Instagram. */
const CAROUSEL_WRAP =
  "relative w-full max-w-md mx-auto aspect-[4/5] overflow-hidden rounded-xl bg-black shadow-md mt-6";

const CAROUSEL_FILL = "absolute inset-0 w-full h-full object-cover";

type Props = {
  id: number;
  mimeType: string;
  /** Opsionale: URL statik nga /public; përndryshe media nga DB përmes `/api/event-gallery/[id]`. */
  src?: string | null;
  isActive?: boolean;
  slideshowVideo?: boolean;
  /** Slideshow / karusel: kuti 4:5 + object-cover; jashtë saj mbeten klasat e mëparshme. */
  inCarousel?: boolean;
};

function IconMuted() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-white">
      <path
        d="M11 5L6 9H4v6h2l5 4V5zM19 9l-4 4m0-4l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUnmuted() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-white">
      <path
        d="M11 5L6 9H4v6h2l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a9 9 0 010 14.14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Imazh ose video nga `/api/event-gallery/[id]` ose `src` statik. */
export function EventGallerySlide({
  id: _id,
  mimeType,
  src: srcProp,
  isActive = true,
  slideshowVideo = false,
  inCarousel = false,
}: Props) {
  const resolvedSrc = srcProp?.trim() ? srcProp.trim() : `/api/event-gallery/${_id}`;
  const dict = useDictionary();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoTitle = dict.evente?.momentsTitle ?? "Video";
  const unmuteLabel = dict.media?.videoUnmute ?? "Turn sound on";
  const muteLabel = dict.media?.videoMute ?? "Mute";
  const [isMuted, setIsMuted] = React.useState(true);

  const wrap = inCarousel ? CAROUSEL_WRAP : MEDIA_WRAP;
  const mediaClass = inCarousel ? CAROUSEL_FILL : MEDIA_INNER;

  React.useEffect(() => {
    if (!mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    el.defaultMuted = true;
    if (!slideshowVideo) {
      el.muted = true;
    }
  }, [mimeType, slideshowVideo]);

  React.useEffect(() => {
    if (slideshowVideo || !mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    if (isActive) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive, mimeType, slideshowVideo]);

  React.useEffect(() => {
    if (!slideshowVideo || !mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    el.defaultMuted = true;
    el.muted = true;
    setIsMuted(true);
  }, [slideshowVideo, mimeType]);

  React.useEffect(() => {
    if (!slideshowVideo || !mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    if (isActive) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive, mimeType, slideshowVideo]);

  function toggleSlideshowSound(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setIsMuted(next);
    if (!next) {
      void v.play().catch(() => {});
    }
  }

  if (mimeType.startsWith("video/")) {
    if (slideshowVideo) {
      return (
        <div className={wrap}>
          <video
            ref={videoRef}
            src={resolvedSrc}
            className={mediaClass}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            aria-label={videoTitle}
            {...({ defaultMuted: true } as Record<string, unknown>)}
            onVolumeChange={() => {
              const v = videoRef.current;
              if (v) setIsMuted(v.muted);
            }}
          />
          <button
            type="button"
            onClick={toggleSlideshowSound}
            className="absolute bottom-4 right-4 z-50"
            aria-label={isMuted ? unmuteLabel : muteLabel}
            aria-pressed={!isMuted}
          >
            {isMuted ? <IconMuted /> : <IconUnmuted />}
          </button>
        </div>
      );
    }
    return (
      <div className={wrap}>
        <video
          ref={videoRef}
          src={resolvedSrc}
          className={mediaClass}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls
          aria-label={videoTitle}
          {...({ defaultMuted: true } as Record<string, unknown>)}
        />
      </div>
    );
  }

  return (
    <div className={wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolvedSrc} alt="" decoding="async" className={mediaClass} />
    </div>
  );
}
