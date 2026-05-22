import "server-only";

import { Resend } from "resend";
import type { MembershipType } from "@prisma/client";

import { formatDateWithWeekdaySq } from "@/lib/format-datetime";
import { getResendApiKey, resendFromAddress } from "@/lib/resend-config";
import { membershipPageUrl, siteHomeUrl } from "@/lib/site-url";

const RENEWAL_URL = membershipPageUrl();
const SITE_URL = siteHomeUrl();
const INSTAGRAM_URL = "https://www.instagram.com/shoqatastudenti_zh";
const FACEBOOK_URL = "https://www.facebook.com/shoqata.studentizh";
const TIKTOK_URL = "https://www.tiktok.com/@shoqata.studenti";

const typeLabelSq: Record<MembershipType, string> = {
  STUDENT: "Student",
  ALUMNI: "Alumni",
};

/**
 * "I/E nderuar <Emër Mbiemër>," kur emri është i njohur,
 * përndryshe vetëm "I/E nderuar,".
 */
function greetingSq(fullName?: string): string {
  const trimmed = fullName?.trim();
  return trimmed ? `I/E nderuar ${escapeHtml(trimmed)},` : "I/E nderuar,";
}

function socialBlockHtml(): string {
  return `
    <p>
      Webfaqe: <a href="${SITE_URL}">${SITE_URL}</a><br/>
      Instagram: <a href="${INSTAGRAM_URL}">${INSTAGRAM_URL}</a><br/>
      Facebook: <a href="${FACEBOOK_URL}">${FACEBOOK_URL}</a><br/>
      TikTok: <a href="${TIKTOK_URL}">${TIKTOK_URL}</a>
    </p>
  `;
}

function membershipConfirmationHtml(fullName?: string): string {
  return `
    <p>${greetingSq(fullName)}</p>
    <p>Ju konfirmojmë se anëtarësimi juaj në Shoqatën Studenti është kryer me sukses. Jemi të lumtur që do t&rsquo;i bashkoheni komunitetit tonë, i cili ofron hapësirë për kultivimin e gjuhës, kulturës, mendimit kritik, socializimit, dhe rrjetizimit. Shoqata Studenti financohet kryesisht nga pagesat e anëtarësisë, prandaj regjistrimi juaj ka vlerë të çmueshme për shoqatën.</p>
    <p>Si anëtar/e, ju përfitoni:</p>
    <ul>
      <li>të drejtën për të marrë pjesë në Asamblenë Gjenerale;</li>
      <li>përparësi në pjesëmarrje në evente me vende të limituara;</li>
      <li>çmime të reduktuara ose hyrje falas në shumë aktivitete.</li>
    </ul>
    <p>Ju ftojmë t&rsquo;i ndiqni aktivitetet tona në:</p>
    ${socialBlockHtml()}
    <p>Faleminderit për besimin dhe mbështetjen tuaj.</p>
    <p>Përzemërsisht,<br/>Shoqata Studenti</p>
  `;
}

function newsletterWelcomeHtml(fullName?: string): string {
  return `
    <p>${greetingSq(fullName)}</p>
    <p>Ju konfirmojmë se abonimi juaj në newsletter-in e Shoqatës Studenti është kryer me sukses.</p>
    <p>Përmes newsletter-it, do të keni mundësi të ndiqni më nga afër punën tonë dhe të informoheni me kohë për aktivitete, evente, mundësi, dhe njoftime të rëndësishme.</p>
    <p>Ju ftojmë t&rsquo;i ndiqni aktivitetet tona edhe në:</p>
    ${socialBlockHtml()}
    <p>Faleminderit për interesimin dhe besimin tuaj.</p>
    <p>Përzemërsisht,<br/>Shoqata Studenti</p>
  `;
}

/** Bestätigung nach neuer / verlängerter Mitgliedschaft (nur Albanisch). */
export async function sendMembershipConfirmationEmailSq(
  email: string,
  _type: MembershipType,
  fullName?: string
): Promise<{ sent: boolean; skipped?: string; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { sent: false, skipped: "RESEND_API_KEY ist nicht gesetzt." };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: email,
    subject: "Shoqata Studenti — Konfirmim i anëtarësimit",
    html: membershipConfirmationHtml(fullName),
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
  _uni: string,
  _type: MembershipType
): Promise<{ sent: boolean; error?: string; skipped?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: email,
    subject: "Shoqata Studenti — Konfirmim i anëtarësimit",
    html: membershipConfirmationHtml(fullName),
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
      <li>të drejtën për të marrë pjesë në Asamblenë Gjenerale;</li>
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
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);
  const dateStr = formatDateWithWeekdaySq(expiresAt);

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: email,
    subject: "Shoqata Studenti — Anëtarësimi juaj po afrohet në skadencë",
    html: `
      <p>${greetingSq(fullName)}</p>
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
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY fehlt" };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: email,
    subject: "Shoqata Studenti — Anëtarësimi juaj ka skaduar",
    html: `
      <p>${greetingSq(fullName)}</p>
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
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return { ok: false, skipped: "RESEND_API_KEY ist nicht gesetzt." };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: email,
    subject: "Shoqata Studenti — Konfirmim i abonimit në newsletter",
    html: newsletterWelcomeHtml(fullName),
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
