"use client";

import Link from "next/link";
import Image from "next/image";
import type { Dashboard } from "@/types/powerbi";

interface DashboardCardProps {
  dashboard: Dashboard;
}

export default function DashboardCard({ dashboard }: DashboardCardProps) {
  return (
    <Link
      href={`/cordoba-en-datos/${dashboard.id}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-inner transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Imagen o placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
        {dashboard.thumbnail_url ? (
          <Image
            src={dashboard.thumbnail_url}
            alt={dashboard.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-neutral-300 dark:text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 bg-neutral-900">
        <h3 className="mb-3 text-xl font-bold text-white group-hover:text-emerald-400">
          {dashboard.name}
        </h3>

        {dashboard.description && (
          <p className="mb-4 line-clamp-3 text-[15px] leading-relaxed text-neutral-300">
            {dashboard.description}
          </p>
        )}

        <div className="flex items-center text-[15px] font-medium text-emerald-400">
          Ver dashboard
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
