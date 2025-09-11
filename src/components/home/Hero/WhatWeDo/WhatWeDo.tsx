import Accordion from "@/components/ui/Accordion/Accordion";
import { WHAT_WE_DO } from "@/lib/whatWeDo";

export default function WhatWeDo() {
  return (
    <section className="mx-auto max-w-7xl px-4 gap-10 min-h-[560px] md:min-h-[545px] py-10 md:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        {/* Columna izquierda */}
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-2">
            ¿Qué hacemos?
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
            ¿Qué hace el Observatorio de la Educación?
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-prose">
            Recopilamos, analizamos e interpretamos información clave sobre el
            sistema educativo, generando informes, visualizaciones interactivas
            y estrategias útiles para la toma de decisiones informadas en
            políticas públicas y procesos pedagógicos.
          </p>
        </div>

        {/* Columna derecha: acordeón */}
        <div>
          <Accordion
            items={WHAT_WE_DO.map((i) => ({
              title: i.title,
              content: i.content,
            }))}
            defaultOpen={0}
          />
        </div>
      </div>
    </section>
  );
}
