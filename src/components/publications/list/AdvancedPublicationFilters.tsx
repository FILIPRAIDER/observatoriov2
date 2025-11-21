"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { PublicationType } from "@/app/actions/publications";

export interface AdvancedFilterState {
  search: string;
  typeId: string;
  onlyPdf: boolean;
  onlyFeatured: boolean;
}

interface AdvancedPublicationFiltersProps {
  types: PublicationType[];
  onFilterChange: (filters: AdvancedFilterState) => void;
  initialFilters?: AdvancedFilterState;
}

export default function AdvancedPublicationFilters({
  types,
  onFilterChange,
  initialFilters,
}: AdvancedPublicationFiltersProps) {
  const [search, setSearch] = useState(initialFilters?.search ?? "");
  const [typeId, setTypeId] = useState(initialFilters?.typeId ?? "");
  const [onlyPdf, setOnlyPdf] = useState(initialFilters?.onlyPdf ?? false);
  const [onlyFeatured, setOnlyFeatured] = useState(
    initialFilters?.onlyFeatured ?? false
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const handleReset = useCallback(() => {
    setSearch("");
    setTypeId("");
    setOnlyPdf(false);
    setOnlyFeatured(false);
    setIsAdvancedOpen(false);
  }, []);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      typeId,
      onlyPdf,
      onlyFeatured,
    });
  }, [debouncedSearch, typeId, onlyPdf, onlyFeatured, onFilterChange]);

  const hasActiveFilters = typeId || onlyPdf || onlyFeatured || search;

  return (
    <div className="mb-8 space-y-4">
      {/* Búsqueda principal */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar publicaciones por título, contenido o palabras clave..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white py-3 pl-12 pr-12 text-sm text-neutral-900 placeholder-neutral-500 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Botón de filtros avanzados */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-300 hover:bg-neutral-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span>Filtros avanzados</span>
          <svg
            className={`h-4 w-4 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Panel de filtros avanzados */}
      {isAdvancedOpen && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Tipo de publicación */}
          <div>
            <label
              htmlFor="filter-type"
              className="mb-2 block text-sm font-semibold text-neutral-700"
            >
              Tipo de publicación
            </label>
            <select
              id="filter-type"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Todos los tipos</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={onlyPdf}
                onChange={(e) => setOnlyPdf(e.target.checked)}
                className="h-5 w-5 rounded border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                  <path d="M14 2v6h6M10 13h4M10 17h4M10 9h1"/>
                </svg>
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  Solo con PDF disponible
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={onlyFeatured}
                onChange={(e) => setOnlyFeatured(e.target.checked)}
                className="h-5 w-5 rounded border-neutral-300 text-emerald-600 focus:ring-2 focus:ring-emerald-100 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  Solo publicaciones destacadas
                </span>
              </div>
            </label>
          </div>

          {/* Contador de resultados activos */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">
                Filtros activos: {" "}
                <span className="font-semibold text-neutral-900">
                  {[
                    search && "búsqueda",
                    typeId && "tipo",
                    onlyPdf && "PDF",
                    onlyFeatured && "destacadas",
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
