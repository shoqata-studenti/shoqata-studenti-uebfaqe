"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import { checkMembershipStatus, type MembershipCheckState } from "./actions";

const initial: MembershipCheckState = { ok: true, message: "" };

export function MembershipStatusCheck() {
  const [state, formAction, pending] = useActionState(checkMembershipStatus, initial);

  return (
    <div className="mt-14 max-w-xl rounded-lg border border-border bg-muted/30 p-6">
      <h2 className="font-serif text-xl text-foreground">Status prüfen</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Gib deine E-Mail ein, um den Status deiner Mitgliedschaft zu sehen.
      </p>
      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <label htmlFor="status-email" className="sr-only">
            E-Mail
          </label>
          <input
            id="status-email"
            name="email"
            type="email"
            required
            placeholder="name@beispiel.de"
            autoComplete="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "…" : "Prüfen"}
        </Button>
      </form>
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
