"use client";

import { useState, useMemo } from "react";
import DashboardCard from "./DashboardCard";
import type { Dashboard } from "@/types/powerbi";

interface DashboardSearchProps {
  dashboards: Dashboard[];
}

export default function DashboardSearch({ dashboards }: DashboardSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar dashboards según la búsqueda
  const filteredDashboards = useMemo(() => {
    if (!searchQuery.trim()) return dashboards;

    const query = searchQuery.toLowerCase();
    return dashboards.filter(
      (dashboard) =>
        dashboard.name.toLowerCase().includes(query) ||
        (dashboard.description?.toLowerCase().includes(query) ?? false) ||
        (dashboard.category?.toLowerCase().includes(query) ?? false)
    );
  }, [dashboards, searchQuery]);

  return (
    <>
      {/* Barra de búsqueda */}
      <div className="mb-6 sm:mb-8">
        <div className="relative mx-auto max-w-2xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4">
            <svg
              className="h-4 w-4 text-neutral-400 sm:h-5 sm:w-5"
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
            placeholder="Buscar dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder-neutral-500 shadow-inner transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:py-3 sm:pl-11 sm:pr-4 sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 sm:pr-4"
              aria-label="Limpiar búsqueda"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Contador de resultados */}
        {searchQuery && (
          <p className="mt-2 text-center text-xs text-neutral-600 sm:mt-3 sm:text-sm">
            {filteredDashboards.length === 0
              ? "No se encontraron dashboards"
              : `${filteredDashboards.length} ${
                  filteredDashboards.length === 1 ? "dashboard encontrado" : "dashboards encontrados"
                }`}
          </p>
        )}
      </div>

      {/* Grid de dashboards */}
      {filteredDashboards.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDashboards.map((dashboard) => (
            <DashboardCard key={Number(dashboard.id)} dashboard={dashboard} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 sm:mb-4 sm:h-16 sm:w-16">
            <svg
              className="h-6 w-6 text-neutral-400 sm:h-8 sm:w-8"
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
          <p className="text-base font-medium text-neutral-900 sm:text-lg">No se encontraron resultados</p>
          <p className="mt-1.5 text-xs text-neutral-600 sm:mt-2 sm:text-sm">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}
    </>
  );
}
