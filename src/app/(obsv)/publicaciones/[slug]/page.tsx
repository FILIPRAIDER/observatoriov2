import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPublicationBySlugDB } from "@/lib/queries/publications";
import RelatedPublications from "./related/RelatedPublications";
import { formatISOLongUTC } from "@/lib/dates"; // ⟵ ¡UTC-safe!

// Meta dinámica
interface Props {
  params: Promise<{ slug: string }>;
}

/** Renderiza párrafos y listas cuando hay “•” */
function ArticleBody({ text }: { text: string }) {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  if (!normalized) return null;

  // Cortamos en bloques por 1+ líneas en blanco
  const blocks = normalized.split(/\n{2,}/);

  return (
    <div className="mx-auto mt-6 max-w-4xl text-[15px] leading-7 text-neutral-700">
      {blocks.map((block, i) => {
        const hasBullets = block.includes("•");

        if (!hasBullets) {
          // Párrafo normal: respeta \n internos (líneas cortas)
          return (
            <p
              key={`p-${i}`}
              className={i === 0 ? "" : "mt-4"}
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {block}
            </p>
          );
        }

        // Hay viñetas con “•”. Separa texto inicial e items.
        const parts = block.split("•").map((s) => s.trim());
        const lead = parts.shift() ?? "";
        const items = parts
          .map((s) => s.replace(/^[\-\u2022]\s*/, "").trim())
          .filter(Boolean);

        return (
          <div key={`blk-${i}`} className={i === 0 ? "" : "mt-4"}>
            {lead && (
              <p
                className="mb-2"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {lead}
              </p>
            )}
            {items.length > 0 && (
              <ul className="list-disc pl-6 space-y-1">
                {items.map((it, j) => (
                  <li key={`li-${i}-${j}`} className="marker:text-neutral-700">
                    <span
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {it}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
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
      {/* Back */}
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

      {/* Imagen principal */}
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

        {/* Tag + fecha */}
        <div className="mt-2 flex items-center justify-between text-[13px]">
          <span className="text-neutral-500">{pub.tag}</span>
          <time className="text-neutral-500">
            {formatISOLongUTC(pub.dateISO)} {/* ⟵ fecha correcta en UTC */}
          </time>
        </div>
      </div>

      {/* Título */}
      <h1 className="mx-auto mt-6 max-w-4xl text-center text-[26px] sm:text-[32px] font-extrabold text-neutral-900 leading-tight">
        {pub.title}
      </h1>

      {/* Cuerpo (párrafos + listas) */}
      {pub.content ? <ArticleBody text={pub.content} /> : null}

      {/* Relacionadas */}
      <RelatedPublications currentSlug={pub.slug} />
    </main>
  );
}
