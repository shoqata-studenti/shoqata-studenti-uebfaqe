import "server-only";

import Link from "next/link";

export type EventCardItem = {
  slug: string;
  name: string;
  coverImageId: number | null;
};

type Props = {
  headingClassName: string;
  heading: string;
  subheading?: string;
  events: EventCardItem[];
};

export function EventCards({ headingClassName, heading, subheading, events }: Props) {
  return (
    <section className="border-t border-black/10 bg-black/[0.02]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <h2 className={`${headingClassName} text-2xl font-bold tracking-tight text-black md:text-3xl`}>
          {heading}
        </h2>
        {subheading ? <p className="mt-3 max-w-2xl text-sm text-black/60">{subheading}</p> : null}

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <li key={ev.slug}>
              <Link
                href={`/evente/${ev.slug}`}
                className="group flex flex-col overflow-visible rounded-sm border border-black/12 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-[#E11D48]/35 hover:shadow-md"
              >
                {ev.coverImageId ? (
                  <div className="w-full shrink-0 bg-black/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/event-gallery/${ev.coverImageId}`}
                      alt=""
                      decoding="async"
                      className="w-full h-auto block rounded-t-sm"
                    />
                  </div>
                ) : (
                  <div className="flex w-full shrink-0 items-center justify-center rounded-t-sm bg-gradient-to-br from-black/[0.04] to-black/[0.09] py-14">
                    <span
                      className="text-3xl font-bold tracking-tight text-black/25"
                      aria-hidden
                    >
                      {ev.name.slice(0, 1)}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold leading-snug text-black group-hover:text-[#E11D48]">
                    {ev.name}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
