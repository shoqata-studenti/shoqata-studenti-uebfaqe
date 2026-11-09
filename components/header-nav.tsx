"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";

import { useDictionary } from "@/components/locale-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const triggerBtn =
  "inline-flex h-9 items-center gap-[0.3em] rounded-sm border border-transparent bg-transparent px-[0.5em] whitespace-nowrap text-[1em] font-semibold uppercase tracking-[0.06em] text-black outline-none hover:border-black/15 hover:bg-black/[0.04] data-[popup-open]:border-black/20 data-[popup-open]:bg-black/[0.04]";

const menuContent =
  "min-w-[12rem] rounded-sm border border-black/10 bg-white p-1 shadow-lg ring-0";

const menuItem =
  "cursor-pointer rounded-sm px-3 py-2 text-sm font-medium normal-case tracking-normal text-black focus:bg-[#E11D48]/10 focus:text-black";

const navLinkClass =
  "inline-flex h-9 items-center rounded-sm border border-transparent px-[0.5em] whitespace-nowrap text-[1em] font-semibold uppercase tracking-[0.06em] text-black transition-colors hover:border-black/15 hover:bg-black/[0.04] hover:text-[#E11D48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]";

const registerClass =
  "inline-flex h-9 shrink-0 items-center rounded-sm bg-[#E11D48] px-[0.7em] whitespace-nowrap text-[1em] font-bold uppercase tracking-[0.07em] text-white shadow-md ring-1 ring-black/10 transition-[background,box-shadow,transform] hover:bg-[#be123c] hover:shadow-lg hover:ring-black/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48] active:scale-[0.98]";

/** Zeile der Desktop-Navigation; Abstände in em, damit alles mit der Schriftgrösse skaliert. */
const navRowClass = "flex min-h-9 flex-nowrap items-center gap-x-[0.35em]";

/** Schriftgrösse der Desktop-Navigation; passt sie bei der kleinsten nicht in eine Zeile, kommt das Hamburger-Menü. */
const MIN_NAV_FONT_PX = 10;
const MAX_NAV_FONT_PX = 14;

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={navLinkClass}>
      {children}
    </Link>
  );
}

function NavMenuLink({ href, label }: { href: string; label: string }) {
  return (
    <DropdownMenuItem
      nativeButton={false}
      className={menuItem}
      render={
        <Link
          href={href}
          className="flex w-full cursor-pointer items-center rounded-sm px-3 py-2 text-sm font-medium text-black outline-none hover:bg-[#E11D48]/8"
        />
      }
    >
      {label}
    </DropdownMenuItem>
  );
}

function MobileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10 py-4 first:pt-2">
      <p className="mb-2 px-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-black/50">{title}</p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function MobileNavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block w-full rounded-sm px-2 py-2.5 text-sm font-medium normal-case tracking-normal text-black transition-colors hover:bg-[#E11D48]/8 hover:text-[#E11D48]"
    >
      {label}
    </Link>
  );
}

type HeaderNavProps = {
  navFontClassName: string;
  /** Menüpunkt „Donacione“ nur zeigen, wenn DONATIONS_ENABLED=true. */
  showDonations?: boolean;
  /** Menüpunkt „Arkivi“: lokal (`next dev`) immer, sonst nur mit ARCHIVE_ENABLED=true. */
  showArchive?: boolean;
};

export function HeaderNav({ navFontClassName, showDonations = false, showArchive = false }: HeaderNavProps) {
  const d = useDictionary();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  /** `null` bis zur ersten Messung; danach: passt die Navigation in eine Zeile, und in welcher Schriftgrösse. */
  const [navLayout, setNavLayout] = useState<{ fits: boolean; fontPx: number } | null>(null);

  useEffect(() => {
    const slot = slotRef.current;
    const measure = measureRef.current;
    if (!slot || !measure) return;
    // ResizeObserver meldet sich direkt nach observe() einmal und danach bei jeder Grössenänderung
    // (Fenster, Sprache, eingeblendete Menüpunkte).
    const observer = new ResizeObserver(() => {
      const needed = measure.scrollWidth;
      const available = slot.clientWidth;
      if (!needed || !available) return;
      // 4 px Reserve, damit Rundungen nie zu einem Umbruch führen.
      const fontPx = Math.min(MAX_NAV_FONT_PX, (MIN_NAV_FONT_PX * (available - 4)) / needed);
      setNavLayout(fontPx >= MIN_NAV_FONT_PX ? { fits: true, fontPx } : { fits: false, fontPx: MIN_NAV_FONT_PX });
    });
    observer.observe(slot);
    observer.observe(measure);
    return () => observer.disconnect();
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen, closeMobile]);

  const aboutItems = [
    { href: "/rreth-nesh/info", label: d.nav.info },
    { href: "/rreth-nesh/kryesia", label: d.nav.kryesia },
    { href: "/rreth-nesh/historiku", label: d.nav.historiku },
    { href: "/rreth-nesh/statutet", label: d.nav.statutet },
    { href: "/rreth-nesh/struktura", label: d.nav.struktura },
  ];

  const eventItems = [
    { href: "/evente/kafe-llafe", label: d.nav.kafeLlafe },
    { href: "/evente/festa-e-flamurit", label: d.nav.festaEFlamurit },
    { href: "/evente/udhetime", label: d.nav.udhetime },
    { href: "/evente/ligjerata", label: d.nav.ligjerata },
    { href: "/evente/sofra", label: d.nav.sofra },
  ];

  const studyItems = [
    { href: "/studimet/pyetje-rreth-studimeve", label: d.nav.questionsAboutStudies },
    { href: "/studimet/studimet-ne-eth-zurich", label: d.nav.studiesAtEth },
    { href: "/studimet/studimet-ne-universitat-zurich", label: d.nav.studiesAtUzh },
    { href: "/studimet/aplikime-jasht-zvicres", label: d.nav.applicationsAbroad },
  ];

  const projectItems = [
    { href: "/projekte/kultura/vargjet-e-lira", label: d.nav.vargjetELira },
    { href: "/projekte/alumni", label: d.nav.alumni },
    { href: "/projekte/sporti", label: d.nav.sporti },
    { href: "/projekte/bashkpunimet", label: d.nav.bashkpunimet },
  ];

  const dropdownLabels = [d.nav.about, d.nav.events, d.nav.studies, d.nav.projects];
  const plainLabels = [
    d.nav.home,
    ...(showArchive ? [d.nav.archive] : []),
    d.nav.federata,
    d.nav.contact,
    ...(showDonations ? [d.nav.donations] : []),
  ];

  return (
    <div ref={slotRef} className="relative min-w-0 flex-1">
      {/*
        Unsichtbare Kopie der Menüpunkte in der kleinsten Schrift: daraus ergibt sich, wie breit die Navigation
        mindestens sein muss. Die sichtbare Schrift wird so gross gewählt, dass alles exakt in eine Zeile passt.
      */}
      <div
        ref={measureRef}
        aria-hidden
        className={cn(navFontClassName, navRowClass, "pointer-events-none invisible absolute left-0 top-0 w-max")}
        style={{ fontSize: MIN_NAV_FONT_PX }}
      >
        {plainLabels.map((label) => (
          <span key={label} className={navLinkClass}>
            {label}
          </span>
        ))}
        {dropdownLabels.map((label) => (
          <span key={label} className={triggerBtn}>
            {label}
            <ChevronDownIcon className="size-[1em]" />
          </span>
        ))}
        <span className={registerClass}>{d.nav.register}</span>
      </div>

      <nav
        className={cn(
          navFontClassName,
          "min-h-9 min-w-0",
          // Bis gemessen ist (erstes Rendern) entscheidet die Fensterbreite.
          navLayout === null ? "hidden xl:block" : navLayout.fits ? "block" : "hidden"
        )}
      >
        <div
          className={cn(navRowClass, "justify-between")}
          style={{ fontSize: navLayout?.fits ? navLayout.fontPx : 12 }}
        >
        <NavLink href="/">{d.nav.home}</NavLink>

        <DropdownMenu>
          <DropdownMenuTrigger className={triggerBtn}>
            {d.nav.about}
            <ChevronDownIcon className="size-[1em] opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={menuContent}>
            {aboutItems.map((item) => (
              <NavMenuLink key={item.href} href={item.href} label={item.label} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={triggerBtn}>
            {d.nav.events}
            <ChevronDownIcon className="size-[1em] opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={menuContent}>
            {eventItems.map((item) => (
              <NavMenuLink key={item.href} href={item.href} label={item.label} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={triggerBtn}>
            {d.nav.studies}
            <ChevronDownIcon className="size-[1em] opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn(menuContent, "min-w-[14rem]")}>
            {studyItems.map((item) => (
              <NavMenuLink key={item.href} href={item.href} label={item.label} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={triggerBtn}>
            {d.nav.projects}
            <ChevronDownIcon className="size-[1em] opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={menuContent}>
            {projectItems.map((item) => (
              <NavMenuLink key={item.href} href={item.href} label={item.label} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showArchive ? <NavLink href="/arkivi">{d.nav.archive}</NavLink> : null}
        <NavLink href="/federata">{d.nav.federata}</NavLink>
        <NavLink href="/kontakt">{d.nav.contact}</NavLink>
        {showDonations ? <NavLink href="/donacione">{d.nav.donations}</NavLink> : null}
        <Link href="/membership" className={registerClass}>
          {d.nav.register}
        </Link>
        </div>
      </nav>

      <div
        className={cn(
          "relative min-h-11 min-w-0 items-center justify-end",
          navLayout === null ? "flex xl:hidden" : navLayout.fits ? "hidden" : "flex"
        )}
      >
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="site-mobile-nav"
          aria-label={d.nav.openMainMenu}
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-black/15 bg-white text-black shadow-sm transition-colors hover:bg-black/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]"
        >
          {mobileOpen ? <XIcon className="size-6" aria-hidden /> : <MenuIcon className="size-6" aria-hidden />}
        </button>
      </div>

      {mobileOpen && !navLayout?.fits ? (
        <>
          <button
            type="button"
            aria-label={d.nav.closeMainMenu}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
            onClick={closeMobile}
          />
          <div
            id="site-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={d.nav.panelMenuTitle}
            className={cn(
              navFontClassName,
              "fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(22rem,calc(100vw-1rem))] flex-col border-l border-black/10 bg-white shadow-2xl"
            )}
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-black/60">{d.nav.panelMenuTitle}</span>
              <button
                type="button"
                aria-label={d.nav.closeMainMenu}
                onClick={closeMobile}
                className="inline-flex size-10 items-center justify-center rounded-sm text-black hover:bg-black/[0.06]"
              >
                <XIcon className="size-5" aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-6 pt-1">
              <MobileNavLink href="/" label={d.nav.home} onNavigate={closeMobile} />

              <MobileSection title={d.nav.about}>
                {aboutItems.map((item) => (
                  <MobileNavLink key={item.href} href={item.href} label={item.label} onNavigate={closeMobile} />
                ))}
              </MobileSection>

              <MobileSection title={d.nav.events}>
                {eventItems.map((item) => (
                  <MobileNavLink key={item.href} href={item.href} label={item.label} onNavigate={closeMobile} />
                ))}
              </MobileSection>

              <MobileSection title={d.nav.studies}>
                {studyItems.map((item) => (
                  <MobileNavLink key={item.href} href={item.href} label={item.label} onNavigate={closeMobile} />
                ))}
              </MobileSection>

              <MobileSection title={d.nav.projects}>
                {projectItems.map((item) => (
                  <MobileNavLink key={item.href} href={item.href} label={item.label} onNavigate={closeMobile} />
                ))}
              </MobileSection>

              <div className="border-b border-black/10 py-4">
                <div className="flex flex-col gap-0.5">
                  {showArchive ? (
                    <MobileNavLink href="/arkivi" label={d.nav.archive} onNavigate={closeMobile} />
                  ) : null}
                  <MobileNavLink href="/federata" label={d.nav.federata} onNavigate={closeMobile} />
                  <MobileNavLink href="/kontakt" label={d.nav.contact} onNavigate={closeMobile} />
                  {showDonations ? (
                    <MobileNavLink href="/donacione" label={d.nav.donations} onNavigate={closeMobile} />
                  ) : null}
                </div>
              </div>

              <div className="mt-6 px-1">
                <Link
                  href="/membership"
                  onClick={closeMobile}
                  className="flex w-full items-center justify-center rounded-sm bg-[#E11D48] py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-white shadow-md ring-1 ring-black/10 active:scale-[0.99]"
                >
                  {d.nav.register}
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
