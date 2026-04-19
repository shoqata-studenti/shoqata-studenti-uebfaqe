import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function StatusPage() {
  const dict = getDictionary(await getLocale());
  const s = dict.status;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 lg:px-16">
      <h1 className="font-serif text-4xl text-black md:text-5xl">{s.title}</h1>
      <p className="mt-4 max-w-2xl text-black/70">{s.body}</p>
    </main>
  );
}
