"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MembershipForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    // Formulardaten auslesen
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      university: formData.get("uni"),       // Wird für Stripe auf 'university' gemappt
      studyField: formData.get("studium"),   // Wird für Stripe auf 'studyField' gemappt
      type: formData.get("type"),
    };

    try {
      // Unsere API-Route aufrufen
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (resData.url) {
        // Leitet den User zur Stripe-Kasse weiter
        window.location.href = resData.url;
      } else {
        setError(resData.error || "Fehler beim Erstellen der Zahlung.");
        setPending(false);
      }
    } catch (err) {
      console.error(err);
      setError("Ein Verbindungsfehler ist aufgetreten.");
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      <div className="space-y-2">
        <label htmlFor="m-name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="m-name"
          name="name"
          required
          autoComplete="name"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="m-email" className="text-sm font-medium text-foreground">
          E-Mail
        </label>
        <input
          id="m-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="m-uni" className="text-sm font-medium text-foreground">
          Uni
        </label>
        <input
          id="m-uni"
          name="uni"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="m-studium" className="text-sm font-medium text-foreground">
          Studium
        </label>
        <input
          id="m-studium"
          name="studium"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Typ</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="type" value="STUDENT" required defaultChecked />
            Student
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="type" value="ALUMNI" required />
            Alumni
          </label>
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Wird umgeleitet…" : "Jetzt kostenpflichtig abschliessen"}
      </Button>
    </form>
  );
}