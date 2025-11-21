"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Dashboard } from "@/types/powerbi";

/**
 * Obtiene todos los dashboards activos ordenados por sort_order
 * Implementa caché de 1 hora
 */
export const getAllDashboards = cache(async (): Promise<Dashboard[]> => {
  const dashboards = await prisma.powerbi_dashboards.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      sort_order: "asc",
    },
  });

  return dashboards as Dashboard[];
});

/**
 * Obtiene dashboards filtrados por categoría
 */
export const getDashboardsByCategory = cache(
  async (category: string): Promise<Dashboard[]> => {
    const dashboards = await prisma.powerbi_dashboards.findMany({
      where: {
        is_active: true,
        category: category,
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    return dashboards as Dashboard[];
  }
);

/**
 * Obtiene un dashboard específico por ID
 */
export const getDashboardById = cache(
  async (id: number): Promise<Dashboard | null> => {
    const dashboard = await prisma.powerbi_dashboards.findFirst({
      where: {
        id: BigInt(id),
        is_active: true,
      },
    });

    return dashboard as Dashboard | null;
  }
);

/**
 * Obtiene un dashboard por report_id de Power BI
 */
export const getDashboardByReportId = cache(
  async (reportId: string): Promise<Dashboard | null> => {
    const dashboard = await prisma.powerbi_dashboards.findFirst({
      where: {
        report_id: reportId,
        is_active: true,
      },
    });

    return dashboard as Dashboard | null;
  }
);

/**
 * Obtiene los primeros 3 dashboards destacados para mostrar en home
 */
export const getFeaturedDashboards = cache(async (): Promise<Dashboard[]> => {
  const dashboards = await prisma.powerbi_dashboards.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      sort_order: "asc",
    },
    take: 3,
  });

  return dashboards as Dashboard[];
});
