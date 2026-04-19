"use client";

import Image from "next/image";
import { useState } from "react";

const placeholderClass =
  "mx-auto mb-4 h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-black/15 to-black/5";

const photoClass =
  "mx-auto mb-4 h-24 w-24 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/10";

export function KryesiaMemberPhoto({
  src,
  alt,
}: {
  /** z. B. `/kryesia/name.jpg` — Datei liegt in `public/kryesia/`. Leer = Platzhalter. */
  src: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src.trim() || failed) {
    return <div className={placeholderClass} aria-hidden />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={96}
      height={96}
      className={photoClass}
      onError={() => setFailed(true)}
    />
  );
}
