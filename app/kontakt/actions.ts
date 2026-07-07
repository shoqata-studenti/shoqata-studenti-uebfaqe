"use server";

import { sendContactEmailToInfo } from "@/lib/send-contact-email";
import { verifyTurnstileToken } from "@/lib/turnstile";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: "fields" | "turnstile" | "mail" | "config" | "send";
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
};

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    // Honeypot — Bots füllen dieses versteckte Feld aus, echte Nutzer nicht
    const botField = formData.get("website_url")?.toString() ?? "";
    if (botField) {
      // Bot erkannt: Erfolg vortäuschen, nichts tun
      return { status: "success" };
    }

    if (!process.env.TURNSTILE_SECRET_KEY?.trim()) {
      return { status: "error", error: "config" };
    }

    const emri = formData.get("emri")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const mesazhi = formData.get("mesazhi")?.toString().trim() ?? "";

    if (!emri || !email || !mesazhi) {
      return { status: "error", error: "fields" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { status: "error", error: "fields" };
    }

    const turnstileToken = formData.get("cf-turnstile-response")?.toString().trim() ?? "";
    const turnstileResult = await verifyTurnstileToken(turnstileToken);
    if (!turnstileResult.ok) {
      console.warn("[Kontakt] Turnstile verification failed:", turnstileResult.error ?? "unknown");
      return { status: "error", error: "turnstile" };
    }

    const result = await sendContactEmailToInfo({ name: emri, email, message: mesazhi });
    if (!result.ok) {
      console.error("[Kontakt] Mail provider failed:", result.error);
      return { status: "error", error: "mail" };
    }

    return { status: "success" };
  } catch (error) {
    console.error("[Kontakt] Unexpected server action error:", error);
    return {
      status: "error",
      error: "send",
    };
  }
}
