"use client";

import { useActionState, useState } from "react";

import { useDictionary } from "@/components/locale-provider";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { Button } from "@/components/ui/button";

import { checkMembershipStatus, type MembershipCheckState } from "./actions";

const initial: MembershipCheckState = { ok: true, message: "" };

export function MembershipStatusCheck({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const dict = useDictionary();
  const s = dict.membership.status;

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [state, formAction, pending] = useActionState(
    async (prev: MembershipCheckState, formData: FormData) => {
      const result = await checkMembershipStatus(prev, formData);
      // Jedes Token gilt nur einmal: nach jeder Antwort neu prüfen.
      setResetSignal((n) => n + 1);
      return result;
    },
    initial
  );

  return (
    <div className="mt-14 max-w-xl rounded-lg border border-border bg-muted/30 p-6">
      <h2 className="font-serif text-xl text-foreground">{s.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{s.hint}</p>
      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <label htmlFor="status-email" className="sr-only">
            {dict.membership.form.email}
          </label>
          <input
            id="status-email"
            name="email"
            type="email"
            required
            placeholder={s.emailPlaceholder}
            autoComplete="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <input type="hidden" name="cf-turnstile-response" value={turnstileToken ?? ""} />
        <Button type="submit" variant="outline" disabled={pending || !turnstileToken}>
          {pending ? s.checking : s.check}
        </Button>
      </form>
      <div className="mt-4">
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} resetSignal={resetSignal} />
      </div>
      {state.message ? (
        <p
          className={`mt-4 text-sm ${state.ok ? "text-foreground" : "text-destructive"}`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
