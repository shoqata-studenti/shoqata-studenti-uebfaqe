import "server-only";

import { Resend } from "resend";
import type { MembershipType } from "@prisma/client";

import { formatDateWithWeekdaySq } from "@/lib/format-datetime";
import { isOutboundEmailDisabled, OUTBOUND_EMAIL_DISABLED_REASON } from "@/lib/outbound-email";

const RENEWAL_URL = "https://shoqata-studenti.ch/regjistrohu";

const typeLabelSq: Record<MembershipType, string> = {
  STUDENT: "Student",
  ALUMNI: "Alumni",
};

function defaultFrom(): string {
  return process.env.RESEND_FROM ?? "Mitgliedschaft <onboarding@resend.dev>";
}

/** Bestätigung nach neuer / verlängerter Mitgliedschaft (nur Albanisch). */
export async function sendMembershipConfirmationEmailSq(
  email: string,
  type: MembershipType,
  fullName?: string
): Promise<{ sent: boolean; skipped?: string; error?: string }> {
  if (isOutboundEmailDisabled()) {
    return { sent: false, skipped: OUTBOUND_EMAIL_DISABLED_REASON };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, skipped: "RESEND_API_KEY ist nicht gesetzt." };
  }

  const resend = new Resend(apiKey);
  const greeting = fullName ? `Përshëndetje ${escapeHtml(fullName)},` : "Të nderuar,";

  const { error } = await resend.emails.send({
    from: defaultFrom(),
    to: email,
    subject: "Shoqata Studenti — Konfirmim i anëtarësimit",
    html: `
      <p>${greeting}</p>
      <p>Anëtarësimi juaj si <strong>${typeLabelSq[type]}</strong> u regjistrua me sukses.</p>
      <p>Faleminderit që jeni pjesë e Shoqatës Studenti.</p>
      <p>Përzemërsisht,<br/>Shoqata Studenti</p>
    `,
  });

  if (error) {
    return { sent: false, error: error.message };
  }
  return { sent: true };
}

/** Willkommens-Mail nach Stripe-Zahlung (nur Albanisch). */
export async function sendStripeWelcomeEmailSq(
  email: string,
  fullName: string,
  uni: string,
  type: MembershipType
): Promise<{ sent: boolean; error?: string; skipped?: string }> {
  if (isOutboundEmailDisabled()) {
    return { sent: false, skipped: OUTBOUND_EMAIL_DISABLED_REASON };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: defaultFrom(),
    to: email,
    subject: "Mirë se vini në Shoqatën Studenti!",
    html: `
      <p>Përshëndetje ${escapeHtml(fullName)},</p>
      <p>Faleminderit për pagesën tuaj. Anëtarësimi juaj (<strong>${typeLabelSq[type]}</strong>) është tani aktiv.</p>
      <p>Të dhënat tuaja janë regjistruar në <strong>${escapeHtml(uni)}</strong>.</p>
      <p>Shumë suksese në studime!</p>
      <p>Përzemërsisht,<br/>Shoqata Studenti</p>
    `,
  });

  if (error) {
    return { sent: false, error: error.message };
  }
  return { sent: true };
}

function benefitsBlockHtml(): string {
  return `
    <p>Si anëtar/e, ju përfitoni gjithashtu:</p>
    <ul>
      <li>të drejtën për të marrë pjesë në Kuvendin e Përgjithshëm;</li>
      <li>përparësi në pjesëmarrje në evente me vende të limituara;</li>
      <li>çmime të reduktuara ose hyrje falas në shumë aktivitete.</li>
    </ul>
  `;
}

/** Reminder: ~7 ditë para skadencës. */
export async function sendMembershipReminderEmailSq(
  email: string,
  fullName: string,
  expiresAt: Date
): Promise<{ ok: boolean; error?: string; skipped?: string }> {
  if (isOutboundEmailDisabled()) {
    return { ok: false, skipped: OUTBOUND_EMAIL_DISABLED_REASON };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);
  const dateStr = formatDateWithWeekdaySq(expiresAt);

  const { error } = await resend.emails.send({
    from: defaultFrom(),
    to: email,
    subject: "Shoqata Studenti — Anëtarësimi juaj po afrohet në skadencë",
    html: `
      <p>Të nderuar ${escapeHtml(fullName)},</p>
      <p>Ju njoftojmë se anëtarësimi juaj në Shoqatën Studenti do të skadojë më <strong>${escapeHtml(dateStr)}</strong>.</p>
      <p>Jemi të lumtur që jeni pjesë e jonë dhe do të na gëzonte shumë nëse e rinovoni anëtarësimin tuaj në kohë.</p>
      <p>Shoqata Studenti financohet kryesisht nga pagesat e anëtarësisë së anëtarëve të saj aktivë. Duke qenë se anëtarët tanë janë studentë, ky kontribut është simbolik, por na ndihmon shumë që të vazhdojmë të funksionojmë dhe të organizojmë aktivitete për ju. Prandaj, anëtarësimi juaj kontribuon drejtpërdrejt në mirëqenien dhe vazhdimësinë e shoqatës.</p>
      ${benefitsBlockHtml()}
      <p>Për ta rinovuar anëtarësimin, ju lutemi klikoni këtu:<br/>
      <a href="${RENEWAL_URL}">${RENEWAL_URL}</a></p>
      <p>Faleminderit për besimin dhe mbështetjen tuaj.</p>
      <p>Përzemërsisht,<br/>Shoqata Studenti</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** E-Mail pas skadencës së anëtarësimit. */
export async function sendMembershipExpiredEmailSq(
  email: string,
  fullName: string
): Promise<{ ok: boolean; error?: string; skipped?: string }> {
  if (isOutboundEmailDisabled()) {
    return { ok: false, skipped: OUTBOUND_EMAIL_DISABLED_REASON };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: defaultFrom(),
    to: email,
    subject: "Shoqata Studenti — Anëtarësimi juaj ka skaduar",
    html: `
      <p>Të nderuar ${escapeHtml(fullName)},</p>
      <p>Ju njoftojmë se anëtarësimi juaj në Shoqatën Studenti ka skaduar.</p>
      <p>Jemi të lumtur që keni qenë pjesë e jonë deri tani dhe do të na gëzonte shumë nëse vendosni ta rinovoni anëtarësimin tuaj.</p>
      <p>Shoqata Studenti financohet kryesisht nga pagesat e anëtarësisë së anëtarëve të saj aktivë. Duke qenë se anëtarët tanë janë studentë, ky kontribut është simbolik, por na ndihmon shumë që të vazhdojmë të funksionojmë dhe të organizojmë aktivitete për ju. Prandaj, anëtarësimi juaj kontribuon drejtpërdrejt në mirëqenien dhe vazhdimësinë e shoqatës.</p>
      ${benefitsBlockHtml()}
      <p>Për ta rinovuar anëtarësimin, ju lutemi klikoni këtu:<br/>
      <a href="${RENEWAL_URL}">${RENEWAL_URL}</a></p>
      <p>Faleminderit për besimin dhe mbështetjen tuaj.</p>
      <p>Përzemërsisht,<br/>Shoqata Studenti</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Begrüssung an neue Newsletter-Abonnent:innen (albanisch). Nur beim ersten Eintrag. */
export async function sendNewsletterWelcomeEmailSq(
  email: string,
  fullName?: string
): Promise<{ ok: boolean; error?: string; skipped?: string }> {
  if (isOutboundEmailDisabled()) {
    return { ok: false, skipped: OUTBOUND_EMAIL_DISABLED_REASON };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, skipped: "RESEND_API_KEY ist nicht gesetzt." };
  }

  const resend = new Resend(apiKey);
  const greeting = fullName ? `Përshëndetje ${escapeHtml(fullName)},` : "Përshëndetje,";

  const { error } = await resend.emails.send({
    from: defaultFrom(),
    to: email,
    subject: "Mirë se vini në newsletter-in e Shoqatës Studenti!",
    html: `
      <p>${greeting}</p>
      <p>Faleminderit që u abonove në newsletter-in tonë. Që tani do të marrësh në email lajme, ftesa për evente dhe risi nga Shoqata Studenti.</p>
      <p>Nëse dëshiron të bëhesh anëtar/e i Shoqatës, mund ta bësh këtu:<br/>
      <a href="${RENEWAL_URL}">${RENEWAL_URL}</a></p>
      <p>Përzemërsisht,<br/>Shoqata Studenti</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
