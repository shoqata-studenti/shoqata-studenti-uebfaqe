import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
      <div className="mb-6 rounded-full bg-green-100 p-6">
        <svg
          className="h-12 w-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h1 className="font-serif text-4xl text-black md:text-5xl">Zahlung erfolgreich!</h1>
      <p className="mt-4 max-w-xl text-black/70">
        Vielen Dank für deine Zahlung. Deine Mitgliedschaft wurde erfolgreich registriert. 
        Du bist nun (wieder) aktives Mitglied im Verein!
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
      >
        Zurück zur Startseite
      </Link>
    </main>
  );
}