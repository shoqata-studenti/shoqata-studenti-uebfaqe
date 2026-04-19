import { MembershipForm } from "./membership-form";
import { MembershipStatusCheck } from "./membership-status";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/server";

export default async function MembershipPage() {
  const dict = getDictionary(await getLocale());

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 lg:px-16">
      <h1 className="font-serif text-4xl text-black md:text-5xl">{dict.membership.title}</h1>
      <p className="mt-4 max-w-2xl text-black/70">{dict.membership.intro}</p>
      <MembershipForm />
      <MembershipStatusCheck />
    </main>
  );
}
