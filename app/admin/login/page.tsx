import { Playfair_Display } from "next/font/google";

import { adminLogin } from "./actions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type PageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const q = await searchParams;
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-20">
        <h1
          className={`${playfair.className} text-center text-2xl font-bold tracking-tight text-black md:text-3xl`}
        >
          Admin
        </h1>
        <p className="mt-2 text-center text-sm text-black/60">
          Shkruaj fjalëkalimin e administratorit
        </p>
        {q.error === "1" ? (
          <p
            className="mt-6 rounded-sm border border-[#E11D48]/35 bg-[#E11D48]/8 px-4 py-3 text-center text-sm text-black"
            role="status"
          >
            Fjalëkalim i gabuar.
          </p>
        ) : null}
        {q.error === "2" ? (
          <p
            className="mt-6 rounded-sm border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-center text-sm text-black"
            role="status"
          >
            Mungon <code className="text-xs">ADMIN_PASSWORD</code> në .env
          </p>
        ) : null}

        <form action={adminLogin} className="mt-10 space-y-6">
          <input
            type="hidden"
            name="next"
            value={q.next && q.next.startsWith("/") && !q.next.startsWith("//") ? q.next : "/admin"}
          />
          <div className="space-y-2 text-left">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wide text-black/80"
            >
              Fjalëkalimi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-sm border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none transition-[border-color,box-shadow] focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/25"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-11 rounded-sm bg-[#E11D48] text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#be123c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
