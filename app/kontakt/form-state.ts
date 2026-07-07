export type ContactFormState = {
  status: "idle" | "success" | "error";
  error?: "fields" | "turnstile" | "mail" | "config" | "send";
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
};
