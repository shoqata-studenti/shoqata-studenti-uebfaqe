"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";

import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { createQrBill, startDonationCheckout } from "./actions";
import { DONATION_MESSAGE_MAX_LENGTH, initialDonationCheckoutState, initialQrBillState } from "./form-state";

type DonacioneDictionary = Dictionary["donacione"];

const fieldClass =
  "w-full rounded-sm border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition-[border-color,box-shadow] placeholder:text-black/40 focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20";

const labelClass = "text-xs font-semibold uppercase tracking-wide text-black/80";

const submitClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-[#E11D48] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#E11D48]";

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-sm border border-[#E11D48]/35 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
      {children}
    </p>
  );
}

function AmountField({ id, dict }: { id: string; dict: DonacioneDictionary }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {dict.labelAmount}
      </label>
      <input
        id={id}
        name="amount"
        type="text"
        inputMode="decimal"
        required
        className={fieldClass}
        placeholder={dict.placeholderAmount}
      />
    </div>
  );
}

export function StripeDonationForm({
  dict,
  turnstileSiteKey,
}: {
  dict: DonacioneDictionary;
  turnstileSiteKey?: string;
}) {
  const [state, formAction, isSubmitting] = useActionState(startDonationCheckout, initialDonationCheckoutState);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey || !scriptReady || !window.turnstile || !turnstileContainerRef.current) {
      return;
    }
    if (turnstileWidgetIdRef.current) return;

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(null),
      "error-callback": () => setTurnstileToken(null),
      theme: "light",
      size: "normal",
    });
  }, [scriptReady, turnstileSiteKey]);

  useEffect(() => {
    if (state.status !== "error" || !window.turnstile || !turnstileWidgetIdRef.current) return;
    window.turnstile.reset(turnstileWidgetIdRef.current);
    setTurnstileToken(null);
  }, [state]);

  const errorMessage =
    state.error === "fields"
      ? dict.errorFields
      : state.error === "amount"
        ? dict.errorAmountStripe
        : state.error === "turnstile"
          ? dict.errorTurnstile
          : state.error === "config"
            ? dict.errorConfig
            : dict.errorStripe;

  return (
    <>
      {state.status === "error" ? <ErrorNote>{errorMessage}</ErrorNote> : null}

      <form action={formAction} className="mt-6 space-y-6">
        {/* Honeypot — versteckt für echte Nutzer, Bots füllen es aus */}
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
        />
        <AmountField id="stripe-amount" dict={dict} />
        <div className="space-y-2">
          <label htmlFor="donor-name" className={labelClass}>
            {dict.labelName}
          </label>
          <input
            id="donor-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder={dict.placeholderName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="donor-email" className={labelClass}>
            {dict.labelEmail}
          </label>
          <input
            id="donor-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder={dict.placeholderEmail}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="donor-message" className={labelClass}>
            {dict.labelMessage}
          </label>
          <textarea
            id="donor-message"
            name="message"
            rows={4}
            maxLength={DONATION_MESSAGE_MAX_LENGTH}
            className={`${fieldClass} resize-y`}
            placeholder={dict.placeholderMessage}
          />
        </div>

        <input type="hidden" name="cf-turnstile-response" value={turnstileToken ?? ""} />
        {turnstileSiteKey ? <div ref={turnstileContainerRef} /> : null}

        <button type="submit" disabled={!turnstileToken || isSubmitting} className={submitClass}>
          {dict.submitStripe}
        </button>
        <p className="text-xs leading-relaxed text-black/55">{dict.stripeHint}</p>
      </form>

      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
      ) : null}
    </>
  );
}

export function QrBillDonationForm({
  dict,
  qrNoteMaxLength,
}: {
  dict: DonacioneDictionary;
  qrNoteMaxLength: number;
}) {
  const [state, formAction, isSubmitting] = useActionState(createQrBill, initialQrBillState);

  const errorMessage =
    state.error === "amount" ? dict.errorAmountQr : state.error === "config" ? dict.errorConfig : dict.errorQr;

  return (
    <>
      {state.status === "error" ? <ErrorNote>{errorMessage}</ErrorNote> : null}

      <form action={formAction} className="mt-6 space-y-6">
        <AmountField id="qr-amount" dict={dict} />
        <div className="space-y-2">
          <label htmlFor="qr-message" className={labelClass}>
            {dict.labelMessage}
          </label>
          <input
            id="qr-message"
            name="message"
            type="text"
            maxLength={qrNoteMaxLength}
            className={fieldClass}
            placeholder={dict.placeholderMessage}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className={submitClass}>
          {dict.submitQr}
        </button>
      </form>

      {state.status === "success" && state.qrCodeSvg && state.amount !== undefined ? (
        <div className="mt-8 rounded-sm border border-black/10 bg-black/[0.02] p-6">
          <p className="text-sm leading-relaxed text-black/70">{dict.qrReady}</p>
          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* SVG kommt von swissqrbill auf dem Server, nicht aus Nutzereingaben (nur der geprüfte Betrag). */}
            <div
              className="w-48 shrink-0 bg-white p-2 [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: state.qrCodeSvg }}
            />
            <dl className="space-y-3 text-sm text-black/80">
              <div>
                <dt className={labelClass}>{dict.qrPayableTo}</dt>
                <dd className="mt-1 leading-relaxed">
                  {state.iban}
                  <br />
                  {state.creditorName}
                  <br />
                  {state.creditorAddress}
                </dd>
              </div>
              <div>
                <dt className={labelClass}>{dict.labelAmount}</dt>
                <dd className="mt-1">{state.amount.toFixed(2)}</dd>
              </div>
              <div>
                <dt className={labelClass}>{dict.qrMessage}</dt>
                <dd className="mt-1">{state.message}</dd>
              </div>
            </dl>
          </div>
          <a
            href={`/api/donacione/qr-bill?${new URLSearchParams({
              amount: state.amount.toFixed(2),
              ...(state.note ? { message: state.note } : {}),
            })}`}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-[#E11D48] px-6 text-sm font-semibold uppercase tracking-wide text-[#E11D48] transition-colors hover:bg-[#E11D48]/10"
          >
            {dict.downloadQr}
          </a>
        </div>
      ) : null}
    </>
  );
}
