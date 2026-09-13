import { MembershipForm } from "./membership-form";
import { NewsletterForm } from "./newsletter-form";
import { MembershipStatusCheck } from "./membership-status";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getMembershipPageIntro } from "@/lib/membership-intro";
import { getLocale } from "@/lib/i18n/server";

export default async function MembershipPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const intro = getMembershipPageIntro(locale);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 lg:px-16">
      <h1 className="font-serif text-4xl text-black md:text-5xl">{dict.membership.title}</h1>
      <p className="mt-4 max-w-2xl text-black/70">{intro}</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <section>
          <MembershipForm />
          <MembershipStatusCheck />
        </section>
        <aside className="lg:border-l lg:border-black/10 lg:pl-12">
          <NewsletterForm />
        </aside>
      </div>
    </main>
  );
}
