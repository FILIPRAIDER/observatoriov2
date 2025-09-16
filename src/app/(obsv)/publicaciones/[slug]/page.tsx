import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublicationBySlugDB } from "@/lib/queries/publications";
import RelatedPublications from "./related/RelatedPublications";

// Meta dinámica
interface Props {
  params: Promise<{ slug: string }>;
}

function formatDateLongSafe(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pub = await getPublicationBySlugDB(slug);

  if (!pub) {
    return {
      title: "Publicación no encontrada — Observatorio",
      description: "La publicación no existe o fue movida.",
    };
  }

  const desc = (pub.excerpt ?? "").replace(/\s+/g, " ").slice(0, 160);
  return {
    title: `${pub.title} — Observatorio`,
    description: desc,
    openGraph: {
      title: pub.title,
      description: desc,
      type: "article",
      images: [{ url: pub.img }],
    },
  };
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug } = await params;
  const pub = await getPublicationBySlugDB(slug);

  if (!pub) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          href="/publicaciones"
          className="inline-flex items-center gap-2 text-neutral-700"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Volver a publicaciones
        </Link>
        <p className="mt-6 text-neutral-800">Publicación no encontrada.</p>
      </main>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link
        href="/publicaciones"
        className="inline-flex items-center gap-2 text-neutral-700"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Volver a publicaciones
      </Link>

      <div className="mx-auto mt-6 max-w-4xl">
        <div className="relative h-[220px] sm:h-[360px] w-full overflow-hidden rounded-2xl">
          <Image
            src={pub.img}
            alt={pub.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 896px, 100vw"
            priority
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[13px]">
          <span className="text-neutral-500">{pub.tag}</span>
          <time className="text-neutral-500">
            {formatDateLongSafe(pub.dateISO)}
          </time>
        </div>
      </div>

      <h1 className="mx-auto mt-6 max-w-4xl text-center text-[26px] sm:text-[32px] font-extrabold text-neutral-900 leading-tight">
        {pub.title}
      </h1>

      <article className="mx-auto mt-6 max-w-4xl text-[15px] leading-7 text-neutral-700">
        {pub.content && <p className="mb-4">{pub.content}</p>}
        {/* {pub.content?.map((b, i) => {
          if (!b.content) return null;
          if (b.kind === "quote") {
            return (
              <p key={i} className="mt-4 italic">
                {b.content}
              </p>
            );
          }
          return (
            <p key={i} className="mt-4">
              {b.content}
            </p>
          );
        })} */}
      </article>

      <RelatedPublications currentSlug={pub.slug} />
    </main>
  );
}
