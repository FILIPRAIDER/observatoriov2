"use client";

import { useState } from "react";
import FadeIn from "@/components/ui/animation/FadeIn";
import PowerBIPlaceholder from "./powerbi/PowerBIPlaceholder";

const dashboards = [
  { value: "ventas", label: "Reporte de Ventas (demo)" },
  { value: "matricula", label: "Matrícula y cobertura" },
  { value: "desercion", label: "Deserción y permanencia" },
  { value: "infraestructura", label: "Infraestructura y conectividad" },
];

export default function CordobaEnDatosSection() {
  const [selected, setSelected] = useState(dashboards[0].value);
  const current = dashboards.find((d) => d.value === selected)?.label ?? "—";

  return (
    <FadeIn>
      <section className="w-full py-10 sm:py-12">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          {/* Título con color fuerte como en el mock */}
          <h1 className="text-2xl font-semibold text-neutral-900 sm:text-[26px] ">
            Observatorio de la educación
          </h1>

          {/* Frase en PILL con borde redondeado total */}
          <p
            className="
              mx-auto mt-3 inline-flex items-center justify-center
              rounded-full border border-neutral-200 bg-white px-4 py-1.5
              text-sm text-neutral-600 
              
            "
          >
            Explore <span className="px-1 font-semibold">datos y cifras</span>{" "}
            desde la primera infancia hasta la educación superior
          </p>
        </div>

        {/* Selector */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <label
            htmlFor="dashboard"
            className="text-sm font-medium text-neutral-600 "
          >
            Selecciona un Dashboard
          </label>

          <select
            id="dashboard"
            name="dashboard"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            aria-describedby="dashboard-help"
            className="
              w-[260px] rounded-lg border border-neutral-300 bg-white px-3 py-2
              text-sm text-neutral-800 outline-none transition
              hover:border-neutral-400 
              
            "
          >
            {dashboards.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <p id="dashboard-help" className="sr-only">
            El dashboard seleccionado se mostrará debajo.
          </p>
        </div>

        {/* Contenedor del dashboard (placeholder 16:9) */}
        <PowerBIPlaceholder
          titulo="Observatorio de la Educación — Dashboard"
          dashboard={current}
        />
      </section>
    </FadeIn>
  );
}
