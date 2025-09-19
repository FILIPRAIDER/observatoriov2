// src/app/actions/getFeaturedPublications.ts
"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";
import { slugify } from "@/lib/slug";

export type Publication = {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string; // ISO (00:00:00Z)
  imageUrl: string;
  imageAlt?: string;
};

const FALLBACKS = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=60",
];

function _getFeatured(limit: number) {
  return cache(
    async () => {
      const rows = await prisma.publications.findMany({
        include: {
          publication_types: { select: { name: true } },
          images: {
            take: 1,
            orderBy: [{ sort_order: "asc" }, { id: "asc" }],
            select: { url: true, alt: true },
          },
        },
        orderBy: [{ publication_date: "desc" }, { id: "desc" }],
        take: limit,
      });

      return rows.map((r, idx): Publication => {
        const img =
          r.images?.[0]?.url ??
          FALLBACKS[
            Number((r.id as unknown as bigint) % BigInt(FALLBACKS.length))
          ] ??
          FALLBACKS[idx % FALLBACKS.length];

        // Prisma DATE -> ISO (UTC). Formatear SIEMPRE en UTC del lado UI.
        const iso =
          r.publication_date instanceof Date
            ? r.publication_date.toISOString()
            : new Date(r.publication_date as unknown as string).toISOString();

        return {
          id: r.id.toString(),
          slug: slugify(r.title),
          title: r.title,
          category: r.publication_types?.name ?? "Publicación",
          publishedAt: iso,
          imageUrl: img,
          imageAlt: r.images?.[0]?.alt ?? r.title,
        };
      });
    },
    [`publications:featured:${limit}`],
    { revalidate: 300, tags: ["publications:featured"] }
  )();
}

export async function getFeaturedPublications(limit = 4) {
  return _getFeatured(limit);
}
