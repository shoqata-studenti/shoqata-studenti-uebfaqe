"use server";

import { redirect } from "next/navigation";

import { sendContactEmailToInfo } from "@/lib/send-contact-email";

export async function sendContactMessage(formData: FormData) {
  const emri = formData.get("emri")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const mesazhi = formData.get("mesazhi")?.toString().trim() ?? "";

  if (!emri || !email || !mesazhi) {
    redirect("/kontakt?error=1");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/kontakt?error=1");
  }

  const result = await sendContactEmailToInfo({ name: emri, email, message: mesazhi });
  if (!result.ok) {
    console.error("[Kontakt] Resend:", result.error);
    redirect("/kontakt?error=2");
  }

  redirect("/kontakt?sent=1");
}
