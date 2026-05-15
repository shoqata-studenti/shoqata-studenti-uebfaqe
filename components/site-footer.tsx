import type { Dictionary } from "@/lib/i18n/get-dictionary";

type FooterCopy = Dictionary["layout"]["footer"];

/** Statische `<img>`-URLs: umgeht `/_next/image`; `v=` bricht CDN/Browser-Cache nach Logo-Updates. */
const FOOTER_IMG_VER = "20260515f";

export function SiteFooter({ footer }: { footer: FooterCopy }) {
  return (
    <footer className="site-footer mt-auto border-t border-neutral-200 bg-[#f4f4f5] text-neutral-950">
      <div className="site-footer-inner">
        <div className="site-footer-brand w-full max-w-[280px] md:w-auto">
          <img
            src={`/footer/vseth.png?v=${FOOTER_IMG_VER}`}
            alt={footer.vsethLogoAlt}
            width={300}
            height={106}
            decoding="async"
            loading="lazy"
          />
          <p className="mt-3 max-w-sm text-xs leading-snug text-neutral-950 md:text-sm">{footer.approvedVseth}</p>
        </div>
        <div className="site-footer-brand w-full max-w-[160px] md:w-auto">
          <img
            src={`/footer/vsuzh.png?v=${FOOTER_IMG_VER}`}
            alt={footer.vsuzhLogoAlt}
            width={150}
            height={150}
            decoding="async"
            loading="lazy"
          />
          <p className="mt-3 max-w-sm text-xs leading-snug text-neutral-950 md:text-sm">{footer.approvedVsuzh}</p>
        </div>
      </div>
    </footer>
  );
}
