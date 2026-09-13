"use client";

import { useDictionary } from "@/components/locale-provider";

export function MembershipForm() {
  const dict = useDictionary();
  const f = dict.membership.form;

  return (
    <div
      role="alert"
      className="mt-8 max-w-xl rounded-md border-2 border-amber-600 bg-amber-50 p-5 text-base font-medium leading-relaxed text-amber-950 shadow-sm"
    >
      {f.paymentMaintenance}
    </div>
  );
}
