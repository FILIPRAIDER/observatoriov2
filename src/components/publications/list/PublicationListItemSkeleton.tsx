"use client";

export default function PublicationListItemSkeleton() {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 animate-pulse">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Imagen */}
        <div className="w-full sm:w-[288px] h-[156px] sm:h-[168px] rounded-xl bg-neutral-200" />

        {/* Texto */}
        <div className="flex-1">
          <div className="h-5 w-4/5 rounded bg-neutral-200" />
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-11/12 rounded bg-neutral-200" />
            <div className="h-4 w-3/5 rounded bg-neutral-200" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="h-6 w-20 rounded-full bg-neutral-200" />
            <div className="h-4 w-16 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    </article>
  );
}
