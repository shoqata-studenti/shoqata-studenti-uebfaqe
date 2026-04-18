"use server";

import { redirect } from "next/navigation";

/**
 * Simulon dërgimin e emailit drejt info@shoqata-studenti.ch.
 * Zëvendëso me Resend / SMTP kur të jetë gati.
 */
export async function sendContactMessage(formData: FormData) {
  const emri = formData.get("emri")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const mesazhi = formData.get("mesazhi")?.toString().trim() ?? "";

  if (!emri || !email || !mesazhi) {
    redirect("/kontakt?error=1");
  }

  // Simulim — në prod do të dërgohej me shërbim email
  console.info("[Kontakt — simuluar]", {
    to: "info@shoqata-studenti.ch",
    emri,
    email,
    mesazhiLength: mesazhi.length,
  });

  redirect("/kontakt?sent=1");
}
