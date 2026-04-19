"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

const errorShell =
  "relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-muted/40 [aspect-ratio:4/5]";

const imageClass = "h-full w-full object-cover object-top";

/** Einheitlicher Rahmen 4:5, `w-full` + `object-cover object-top` (wie spezifiziert). */
export function KryesiaMemberPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src.trim() || failed) {
    return (
      <div className={errorShell} aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-muted/30",
        "[aspect-ratio:4/5]",
      )}
      style={{ aspectRatio: "4 / 5" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className={imageClass}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
