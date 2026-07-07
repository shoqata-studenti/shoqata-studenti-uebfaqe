"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";

import { sendContactMessage } from "./actions";
import { initialContactFormState, type ContactFormState } from "./form-state";

type KontaktDictionary = {
  sentOk: string;
  errorFields: string;
  errorSend: string;
  errorTurnstile: string;
  errorMail: string;
  errorConfig: string;
  errorServer: string;
  labelName: string;
  labelEmail: string;
  labelMessage: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderMessage: string;
  submit: string;
};

type KontaktFormProps = {
  dict: KontaktDictionary;
  turnstileSiteKey?: string;
};

type TurnstileGlobal = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact";
    }
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileGlobal;
  }
}

const fieldClass =
  "w-full rounded-sm border border-black/15 bg-white px-3 py-2.5 text-sm text-black outline-none transition-[border-color,box-shadow] placeholder:text-black/40 focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20";

export function KontaktForm({ dict, turnstileSiteKey }: KontaktFormProps) {
  const getErrorMessage = (error: ContactFormState["error"]): string => {
    if (error === "fields") return dict.errorFields;
    if (error === "turnstile") return dict.errorTurnstile;
    if (error === "mail") return dict.errorMail;
    if (error === "config") return dict.errorConfig;
    return dict.errorServer;
  };

  const [state, formAction, isSubmitting] = useActionState<ContactFormState, FormData>(
    sendContactMessage,
    initialContactFormState
  );
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
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
    if (!window.turnstile || !turnstileWidgetIdRef.current) return;
    if (state.status !== "error") return;

    // Keep widget visible and reusable after failed submit.
    window.turnstile.reset(turnstileWidgetIdRef.current);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    if (window.turnstile && turnstileWidgetIdRef.current) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  }, [state.status]);

  return (
    <>
      {state.status === "success" ? (
        <p className="mt-4 rounded-sm border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-black/80">
          {dict.sentOk}
        </p>
      ) : null}
      {state.status === "error" && state.error === "fields" ? (
        <p className="mt-4 rounded-sm border border-[#E11D48]/35 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
          {dict.errorFields}
        </p>
      ) : null}
      {state.status === "error" && state.error === "send" ? (
        <p className="mt-4 rounded-sm border border-[#E11D48]/35 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
          {getErrorMessage(state.error)}{" "}
          <a
            href="mailto:info@shoqata-studenti.ch"
            className="font-medium text-[#E11D48] underline-offset-2 hover:underline"
          >
            info@shoqata-studenti.ch
          </a>
          .
        </p>
      ) : null}
      {state.status === "error" &&
      (state.error === "turnstile" || state.error === "mail" || state.error === "config") ? (
        <p className="mt-4 rounded-sm border border-[#E11D48]/35 bg-[#E11D48]/10 px-4 py-3 text-sm text-black">
          {getErrorMessage(state.error)}
        </p>
      ) : null}

      <form ref={formRef} id="kontakt-formular" action={formAction} className="mt-8 space-y-6">
        {/* Honeypot — versteckt für echte Nutzer, Bots füllen es aus */}
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className="hidden"
        />
        <div className="space-y-2">
          <label htmlFor="emri" className="text-xs font-semibold uppercase tracking-wide text-black/80">
            {dict.labelName}
          </label>
          <input
            id="emri"
            name="emri"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder={dict.placeholderName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-black/80">
            {dict.labelEmail}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder={dict.placeholderEmail}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mesazhi" className="text-xs font-semibold uppercase tracking-wide text-black/80">
            {dict.labelMessage}
          </label>
          <textarea
            id="mesazhi"
            name="mesazhi"
            required
            rows={6}
            className={`${fieldClass} resize-y`}
            placeholder={dict.placeholderMessage}
          />
        </div>

        <input type="hidden" name="cf-turnstile-response" value={turnstileToken ?? ""} />
        {turnstileSiteKey ? <div ref={turnstileContainerRef} /> : null}

        <button
          type="submit"
          disabled={!turnstileToken || isSubmitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-[#E11D48] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#E11D48]"
        >
          {dict.submit}
        </button>
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
