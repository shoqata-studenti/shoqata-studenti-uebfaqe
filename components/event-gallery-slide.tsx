"use client";

import * as React from "react";

import { useDictionary } from "@/components/locale-provider";
import { VIDEO_MUTE_CONTROL_BUTTON_CLASSNAME } from "@/lib/video-mute-control";

/** Imazh standalone: karta = imazhi, pa sfond. Kufizo lartësinë që të rrijë brenda viewport-it. */
const MEDIA_WRAP = "mx-auto w-fit max-w-full overflow-hidden rounded-xl shadow-md";
const MEDIA_INNER = "block h-auto w-auto max-w-full max-h-[70vh]";

/** Karuseli: slot me proporcion 4:5, imazhi/video mbush plotësisht (object-cover). */
const VIDEO_CAROUSEL_WRAP =
  "relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-md";
const VIDEO_CAROUSEL_FILL = "absolute inset-0 w-full h-full object-cover";
const VIDEO_FILL = VIDEO_CAROUSEL_FILL;

/** Video standalone: karta = video, pa sfond. `w-fit` + `mx-auto` për simetri majtas/djathtas në zig-zag. */
const VIDEO_STANDALONE_WRAP =
  "relative mx-auto w-fit max-w-full overflow-hidden rounded-xl shadow-md";
const VIDEO_STANDALONE_INNER =
  "block h-auto w-auto max-w-full max-h-[65vh]";

type Props = {
  id: number;
  mimeType: string;
  /** Opsionale: URL statik nga /public; përndryshe media nga DB përmes `/api/event-gallery/[id]`. */
  src?: string | null;
  /** Brenda karuselit: ndalo kur slide-i nuk është aktiv. */
  isActive?: boolean;
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
  inCarousel = false,
}: Props) {
  const resolvedSrc = srcProp?.trim() ? srcProp.trim() : `/api/event-gallery/${_id}`;
  const dict = useDictionary();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoTitle = dict.evente?.momentsTitle ?? "Video";
  const unmuteLabel = dict.media?.videoUnmute ?? "Turn sound on";
  const muteLabel = dict.media?.videoMute ?? "Mute";
  const [isMuted, setIsMuted] = React.useState(true);

  React.useEffect(() => {
    if (!mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    el.defaultMuted = true;
    el.muted = true;
    setIsMuted(true);
  }, [mimeType]);

  React.useEffect(() => {
    if (!mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    if (inCarousel && !isActive) {
      el.pause();
      return;
    }
    void el.play().catch(() => {});
  }, [isActive, mimeType, inCarousel]);

  function toggleSound(e: React.MouseEvent) {
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
    const wrapClass = inCarousel ? VIDEO_CAROUSEL_WRAP : VIDEO_STANDALONE_WRAP;
    const videoClass = inCarousel ? VIDEO_CAROUSEL_FILL : VIDEO_STANDALONE_INNER;
    return (
      <div className={wrapClass}>
        <video
          ref={videoRef}
          src={resolvedSrc}
          className={videoClass}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          aria-label={videoTitle}
          onVolumeChange={() => {
            const v = videoRef.current;
            if (v) setIsMuted(v.muted);
          }}
        />
        <button
          type="button"
          onClick={toggleSound}
          className={VIDEO_MUTE_CONTROL_BUTTON_CLASSNAME}
          aria-label={isMuted ? unmuteLabel : muteLabel}
          aria-pressed={!isMuted}
        >
          {isMuted ? <IconMuted /> : <IconUnmuted />}
        </button>
      </div>
    );
  }

  const wrap = inCarousel
    ? "relative w-full max-w-md aspect-[4/5] overflow-hidden rounded-xl bg-black shadow-md"
    : MEDIA_WRAP;
  const imgClass = inCarousel ? VIDEO_FILL : MEDIA_INNER;

  return (
    <div className={wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolvedSrc} alt="" decoding="async" className={imgClass} />
    </div>
  );
}
