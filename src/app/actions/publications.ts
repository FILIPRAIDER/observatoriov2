"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";
import { slugify } from "@/lib/slug";

function ddmmyyyy(date: Date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear());
  return `${d}/${m}/${y}`;
}

const FALLBACKS = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=60",
];

export type PublicationsPageItem = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // dd/mm/yyyy
  img: string;
  alt: string;
  slug: string;
};

export type PublicationsPageResult = {
  items: PublicationsPageItem[];
  hasMore: boolean;
  nextOffset: number;
};

// caché por página (offset+limit)
function _pageCached(offset: number, limit: number) {
  return cache(
    async (): Promise<PublicationsPageResult> => {
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

        const dateObj =
          r.publication_date instanceof Date
            ? r.publication_date
            : new Date(r.publication_date as unknown as string);

        return {
          id: r.id.toString(),
          title: r.title,
          excerpt: (r.abstract ?? "").trim(),
          tag: r.publication_types?.name ?? "Publicación",
          date: ddmmyyyy(dateObj),
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
    [`publications:list:${offset}:${limit}`],
    {
      revalidate: 300, // 5 min (puedes bajar a 180 si quieres 3 min)
      tags: ["publications:list"],
    }
  )();
}

export async function fetchPublicationsPage(opts: {
  offset: number;
  limit: number;
}): Promise<PublicationsPageResult> {
  return _pageCached(opts.offset, opts.limit);
}
