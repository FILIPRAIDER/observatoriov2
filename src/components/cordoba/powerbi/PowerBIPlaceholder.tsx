"use client";

import FadeIn from "@/components/ui/animation/FadeIn";

type Props = {
  titulo?: string;
  dashboard?: string;
};

export default function PowerBIPlaceholder({
  titulo = "Área reservada para el dashboard",
  dashboard = "—",
}: Props) {
  return (
    <FadeIn>
      <section
        aria-label="Contenedor del dashboard"
        className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white shadow-sm dark:from-neutral-900 dark:to-neutral-950 dark:border-neutral-800"
        role="region"
      >
        {/* Mantiene relación 16:9 similar a un embed */}
        <div className="aspect-video w-full">
          {/* Fondo sutil con malla (solo con CSS arbitrario de Tailwind) */}
          <div className="absolute inset-0 [background:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:16px_16px] dark:[background:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)]" />

          {/* Overlay informativo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/80 px-3 py-1 text-xs text-neutral-600 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              Próximamente: Embed de Power BI
            </div>

            <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-100">
              {titulo}
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Seleccionado: <span className="font-medium">{dashboard}</span>
            </p>

            <p className="mt-4 max-w-[42ch] text-xs text-neutral-500 dark:text-neutral-400">
              Este contenedor mantiene proporción <b>16:9</b>. Cuando el embed
              esté listo, reemplazaremos este bloque por el iframe/componente de
              Power BI.
            </p>
          </div>

          {/* Barra inferior falsa para simular visor */}
          <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-neutral-200/80 bg-white/70 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60" />
        </div>
      </section>
    </FadeIn>
  );
}
