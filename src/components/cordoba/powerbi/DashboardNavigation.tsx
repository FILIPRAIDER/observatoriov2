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
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-3 pb-2">
        {dashboards.map((dashboard) => {
          const isActive = dashboard.id.toString() === currentDashboardId;
          return (
            <Link
              key={Number(dashboard.id)}
              href={`/cordoba-en-datos/${dashboard.id}`}
              className={`
                shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all
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
