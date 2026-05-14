import type { Dictionary } from "@/lib/i18n/get-dictionary";

type FooterCopy = Dictionary["layout"]["footer"];

/** Statische `<img>`-URLs: umgeht `/_next/image`; `v=` bricht CDN/Browser-Cache nach Logo-Updates. */
const FOOTER_IMG_VER = "20260515d";

export function SiteFooter({ footer }: { footer: FooterCopy }) {
  return (
    <footer className="mt-auto border-t border-black/10 bg-zinc-100 text-black">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center gap-10 px-6 py-10 md:flex-row md:gap-20 md:px-10 md:py-12">
        <div className="flex w-full max-w-[280px] flex-col items-center gap-3 text-center">
          <img
            src={`/footer/vseth.png?v=${FOOTER_IMG_VER}`}
            alt={footer.vsethLogoAlt}
            width={300}
            height={106}
            className="mx-auto block h-auto w-auto max-w-full object-contain"
            decoding="async"
            loading="lazy"
          />
          <p className="max-w-sm text-xs leading-snug text-black/75 md:text-sm">{footer.approvedVseth}</p>
        </div>
        <div className="flex w-full max-w-[140px] flex-col items-center gap-3 text-center md:max-w-[160px]">
          <img
            src={`/footer/vsuzh.png?v=${FOOTER_IMG_VER}`}
            alt={footer.vsuzhLogoAlt}
            width={150}
            height={150}
            className="mx-auto block h-auto w-auto max-w-full object-contain"
            decoding="async"
            loading="lazy"
          />
          <p className="max-w-sm text-xs leading-snug text-black/75 md:text-sm">{footer.approvedVsuzh}</p>
        </div>
      </div>
    </footer>
  );
}
