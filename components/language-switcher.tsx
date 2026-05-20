"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

import { useDictionary, useLocale } from "@/components/locale-provider";
import { setLocale } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/config";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const triggerBtn =
  "inline-flex h-9 shrink-0 items-center gap-1 rounded-sm border border-black/15 bg-white px-2.5 text-xs font-semibold uppercase tracking-wide text-black outline-none hover:bg-black/[0.04] data-[popup-open]:border-black/25 data-[popup-open]:bg-black/[0.04]";

const menuContent =
  "border border-black/10 bg-white shadow-lg ring-0";

const menuItem =
  "cursor-pointer rounded-sm px-4 py-2.5 text-left text-sm font-medium text-black whitespace-nowrap focus:bg-[#E11D48]/10 focus:text-black";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();
  const [pending, startTransition] = useTransition();

  const label =
    locale === "sq" ? dict.language.shortSq : locale === "de" ? dict.language.shortDe : dict.language.shortEn;

  const pick = (next: Locale) => {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerBtn} aria-label={dict.language.menuAria}>
        {label}
        <ChevronDownIcon className="size-3.5 opacity-70" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sizeToContent className={menuContent}>
        <DropdownMenuItem className={menuItem} onClick={() => pick("sq")}>
          {dict.language.sq}
        </DropdownMenuItem>
        <DropdownMenuItem className={menuItem} onClick={() => pick("de")}>
          {dict.language.de}
        </DropdownMenuItem>
        <DropdownMenuItem className={menuItem} onClick={() => pick("en")}>
          {dict.language.en}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
