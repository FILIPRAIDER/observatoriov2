import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getPublicationBySlug,
  mockPublications,
} from "@/lib/publications.mock";
import RelatedPublications from "./related/RelatedPublications";

interface Props {
  params: Promise<{ slug: string }>;
}

/** SEO dinámico por slug */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pub = getPublicationBySlug(slug);

  if (!pub) {
    return {
      title: "Publicación no encontrada — Observatorio",
      description: "La publicación no existe o fue movida.",
    };
  }

  const desc = pub.excerpt.replace(/\s+/g, " ").slice(0, 160);
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

/** Opcional: pre-render estático de los slugs mock */
export function generateStaticParams() {
  return mockPublications.map((p) => ({ slug: p.slug }));
}
// ---- helpers de fecha (reemplaza tus funciones actuales) ----
function parseDateFlexible(input: string | Date): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  const s = String(input ?? "").trim();
  if (!s) return null;

  // 1) ISO u otros que Date sí entienda
  const dISO = new Date(s);
  if (!isNaN(dISO.getTime())) return dISO;

  // 2) dd/mm/yyyy o d/m/yy
  const mSlash = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (mSlash) {
    const day = parseInt(mSlash[1], 10);
    const month = parseInt(mSlash[2], 10) - 1; // 0-based
    let year = parseInt(mSlash[3], 10);
    if (year < 100) year += 2000;
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  // 3) “5 de agosto de 2025”
  const mES = s.match(/^(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})$/i);
  if (mES) {
    const months: Record<string, number> = {
      enero: 0,
      febrero: 1,
      marzo: 2,
      abril: 3,
      mayo: 4,
      junio: 5,
      julio: 6,
      agosto: 7,
      septiembre: 8,
      setiembre: 8,
      octubre: 9,
      noviembre: 10,
      diciembre: 11,
    };
    const day = parseInt(mES[1], 10);
    const monthName = mES[2].toLowerCase();
    const year = parseInt(mES[3], 10);
    const month = months[monthName];
    if (month !== undefined) {
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
  }

  return null;
}

function formatDateLongSafe(value: string | Date): string {
  const d = parseDateFlexible(value);
  if (!d) return String(value); // fallback sin romper la UI
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug } = await params;
  const pub = getPublicationBySlug(slug);

  if (!pub) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link
          href="/publicaciones"
          className="inline-flex items-center gap-2 text-neutral-700"
        >
          {/* flecha */}
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

        {/* Tag + fecha bajo la imagen */}
        <div className="mt-2 flex items-center justify-between text-[13px]">
          <span className="text-neutral-500">{pub.tag}</span>
          <time className="text-neutral-500">
            {formatDateLongSafe(pub.date)}
          </time>
        </div>
      </div>

      {/* Título centrado */}
      <h1 className="mx-auto mt-6 max-w-4xl text-center text-[26px] sm:text-[32px] font-extrabold text-neutral-900 leading-tight">
        {pub.title}
      </h1>

      {/* Cuerpo demo (alineado a tu estilo) */}
      <article className="mx-auto mt-6 max-w-4xl text-[15px] leading-7 text-neutral-700">
        <p>
          <strong>La Universidad Cooperativa de Colombia</strong>, campus
          Montería hizo la presentación del Observatorio de la Educación en
          Córdoba, espacio de análisis, interpretación, reflexión y articulación
          sobre los principales indicadores y políticas públicas del sistema
          educativo en el departamento.
        </p>
        <p className="mt-4">
          Desde el observatorio también se consolidará información sobre temas
          de interés como la cobertura, deserción, empleabilidad y resultados de
          pruebas estandarizadas, generando productos que orienten la toma de
          decisiones en política educativa.
        </p>
        <p className="mt-4 italic">
          “Producto de la experiencia vivida en la universidad se hace el
          lanzamiento de este Observatorio con el propósito de mostrar la
          realidad de la educación superior a partir de las cifras que aparecen
          en los sistemas de información y el análisis que hacemos desde la
          Universidad con las entidades pertinentes…”
        </p>
        <p className="mt-4">
          El equipo académico y de consultoría articulará líneas de
          investigación en calidad educativa, cobertura, currículo, políticas y
          evaluación.
        </p>
      </article>

      {/* Relacionadas */}
      <RelatedPublications currentSlug={pub.slug} />
    </main>
  );
}
