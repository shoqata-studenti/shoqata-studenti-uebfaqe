"use client";

import * as React from "react";

import { useDictionary } from "@/components/locale-provider";
import { PostCoverVideo } from "@/components/post-cover-video";

/** Wrapper për slide (si kërkesa — bg-black derisa media të ngarkohet). */
const slideWrapperClass =
  "relative w-full aspect-[4/5] bg-black overflow-hidden flex items-center justify-center";

/** Vetëm këto klasa në <video> / <img> (pa h-auto, w-auto, relative). */
const slideMediaClass = "absolute inset-0 w-full h-full object-cover";

type Props = {
  id: number;
  mimeType: string;
  className?: string;
  isActive?: boolean;
  slideshowVideo?: boolean;
};

/** Imazh ose video nga /api/event-gallery/[id]. */
export function EventGallerySlide({
  id,
  mimeType,
  className,
  isActive = true,
  slideshowVideo = false,
}: Props) {
  const src = `/api/event-gallery/${id}`;
  const dict = useDictionary();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoTitle = dict.evente?.momentsTitle ?? "Video";

  const mediaClass = className ? `${slideMediaClass} ${className}`.trim() : slideMediaClass;

  React.useEffect(() => {
    if (slideshowVideo || !mimeType.startsWith("video/")) return;
    const el = videoRef.current;
    if (!el) return;
    el.defaultMuted = true;
    el.muted = true;
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

  if (mimeType.startsWith("video/")) {
    if (slideshowVideo) {
      return (
        <div className={slideWrapperClass}>
          <PostCoverVideo
            src={src}
            className={mediaClass}
            title={videoTitle}
            paused={!isActive}
            rootClassName="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }
    return (
      <div className={slideWrapperClass}>
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          playsInline
          loop
          controls
          preload="metadata"
          className={mediaClass}
        />
      </div>
    );
  }
  return (
    <div className={slideWrapperClass}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" decoding="async" className={mediaClass} />
    </div>
  );
}
