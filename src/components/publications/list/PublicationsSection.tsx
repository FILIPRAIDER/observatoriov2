// src/components/publications/list/PublicationsSection.tsx
"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import FadeIn from "@/components/ui/animation/FadeIn";
import PublicationListItem from "./PublicationListItem";
import AdvancedPublicationFilters, {
  type AdvancedFilterState,
} from "./AdvancedPublicationFilters";
import {
  fetchPublicationsPage,
  type PublicationsPageItem,
  type PublicationType,
} from "@/app/actions/publications";

const LIMIT = 9;

interface PublicationsSectionProps {
  initialTypes: PublicationType[];
}

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

export default function PublicationsSection({
  initialTypes,
}: PublicationsSectionProps) {
  const [items, setItems] = useState<PublicationsPageItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilterState>({
    search: "",
    typeId: "",
    onlyPdf: false,
    onlyFeatured: false,
  });
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(
    async (reset = false) => {
      if (!reset && (!hasMore || isLoadingMore)) return;
      setIsLoadingMore(true);

      const currentOffset = reset ? 0 : offset;
      const res = await fetchPublicationsPage({
        offset: currentOffset,
        limit: LIMIT,
        filters: {
          search: filters.search || undefined,
          typeId: filters.typeId || undefined,
          onlyPdf: filters.onlyPdf || undefined,
          onlyFeatured: filters.onlyFeatured || undefined,
        },
      });

      setItems((prev) => {
        if (reset) return res.items;
        // merge + de-dupe por id
        const merged = [...prev, ...res.items];
        const map = new Map<string, PublicationsPageItem>();
        for (const it of merged) map.set(it.id, it);
        return Array.from(map.values());
      });

      setOffset(reset ? res.items.length : currentOffset + res.items.length);
      setHasMore(res.hasMore);
      setIsLoadingMore(false);
    },
    [offset, hasMore, isLoadingMore, filters]
  );

  // Cargar cuando cambian los filtros
  useEffect(() => {
    startTransition(() => {
      load(true); // reset = true para recargar desde el inicio
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);



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
          {items.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              <span className="font-semibold">{items.length}</span>
              <span>
                {items.length === 1 ? "publicación encontrada" : "publicaciones encontradas"}
              </span>
            </div>
          )}
        </div>

        {/* Filtros avanzados */}
        <AdvancedPublicationFilters
          types={initialTypes}
          onFilterChange={setFilters}
          initialFilters={filters}
        />

        <div className="flex flex-col gap-5">
          {items.length === 0 && !isPending && !isLoadingMore ? (
            <div className="text-center py-12">
              <p className="text-[16px] text-neutral-600 mb-2">
                No se encontraron publicaciones
              </p>
              <p className="text-[14px] text-neutral-500">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            items.map((p) => <PublicationListItem key={p.id} {...p} />)
          )}

          {(isPending || isLoadingMore) &&
            Array.from({ length: 2 }).map((_, i) => (
              <SkeletonItem key={`sk-${i}`} />
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          {hasMore && items.length > 0 ? (
            <button
              type="button"
              className="rounded-xl bg-neutral-700 px-6 py-2 text-[14px] font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => startTransition(() => load())}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Cargando..." : "Ver más"}
            </button>
          ) : items.length > 0 ? (
            <span className="text-sm text-neutral-500">
              No hay más publicaciones
            </span>
          ) : null}
        </div>

        <div ref={sentinelRef} className="h-1 w-full" />
      </section>
    </FadeIn>
  );
}
