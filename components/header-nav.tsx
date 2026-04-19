"use client";

import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import { useDictionary } from "@/components/locale-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const triggerBtn =
  "inline-flex h-9 items-center gap-1 rounded-sm border border-transparent bg-transparent px-2 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-black outline-none hover:border-black/15 hover:bg-black/[0.04] data-[popup-open]:border-black/20 data-[popup-open]:bg-black/[0.04] md:text-xs lg:text-sm";

const menuContent =
  "min-w-[12rem] rounded-sm border border-black/10 bg-white p-1 shadow-lg ring-0";

const menuItem =
  "cursor-pointer rounded-sm px-3 py-2 text-sm font-medium normal-case tracking-normal text-black focus:bg-[#E11D48]/10 focus:text-black";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center rounded-sm border border-transparent px-2 text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-black transition-colors hover:border-black/15 hover:bg-black/[0.04] hover:text-[#E11D48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48] md:text-xs lg:text-sm"
    >
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

type HeaderNavProps = {
  navFontClassName: string;
};

export function HeaderNav({ navFontClassName }: HeaderNavProps) {
  const d = useDictionary();

  return (
    <nav
      className={cn(
        navFontClassName,
        "flex min-w-0 max-w-[calc(100%-5rem)] flex-wrap items-center justify-end gap-x-2 gap-y-2 md:max-w-none md:gap-x-3"
      )}
    >
      <NavLink href="/">{d.nav.home}</NavLink>

      <DropdownMenu>
        <DropdownMenuTrigger className={triggerBtn}>
          {d.nav.about}
          <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={menuContent}>
          <NavMenuLink href="/rreth-nesh/info" label={d.nav.info} />
          <NavMenuLink href="/rreth-nesh/kryesia" label={d.nav.kryesia} />
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className={triggerBtn}>
          {d.nav.studies}
          <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cn(menuContent, "min-w-[14rem]")}>
          <NavMenuLink href="/studimet/aplikime-jasht-zvicres" label={d.nav.applicationsAbroad} />
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className={triggerBtn}>
          {d.nav.events}
          <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={menuContent}>
          {["2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((y) => (
            <NavMenuLink key={y} href={`/evente/${y}`} label={y} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger className={triggerBtn}>
          {d.nav.projects}
          <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={menuContent}>
          <NavMenuLink href="/projekte/sport" label={d.nav.sport} />
          <NavMenuLink href="/projekte/kultura" label={d.nav.kultura} />
          <NavMenuLink href="/projekte/shoqerore" label={d.nav.shoqerore} />
          <NavMenuLink href="/projekte/ligjerata" label={d.nav.ligjerata} />
          <NavMenuLink href="/projekte/te-tjera" label={d.nav.teTjera} />
        </DropdownMenuContent>
      </DropdownMenu>

      <NavLink href="/federata">{d.nav.federata}</NavLink>
      <NavLink href="/kontakt">{d.nav.contact}</NavLink>
      <NavLink href="/membership">{d.nav.register}</NavLink>
    </nav>
  );
}
