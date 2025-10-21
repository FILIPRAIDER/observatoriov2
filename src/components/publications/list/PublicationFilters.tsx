// src/components/publications/list/PublicationFilters.tsx
"use client";

import { useState, useEffect } from "react";

export type FilterState = {
  search: string;
  typeId: string;
  onlyPdf: boolean;
  onlyFeatured: boolean;
};

type PublicationType = {
  id: string;
  name: string;
  color?: string | null;
};

interface PublicationFiltersProps {
  types: PublicationType[];
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export default function PublicationFilters({
  types,
  onFilterChange,
  initialFilters,
}: PublicationFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search ?? "",
    typeId: initialFilters?.typeId ?? "",
    onlyPdf: initialFilters?.onlyPdf ?? false,
    onlyFeatured: initialFilters?.onlyFeatured ?? false,
  });

  // Debounce para el search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleTypeChange = (typeId: string) => {
    setFilters((prev) => ({ ...prev, typeId }));
  };

  const handleTogglePdf = () => {
    setFilters((prev) => ({ ...prev, onlyPdf: !prev.onlyPdf }));
  };

  const handleToggleFeatured = () => {
    setFilters((prev) => ({ ...prev, onlyFeatured: !prev.onlyFeatured }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      typeId: "",
      onlyPdf: false,
      onlyFeatured: false,
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.typeId,
    filters.onlyPdf,
    filters.onlyFeatured,
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Search bar y botón de filtros */}
      <div className="flex items-center gap-3 mb-4">
        {/* Buscador */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar publicaciones..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 pl-11 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
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
          {filters.search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              aria-label="Limpiar búsqueda"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Botón de filtros */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-[14px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          aria-label="Abrir filtros"
        >
          <svg
            width="18"
            height="18"
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
          <span className="hidden sm:inline">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros desplegable */}
      {isOpen && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-neutral-900">
              Filtrar publicaciones
            </h3>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[13px] font-medium text-red-600 hover:text-red-700"
              >
                Limpiar todo
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tipo de publicación */}
            <div>
              <label
                htmlFor="filter-type"
                className="block text-[13px] font-medium text-neutral-700 mb-2"
              >
                Tipo de publicación
              </label>
              <select
                id="filter-type"
                value={filters.typeId}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="">Todos los tipos</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Opciones rápidas */}
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-2">
                Opciones
              </label>
              <div className="space-y-2">
                {/* Solo con PDF */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onlyPdf}
                    onChange={handleTogglePdf}
                    className="h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-[14px] text-neutral-700">
                    Solo con PDF disponible
                  </span>
                </label>

                {/* Solo destacados */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onlyFeatured}
                    onChange={handleToggleFeatured}
                    className="h-4 w-4 rounded border-neutral-300 text-yellow-500 focus:ring-yellow-500"
                  />
                  <span className="text-[14px] text-neutral-700">
                    Solo destacados
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Filtros activos */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-[12px] text-neutral-600 mb-2">
                Filtros activos:
              </p>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] text-neutral-700">
                    <span>Búsqueda: &ldquo;{filters.search}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="hover:text-neutral-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.typeId && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[12px] text-neutral-700">
                    <span>
                      {types.find((t) => t.id === filters.typeId)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTypeChange("")}
                      className="hover:text-neutral-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.onlyPdf && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[12px] text-red-700">
                    <span>Con PDF</span>
                    <button
                      type="button"
                      onClick={handleTogglePdf}
                      className="hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.onlyFeatured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-[12px] text-yellow-800">
                    <span>Destacados</span>
                    <button
                      type="button"
                      onClick={handleToggleFeatured}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
