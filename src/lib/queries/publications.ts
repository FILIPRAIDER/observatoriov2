// src/lib/queries/publications.ts
import { prisma } from "@/lib/prisma";
import { slugify, deslugify } from "@/lib/slug";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60",
  "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=60",
];

function ddmmyyyy(date: Date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear());
  return `${d}/${m}/${y}`;
}

export type PublicationListDTO = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // dd/mm/yyyy
  img: string;
  alt: string;
  slug: string;
};

export async function getPublicationsPage(opts: {
  offset: number;
  limit: number;
}) {
  const { offset, limit } = opts;

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

  const items: PublicationListDTO[] = rows.map((r, idx) => {
    const img =
      r.images?.[0]?.url ??
      FALLBACKS[
        Number((r.id as unknown as bigint) % BigInt(FALLBACKS.length))
      ] ??
      FALLBACKS[idx % FALLBACKS.length];

    const date =
      r.publication_date instanceof Date
        ? ddmmyyyy(r.publication_date)
        : ddmmyyyy(new Date(r.publication_date as unknown as string));

    const title = r.title;
    const slug = slugify(title);

    return {
      id: r.id.toString(),
      title,
      excerpt: (r.abstract ?? "").trim(),
      tag: r.publication_types?.name ?? "Publicación",
      date,
      img,
      alt: r.images?.[0]?.alt ?? title,
      slug,
    };
  });

  return {
    items,
    hasMore: items.length === limit,
    nextOffset: offset + items.length,
  };
}

export type PublicationDetailDTO = {
  id: string;
  title: string;
  tag: string;
  dateISO: string;
  img: string;
  alt: string;
  excerpt?: string;
  // en el nuevo schema el contenido es un string completo
  content?: string;
  author?: { firstName: string; lastName: string; organization?: string };
  slug: string;
};

export async function getPublicationBySlugDB(
  slug: string
): Promise<PublicationDetailDTO | null> {
  const guess = deslugify(slug);

  const candidates = await prisma.publications.findMany({
    where: { title: { contains: guess } }, // MySQL suele ser case-insensitive por collation
    include: {
      publication_types: { select: { name: true } },
      authors: {
        select: { first_name: true, last_name: true, organization: true },
      },
      images: {
        take: 1,
        orderBy: [{ sort_order: "asc" }, { id: "asc" }],
        select: { url: true, alt: true },
      },
    },
    take: 20,
  });

  const row = candidates.find((r) => slugify(r.title) === slug);
  if (!row) return null;

  const img =
    row.images?.[0]?.url ??
    FALLBACKS[
      Number((row.id as unknown as bigint) % BigInt(FALLBACKS.length))
    ] ??
    FALLBACKS[0];

  const dateObj =
    row.publication_date instanceof Date
      ? row.publication_date
      : new Date(row.publication_date as unknown as string);

  return {
    id: row.id.toString(),
    title: row.title,
    tag: row.publication_types?.name ?? "Publicación",
    dateISO: dateObj.toISOString(),
    img,
    alt: row.images?.[0]?.alt ?? row.title,
    excerpt: row.abstract ?? "",
    content: row.content ?? "",
    author: row.authors
      ? {
          firstName: row.authors.first_name,
          lastName: row.authors.last_name,
          organization: row.authors.organization,
        }
      : undefined,
    slug,
  };
}
