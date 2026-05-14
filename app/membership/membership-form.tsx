"use client";

import { useState } from "react";

import { useDictionary } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";

type CheckoutBody = {
  name: string;
  email: string;
  university: string;
  studyField: string;
  type: string;
  confirmEarlyRenewal?: boolean;
};

export type MembershipFormProps = {
  defaultMembershipType?: "STUDENT" | "ALUMNI";
};

export function MembershipForm({ defaultMembershipType = "STUDENT" }: MembershipFormProps) {
  const dict = useDictionary();
  const f = dict.membership.form;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [renewalMessage, setRenewalMessage] = useState<string | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState<CheckoutBody | null>(null);

  const runCheckout = async (payload: CheckoutBody) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const resData = (await res.json()) as {
      url?: string;
      error?: string;
      code?: string;
      message?: string;
    };

    if (resData.url) {
      window.location.href = resData.url;
      return;
    }

    if (res.status === 409 && resData.code === "CONFIRM_RENEWAL_REQUIRED" && resData.message) {
      setRenewalMessage(resData.message);
      setPendingCheckout(payload);
      setRenewalOpen(true);
      setPending(false);
      return;
    }

    if (res.status === 403 && resData.code === "RENEW_TOO_EARLY" && resData.message) {
      setError(resData.message);
      setPending(false);
      return;
    }

    setError(resData.error || f.errorPayment);
    setPending(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setRenewalOpen(false);
    setRenewalMessage(null);
    setPendingCheckout(null);

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const name = `${firstName} ${lastName}`.trim();
    const payload: CheckoutBody = {
      name,
      email: String(formData.get("email") ?? "").trim(),
      university: String(formData.get("uni") ?? "").trim(),
      studyField: String(formData.get("studium") ?? "").trim(),
      type: String(formData.get("type") ?? ""),
    };

    try {
      await runCheckout(payload);
    } catch (err) {
      console.error(err);
      setError(f.errorNetwork);
      setPending(false);
    }
  };

  const confirmRenewal = async () => {
    if (!pendingCheckout) return;
    setRenewalOpen(false);
    setPending(true);
    setError(null);
    try {
      await runCheckout({ ...pendingCheckout, confirmEarlyRenewal: true });
    } catch (err) {
      console.error(err);
      setError(f.errorNetwork);
      setPending(false);
    } finally {
      setPendingCheckout(null);
      setRenewalMessage(null);
    }
  };

  const cancelRenewal = () => {
    setRenewalOpen(false);
    setPendingCheckout(null);
    setRenewalMessage(null);
    setPending(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="m-first" className="text-sm font-medium text-foreground">
              {f.firstName}
            </label>
            <input
              id="m-first"
              name="firstName"
              required
              autoComplete="given-name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="m-last" className="text-sm font-medium text-foreground">
              {f.lastName}
            </label>
            <input
              id="m-last"
              name="lastName"
              required
              autoComplete="family-name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="m-email" className="text-sm font-medium text-foreground">
            {f.email}
          </label>
          <input
            id="m-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="m-uni" className="text-sm font-medium text-foreground">
            {f.uni}
          </label>
          <input
            id="m-uni"
            name="uni"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="m-studium" className="text-sm font-medium text-foreground">
            {f.studium}
          </label>
          <input
            id="m-studium"
            name="studium"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">{f.typeLegend}</legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value="STUDENT"
                required
                defaultChecked={defaultMembershipType === "STUDENT"}
              />
              {f.student}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value="ALUMNI"
                required
                defaultChecked={defaultMembershipType === "ALUMNI"}
              />
              {f.alumni}
            </label>
          </div>
        </fieldset>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? f.pending : f.submit}
        </Button>
      </form>

      {renewalOpen && renewalMessage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) cancelRenewal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="renewal-dialog-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border-2 border-amber-600 bg-amber-50 p-6 text-amber-950 shadow-lg dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-50"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="renewal-dialog-title" className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              {f.renewalDialogTitle}
            </h2>
            <p className="mt-4 text-sm text-amber-950/90 dark:text-amber-50/90 whitespace-pre-wrap">{renewalMessage}</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <Button type="button" variant="outline" onClick={cancelRenewal} disabled={pending}>
                {f.renewalCancel}
              </Button>
              <Button type="button" onClick={() => void confirmRenewal()} disabled={pending}>
                {pending ? f.pending : f.renewalContinue}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
