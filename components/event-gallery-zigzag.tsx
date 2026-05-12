import "server-only";

type Props = {
  imageIds: number[];
  momentsTitle: string;
  emptyMessage: string;
};

/** 1:1 me seksionin «Momentet» në faqet e eventeve (zig-zag). */
export function EventGalleryZigzag({ imageIds, momentsTitle, emptyMessage }: Props) {
  if (imageIds.length === 0) {
    return <p className="mt-14 max-w-2xl text-sm text-black/55">{emptyMessage}</p>;
  }

  return (
    <div className="mt-14 w-full">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-black/70">{momentsTitle}</h2>
      <div className="mt-10 flex w-full flex-col gap-12 md:gap-16">
        {imageIds.map((id, i) => (
          <div
            key={id}
            className={`w-full max-w-md border-0 p-0 shadow-none ring-0 outline-none md:max-w-none md:w-2/5 ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}
          >
            <figure className="m-0 w-full border-0 p-0 shadow-none ring-0 outline-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/event-gallery/${id}`}
                alt=""
                decoding="async"
                className="block h-auto w-full max-h-[60vh] border-0 object-contain shadow-none ring-0 outline-none"
              />
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
