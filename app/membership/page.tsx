import { MembershipForm } from "./membership-form";
import { NewsletterForm } from "./newsletter-form";
import { MembershipStatusCheck } from "./membership-status";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getMembershipPageIntro } from "@/lib/membership-intro";
import { getLocale } from "@/lib/i18n/server";

type Props = {
  searchParams: Promise<{ type?: string | string[] }>;
};

function membershipTypeFromSearch(type: string | string[] | undefined): "STUDENT" | "ALUMNI" {
  const raw = Array.isArray(type) ? type[0] : type;
  return String(raw ?? "").toUpperCase() === "ALUMNI" ? "ALUMNI" : "STUDENT";
}

export default async function MembershipPage({ searchParams }: Props) {
  const sp = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const intro = getMembershipPageIntro(locale);
  const defaultMembershipType = membershipTypeFromSearch(sp.type);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 lg:px-16">
      <h1 className="font-serif text-4xl text-black md:text-5xl">{dict.membership.title}</h1>
      <p className="mt-4 max-w-2xl text-black/70">{intro}</p>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <section>
          <MembershipForm
            key={defaultMembershipType}
            defaultMembershipType={defaultMembershipType}
          />
          <MembershipStatusCheck />
        </section>
        <aside className="lg:border-l lg:border-black/10 lg:pl-12">
          <NewsletterForm />
        </aside>
      </div>
    </main>
  );
}
