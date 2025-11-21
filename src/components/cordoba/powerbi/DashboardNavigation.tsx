"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dashboard } from "@/types/powerbi";

interface DashboardNavigationProps {
  dashboards: Dashboard[];
  currentDashboardId: string;
}

export default function DashboardNavigation({
  dashboards,
  currentDashboardId,
}: DashboardNavigationProps) {
  return (
    <div className="mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 sm:mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2 sm:gap-3">
        {dashboards.map((dashboard) => {
          const isActive = dashboard.id.toString() === currentDashboardId;
          return (
            <Link
              key={Number(dashboard.id)}
              href={`/cordoba-en-datos/${dashboard.id}`}
              className={`
                shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:py-2.5 sm:text-sm
                ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-md"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }
              `}
            >
              {dashboard.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
