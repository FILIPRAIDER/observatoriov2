// src/components/publications/list/PublicationStats.tsx
"use client";

interface PublicationStatsProps {
  total: number;
  filtered: number;
  hasPdfCount?: number;
  featuredCount?: number;
}

export default function PublicationStats({
  total,
  filtered,
  hasPdfCount = 0,
  featuredCount = 0,
}: PublicationStatsProps) {
  const isFiltered = filtered < total;

  return (
    <div className="mb-6 rounded-xl border border-neutral-200 bg-linear-to-br from-neutral-50 to-white p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-neutral-900">
          Estadísticas
        </h2>
        {isFiltered && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[12px] font-medium text-blue-700">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6h18M8 12h8M11 18h2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Filtrado
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="rounded-lg bg-white border border-neutral-200 p-4 text-center">
          <div className="text-[28px] font-bold text-neutral-900">{total}</div>
          <div className="text-[12px] text-neutral-600 mt-1">
            Total publicaciones
          </div>
        </div>

        {/* Mostradas */}
        {isFiltered && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-center">
            <div className="text-[28px] font-bold text-blue-700">
              {filtered}
            </div>
            <div className="text-[12px] text-blue-600 mt-1">
              Mostrando ahora
            </div>
          </div>
        )}

        {/* Con PDF */}
        {hasPdfCount > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
            <div className="text-[28px] font-bold text-red-700">
              {hasPdfCount}
            </div>
            <div className="text-[12px] text-red-600 mt-1">Con PDF</div>
          </div>
        )}

        {/* Destacadas */}
        {featuredCount > 0 && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-center">
            <div className="text-[28px] font-bold text-yellow-700">
              {featuredCount}
            </div>
            <div className="text-[12px] text-yellow-600 mt-1">Destacadas</div>
          </div>
        )}
      </div>
    </div>
  );
}
