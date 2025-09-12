"use client";

import FadeIn from "@/components/ui/animation/FadeIn";
import PublicationListItem from "./PublicationListItem";
import { mockPublications } from "@/lib/publications.mock";

export default function PublicationsSection() {
  return (
    <FadeIn>
      <section className="w-full py-10 sm:py-12">
        {/* Título + subtítulo */}
        <div className="mb-8 text-center">
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-neutral-900">
            Publicaciones
          </h1>
          <p className="mt-2 text-[14px] text-neutral-600">
            Descubre los últimos análisis y tendencias en el sector educativo.
          </p>
        </div>

        {/* Barra superior: Buscador (estático como en el mock) */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <span className="text-[14px] text-neutral-600">Buscador</span>
          <button
            type="button"
            aria-label="Buscar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-5">
          {mockPublications.map((p) => (
            <PublicationListItem key={p.id} {...p} />
          ))}
        </div>

        {/* CTA: Ver más */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="rounded-xl bg-neutral-700 px-6 py-2 text-[14px] font-medium text-white"
          >
            Ver mas
          </button>
        </div>
      </section>
    </FadeIn>
  );
}
