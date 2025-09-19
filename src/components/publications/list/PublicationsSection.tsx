// src/components/publications/list/PublicationsSection.tsx
"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import FadeIn from "@/components/ui/animation/FadeIn";
import PublicationListItem from "./PublicationListItem";
import { fetchPublicationsPage } from "@/app/actions/publications";

type Item = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  img: string;
  alt: string;
  slug: string;
};

const LIMIT = 6;

function SkeletonItem() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative w-full sm:w-[288px] h-[156px] sm:h-[168px] overflow-hidden rounded-xl bg-neutral-200 animate-pulse" />
        <div className="flex-1">
          <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse" />
          <div className="mt-3 h-4 w-full bg-neutral-200 rounded animate-pulse" />
          <div className="mt-2 h-4 w-2/3 bg-neutral-200 rounded animate-pulse" />
          <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
            <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicationsSection() {
  const [items, setItems] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    const res = await fetchPublicationsPage({ offset, limit: LIMIT });

    setItems((prev) => {
      // merge + de-dupe por id
      const merged = [...prev, ...res.items];
      const map = new Map<string, Item>();
      for (const it of merged) map.set(it.id, it);
      return Array.from(map.values());
    });

    setOffset((prev) => prev + res.items.length);
    setHasMore(res.hasMore);
    setIsLoadingMore(false);
  }, [offset, hasMore, isLoadingMore]);

  useEffect(() => {
    startTransition(() => {
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          load();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [load, hasMore, isLoadingMore]);

  return (
    <FadeIn>
      <section className="w-full py-10 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-neutral-900">
            Publicaciones
          </h1>
          <p className="mt-2 text-[14px] text-neutral-600">
            Descubre los últimos análisis y tendencias en el sector educativo.
          </p>
        </div>

        <div className="mb-4 flex items-center justify-end gap-2">
          <span className="text-[14px] text-neutral-600">Buscador</span>
          <button
            type="button"
            aria-label="Buscar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700"
          >
            {/* icono lupa */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {items.map((p) => (
            <PublicationListItem key={p.id} {...p} />
          ))}

          {(isPending || isLoadingMore) &&
            Array.from({ length: 2 }).map((_, i) => (
              <SkeletonItem key={`sk-${i}`} />
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          {hasMore ? (
            <button
              type="button"
              className="rounded-xl bg-neutral-700 px-6 py-2 text-[14px] font-medium text-white"
              onClick={() => startTransition(() => load())}
            >
              Ver más
            </button>
          ) : (
            <span className="text-sm text-neutral-500">
              No hay más publicaciones
            </span>
          )}
        </div>

        <div ref={sentinelRef} className="h-1 w-full" />
      </section>
    </FadeIn>
  );
}
