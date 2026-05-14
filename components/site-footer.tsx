import type { Dictionary } from "@/lib/i18n/get-dictionary";

type FooterCopy = Dictionary["layout"]["footer"];

/** Statische `<img>`-URLs: umgeht `/_next/image`; `v=` bricht CDN/Browser-Cache nach Logo-Updates. */
const FOOTER_IMG_VER = "20260515e";

export function SiteFooter({ footer }: { footer: FooterCopy }) {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-[#f4f4f5] text-neutral-950 [color-interpolation-filters:sRGB]">
      <div
        className={
          "mx-auto box-border flex w-full max-w-[1440px] flex-col items-center justify-center " +
          "gap-8 px-6 py-10 " +
          "md:flex-row md:items-start md:justify-center md:gap-[40px] md:px-10 md:py-12"
        }
      >
        <div className="box-border flex w-full max-w-[280px] flex-[0_1_auto] flex-col items-center gap-3 text-center max-md:max-w-full md:min-w-0 md:w-auto">
          <img
            src={`/footer/vseth.png?v=${FOOTER_IMG_VER}`}
            alt={footer.vsethLogoAlt}
            width={300}
            height={106}
            className="mx-auto block h-auto w-auto max-w-full shrink-0 object-contain [image-rendering:auto]"
            decoding="async"
            loading="lazy"
          />
          <p className="max-w-sm text-xs leading-snug text-neutral-950 md:text-sm">{footer.approvedVseth}</p>
        </div>
        <div className="box-border flex w-full max-w-[160px] flex-[0_1_auto] flex-col items-center gap-3 text-center max-md:max-w-full md:min-w-0 md:w-auto">
          <img
            src={`/footer/vsuzh.png?v=${FOOTER_IMG_VER}`}
            alt={footer.vsuzhLogoAlt}
            width={150}
            height={150}
            className="mx-auto block h-auto w-auto max-w-full shrink-0 object-contain [image-rendering:auto]"
            decoding="async"
            loading="lazy"
          />
          <p className="max-w-sm text-xs leading-snug text-neutral-950 md:text-sm">{footer.approvedVsuzh}</p>
        </div>
      </div>
    </footer>
  );
}
