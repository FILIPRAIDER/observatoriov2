// src/app/actions/publications.ts
"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";
import { toYMD, ymdToDMY } from "@/lib/dates";

export type PublicationsPageItem = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // dd/mm/yyyy (derivado de YYYY-MM-DD, sin problemas de tz)
  img: string;
  alt: string;
  slug: string;
};

export type PublicationsPageResult = {
  items: PublicationsPageItem[];
  hasMore: boolean;
  nextOffset: number;
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Fallbacks por si alguna publicación aún no tiene imagen
const FALLBACKS = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=60",
];

export async function fetchPublicationsPage({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}): Promise<PublicationsPageResult> {
  // clave dinámica por página
  const key = `publications:list:${offset}:${limit}`;

  const run = cache(
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
        skip: offset,
        take: limit,
      });

      const items: PublicationsPageItem[] = rows.map((r, idx) => {
        const img =
          r.images?.[0]?.url ??
          FALLBACKS[
            Number((r.id as unknown as bigint) % BigInt(FALLBACKS.length))
          ] ??
          FALLBACKS[idx % FALLBACKS.length];

        // ⚠️ aquí el fix: tomamos 'YYYY-MM-DD' en UTC y lo convertimos a dd/mm/yyyy
        const ymd = toYMD(r.publication_date);
        const dateDMY = ymdToDMY(ymd);

        return {
          id: r.id.toString(), // único y estable
          title: r.title,
          excerpt: (r.abstract ?? "").trim(),
          tag: r.publication_types?.name ?? "Publicación",
          date: dateDMY,
          img,
          alt: r.images?.[0]?.alt ?? r.title,
          slug: slugify(r.title),
        };
      });

      return {
        items,
        hasMore: items.length === limit,
        nextOffset: offset + items.length,
      };
    },
    [key],
    { revalidate: 300, tags: ["publications:list"] } // 5 min
  );

  return run();
}
