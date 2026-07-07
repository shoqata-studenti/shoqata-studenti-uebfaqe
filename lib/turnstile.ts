import "server-only";

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(
  token: string
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: false, error: "TURNSTILE_SECRET_KEY fehlt" };
  }

  if (!token) {
    return { ok: false, error: "Turnstile token fehlt" };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, error: `Turnstile HTTP ${res.status}` };
    }

    const json = (await res.json()) as TurnstileVerifyResponse;
    if (!json.success) {
      const codes = json["error-codes"]?.join(", ");
      return { ok: false, error: codes ? `Turnstile failed: ${codes}` : "Turnstile failed" };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unbekannter Turnstile-Fehler",
    };
  }
}
