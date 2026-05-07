import "server-only";

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

/**
 * Trägt eine E-Mail in die Infomaniak-Mailingliste ein und ordnet sie der Gruppe 157650 zu.
 */
export async function subscribeInfomaniakNewsletter(email: string): Promise<void> {
  const apiKey = process.env.INFOMANIAK_NEWSLETTER_API_KEY;

  console.log("[Infomaniak Newsletter] Start subscribe", {
    email,
    url: INFOMANIAK_SUBSCRIBER_URL,
    hasApiKey: Boolean(apiKey),
    keyLength: apiKey?.length ?? 0,
  });

  if (!apiKey) {
    console.warn("[Infomaniak Newsletter] Abbruch: INFOMANIAK_NEWSLETTER_API_KEY ist nicht gesetzt.");
    return;
  }

  console.log("[Infomaniak Newsletter] Sende POST an Gruppe 157650 ...");

  const response = await fetch(INFOMANIAK_SUBSCRIBER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ 
      email: email,
      // Die ID deiner Gruppe aus der URL
      groups: [157650]
    }),
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