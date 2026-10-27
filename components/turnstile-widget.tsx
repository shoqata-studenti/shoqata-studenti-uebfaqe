"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type TurnstileWidgetProps = {
  siteKey?: string;
  /** Neues Token nach erfolgreicher Prüfung, `null` wenn abgelaufen oder fehlgeschlagen. */
  onToken: (token: string | null) => void;
  /** Bei jeder Änderung (z. B. nach einem Fehler) wird das Widget zurückgesetzt. */
  resetSignal?: number;
};

/** Cloudflare Turnstile (Bot-Schutz); das Token prüft der Server mit `verifyTurnstileToken`. */
export function TurnstileWidget({ siteKey, onToken, resetSignal = 0 }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !window.turnstile || !containerRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(null),
      "error-callback": () => onTokenRef.current(null),
      theme: "light",
      size: "normal",
    });
  }, [scriptReady, siteKey]);

  useEffect(() => {
    if (resetSignal === 0 || !window.turnstile || !widgetIdRef.current) return;
    window.turnstile.reset(widgetIdRef.current);
    onTokenRef.current(null);
  }, [resetSignal]);

  if (!siteKey) return null;

  return (
    <>
      <div ref={containerRef} />
      <Script
        id="cf-turnstile-api"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
    </>
  );
}
