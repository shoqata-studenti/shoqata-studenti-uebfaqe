import "server-only";

import { isOutboundEmailDisabled } from "@/lib/outbound-email";

const INFOMANIAK_SUBSCRIBER_URL = "https://api.infomaniak.com/1/newsletters/39426/subscribers";

function dataIndicatesAlreadyExists(data: unknown): boolean {
  if (data === null || data === undefined) return false;
  const serialized = JSON.stringify(data).toLowerCase();
  return serialized.includes("already exists");
}

function extractApiErrorMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message;
    if (typeof o.description === "string" && o.description.trim()) return o.description;
    const err = o.error;
    if (err && typeof err === "object") {
      const e = err as Record<string, unknown>;
      if (typeof e.message === "string" && e.message.trim()) return e.message;
      if (typeof e.description === "string" && e.description.trim()) return e.description;
      if (typeof e.code === "string" && e.code.trim()) return e.code;
    }
    if (typeof o.result === "string" && o.result.trim()) return o.result;
  }
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
}

export type InfomaniakNewsletterSubscriberName = {
  firstName: string;
  lastName: string;
};

/** Teilt einen vollen Anzeigenamen für Infomaniak (firstname / lastname) auf. */
export function splitDisplayNameForNewsletter(fullName: string): InfomaniakNewsletterSubscriberName {
  const t = fullName.trim();
  if (!t) return { firstName: "", lastName: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { firstName: t, lastName: "" };
  return { firstName: t.slice(0, i).trim(), lastName: t.slice(i + 1).trim() };
}

/**
 * Trägt eine E-Mail in die Infomaniak-Mailingliste ein und ordnet sie der Gruppe 157650 zu.
 * Optional Vor- und Nachname (Infomaniak-Felder `firstname` / `lastname`).
 */
export async function subscribeInfomaniakNewsletter(
  email: string,
  name?: InfomaniakNewsletterSubscriberName
): Promise<void> {
  if (isOutboundEmailDisabled()) {
    console.log("[Infomaniak Newsletter] Übersprungen (DISABLE_OUTBOUND_EMAILS).", { email });
    return;
  }

  const apiKey = process.env.INFOMANIAK_NEWSLETTER_API_KEY;

  const firstName = name?.firstName?.trim() ?? "";
  const lastName = name?.lastName?.trim() ?? "";

  console.log("[Infomaniak Newsletter] Start subscribe", {
    email,
    hasName: Boolean(firstName || lastName),
    url: INFOMANIAK_SUBSCRIBER_URL,
    hasApiKey: Boolean(apiKey),
    keyLength: apiKey?.length ?? 0,
  });

  if (!apiKey) {
    console.warn("[Infomaniak Newsletter] Abbruch: INFOMANIAK_NEWSLETTER_API_KEY ist nicht gesetzt.");
    return;
  }

  console.log("[Infomaniak Newsletter] Sende POST an Gruppe 157650 ...");

  const body: Record<string, unknown> = {
    email,
    groups: [157650],
  };
  if (firstName) body.firstname = firstName;
  if (lastName) body.lastname = lastName;

  const response = await fetch(INFOMANIAK_SUBSCRIBER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  console.log("[Infomaniak Newsletter] Fetch abgeschlossen", {
    status: response.status,
    ok: response.ok,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error("[Infomaniak Newsletter] Keine JSON-Antwort erhalten.");
    throw new Error(`Infomaniak: HTTP ${response.status}`);
  }

  console.log("Infomaniak API Response:", data);

  if (response.ok) {
    console.log("✅ Erfolgreich in Gruppe 157650 eingetragen.");
    return;
  }

  if (response.status === 409 || dataIndicatesAlreadyExists(data)) {
    console.log("ℹ️ User existiert bereits in dieser Liste.");
    return;
  }

  const detail = extractApiErrorMessage(data);
  throw new Error(detail);
}