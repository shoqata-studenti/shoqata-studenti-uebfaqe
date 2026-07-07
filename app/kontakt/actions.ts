"use server";

import { redirect } from "next/navigation";

import { sendContactEmailToInfo } from "@/lib/send-contact-email";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function sendContactMessage(formData: FormData) {
  // Honeypot — Bots füllen dieses versteckte Feld aus, echte Nutzer nicht
  const botField = formData.get("website_url")?.toString() ?? "";
  if (botField) {
    // Bot erkannt: Erfolg vortäuschen, nichts tun
    redirect("/kontakt?sent=1");
  }

  const emri = formData.get("emri")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const mesazhi = formData.get("mesazhi")?.toString().trim() ?? "";

  if (!emri || !email || !mesazhi) {
    redirect("/kontakt?error=1");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/kontakt?error=1");
  }

  const turnstileToken = formData.get("cf-turnstile-response")?.toString().trim() ?? "";
  const turnstileResult = await verifyTurnstileToken(turnstileToken);
  if (!turnstileResult.ok) {
    console.warn("[Kontakt] Turnstile verification failed:", turnstileResult.error ?? "unknown");
    redirect("/kontakt?error=3");
  }

  const result = await sendContactEmailToInfo({ name: emri, email, message: mesazhi });
  if (!result.ok) {
    console.error("[Kontakt] Resend:", result.error);
    redirect("/kontakt?error=2");
  }

  redirect("/kontakt?sent=1");
}
