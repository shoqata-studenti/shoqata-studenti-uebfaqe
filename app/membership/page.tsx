import { MembershipForm } from "./membership-form";
import { MembershipStatusCheck } from "./membership-status";

export default function MembershipPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 lg:px-16">
      <h1 className="font-serif text-4xl text-black md:text-5xl">Mitgliedschaft</h1>
      <p className="mt-4 max-w-2xl text-black/70">
        Neue Mitgliedschaft: ein Jahr ab Antrag. Mit derselben E-Mail ist eine Verlängerung nur
        möglich, wenn weniger als sieben Tage Restlaufzeit bestehen; dann wird ein Jahr an das
        bisherige Ablaufdatum angehängt.
      </p>
      <MembershipForm />
      <MembershipStatusCheck />
    </main>
  );
}
