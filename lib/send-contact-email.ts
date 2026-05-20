import "server-only";

import { Resend } from "resend";

import { getResendApiKey, resendFromAddress, SHOQATA_INFO_EMAIL } from "@/lib/resend-config";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactEmailToInfo(params: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);
  const { name, email, message } = params;

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: SHOQATA_INFO_EMAIL,
    replyTo: email,
    subject: `Kontaktformular: ${name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Nachricht:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
