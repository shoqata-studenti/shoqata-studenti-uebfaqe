import { Kryesia } from "@/components/kryesia";
import { SubpageHero } from "@/components/subpage-hero";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SubpageHero title="Kryesia" as="div" />
      <Kryesia showHeading={false} />
    </main>
  );
}
