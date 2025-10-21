"use client";

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slug";
import PDFDownloadButton from "../PDFDownloadButton";

export type Publication = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // ej: "5/08/2025"
  img: string;
  alt: string;
  hasPdf?: boolean;
  pdfUrl?: string;
  pdfSize?: number;
  pdfName?: string;
  isFeatured?: boolean;
};

export default function PublicationListItem({
  title,
  excerpt,
  tag,
  date,
  img,
  alt,
  hasPdf,
  pdfUrl,
  pdfSize,
  pdfName,
  isFeatured,
}: Publication) {
  const slug = slugify(title);

  return (
    <article className="group rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {/* Imagen */}
        <Link
          href={`/publicaciones/${slug}`}
          className="relative w-full sm:w-[288px] h-[156px] sm:h-[168px] overflow-hidden rounded-xl"
        >
          <Image
            src={img}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 288px, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
          {/* Badge de destacado */}
          {isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-neutral-900 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
              ⭐ DESTACADO
            </div>
          )}
          {/* Badge de PDF */}
          {hasPdf && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-semibold shadow-sm flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              PDF
            </div>
          )}
        </Link>

        {/* Texto */}
        <div className="flex-1 flex flex-col">
          <Link href={`/publicaciones/${slug}`} className="flex-1">
            <h3 className="text-[18px] sm:text-[20px] font-semibold text-neutral-900 leading-snug underline-offset-2 group-hover:underline">
              {title}
            </h3>

            <p className="mt-2 text-[14px] leading-relaxed text-neutral-600 line-clamp-2">
              {excerpt}
            </p>
          </Link>

          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-[12px] font-medium text-white">
                {tag}
              </span>
              <span className="text-[12px] text-neutral-500">{date}</span>
            </div>

            {/* Botón de descarga de PDF */}
            {hasPdf && pdfUrl && (
              <PDFDownloadButton
                pdfUrl={pdfUrl}
                pdfName={pdfName}
                pdfSize={pdfSize}
                variant="compact"
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
