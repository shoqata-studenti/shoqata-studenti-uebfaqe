"use client";

import { useEffect, useRef, useState } from "react";

import { useDictionary } from "@/components/locale-provider";

type Props = {
  src: string;
  className: string;
  title: string;
  /** Kurousel: ndalo/riprodho sipas slide-it aktiv (pa ndryshuar logjikën Safari/muted). */
  paused?: boolean;
  /** Klasa e wrapper-it (p.sh. absolute inset-0 për kornizë aspect). */
  rootClassName?: string;
};

function IconMuted() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
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

/** Safari: inline `muted` is sometimes ignored — enforce via DOM on mount. Instagram-style mute toggle. */
export function PostCoverVideo({ src, className, title, paused, rootClassName }: Props) {
  const dict = useDictionary();
  const unmuteLabel = dict.media?.videoUnmute ?? "Turn sound on";
  const muteLabel = dict.media?.videoMute ?? "Mute";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
    }
  }, []);

  useEffect(() => {
    if (paused === undefined) return;
    const v = videoRef.current;
    if (!v) return;
    if (paused) {
      v.pause();
    } else {
      void v.play().catch(() => {});
    }
  }, [paused]);

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

  return (
    <div className={rootClassName ? rootClassName : "relative w-full"}>
      <video
        ref={videoRef}
        src={src}
        className={className}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        aria-label={title}
        onVolumeChange={() => {
          const v = videoRef.current;
          if (v) setIsMuted(v.muted);
        }}
      />
      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white shadow-sm ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={isMuted ? unmuteLabel : muteLabel}
        aria-pressed={!isMuted}
      >
        {isMuted ? <IconMuted /> : <IconUnmuted />}
      </button>
    </div>
  );
}
