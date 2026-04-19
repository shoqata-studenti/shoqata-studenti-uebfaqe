"use client";

import { useState } from "react";

import { useDictionary } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";

export function MembershipForm() {
  const dict = useDictionary();
  const f = dict.membership.form;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      university: formData.get("uni"),
      studyField: formData.get("studium"),
      type: formData.get("type"),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (resData.url) {
        window.location.href = resData.url;
      } else {
        setError(resData.error || f.errorPayment);
        setPending(false);
      }
    } catch (err) {
      console.error(err);
      setError(f.errorNetwork);
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      <div className="space-y-2">
        <label htmlFor="m-name" className="text-sm font-medium text-foreground">
          {f.name}
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
          {f.email}
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
          {f.uni}
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
          {f.studium}
        </label>
        <input
          id="m-studium"
          name="studium"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">{f.typeLegend}</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="type" value="STUDENT" required defaultChecked />
            {f.student}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="type" value="ALUMNI" required />
            {f.alumni}
          </label>
        </div>
      </fieldset>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? f.pending : f.submit}
      </Button>
    </form>
  );
}
