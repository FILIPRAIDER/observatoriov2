"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PublicationCardProps {
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  img: string;
  alt: string;
  slug: string;
  isFeatured?: boolean;
  hasPdf?: boolean;
  className?: string;
}

export default function PublicationCard({
  title,
  excerpt,
  tag,
  date,
  img,
  alt,
  slug,
  isFeatured = false,
  hasPdf = false,
  className = "",
}: PublicationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:shadow-lg hover:border-neutral-300 ${className}`}
    >
      <Link href={`/publicaciones/${slug}`} className="block">
        {/* Imagen */}
        <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
          <Image
            src={img}
            alt={alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badge destacado */}
          {isFeatured && (
            <div className="absolute top-3 right-3 rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-yellow-900 backdrop-blur-sm">
              ⭐ Destacado
            </div>
          )}

          {/* Badge PDF */}
          {hasPdf && (
            <div className="absolute bottom-3 left-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                <path d="M14 2v6h6M10 13h4M10 17h4M10 9h1"/>
              </svg>
              PDF
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          {/* Tag y fecha */}
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              {tag}
            </span>
            <time className="text-neutral-500">{date}</time>
          </div>

          {/* Título */}
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="line-clamp-3 text-sm text-neutral-600">
              {excerpt}
            </p>
          )}

          {/* Ver más */}
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
            <span>Leer más</span>
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
