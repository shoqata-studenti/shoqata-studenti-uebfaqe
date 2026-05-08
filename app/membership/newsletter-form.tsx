"use client";

import { useActionState } from "react";

import { useDictionary } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";

import { subscribeNewsletter, type NewsletterSubscribeState } from "./actions";

const initial: NewsletterSubscribeState = { ok: true, message: "" };

export function NewsletterForm() {
  const dict = useDictionary();
  const n = dict.membership.newsletter;
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initial);

  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
      <h2 className="font-serif text-2xl text-foreground">{n.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{n.hint}</p>
      <form action={formAction} className="mt-5 space-y-4">
        <div className="space-y-2">
          <label htmlFor="newsletter-email" className="text-sm font-medium text-foreground">
            {dict.membership.form.email}
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={n.emailPlaceholder}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? n.pending : n.submit}
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
