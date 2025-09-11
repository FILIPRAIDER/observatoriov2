import Image from "next/image";

export default function WhoWeAre() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 lg:gap-12">
        {/* Texto */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ¿Quiénes Somos?
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700 max-w-[60ch]">
            El Observatorio de la Educación en Córdoba es un espacio de
            análisis, interpretación, reflexión y articulación sobre los
            principales indicadores y políticas públicas del sistema educativo
            en el departamento. Consolidamos información sobre temas como la
            cobertura en educación preescolar, básica y superior; deserción;
            empleabilidad; y resultados de Pruebas Saber 11 y Saber Pro en
            Córdoba. Con esta información, impulsamos estudios y proyectos de
            investigación que orientan la toma de decisiones relacionadas con
            las políticas públicas educativas.
          </p>
        </div>

        {/* Imagen */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* altura/relación para que no quede un bloque alto con mucho vacío */}
          <div className="relative aspect-[4/3] md:aspect-[16/11] lg:aspect-[3/2]">
            <Image
              src="/whoweare.jpg"
              alt="Equipo del Observatorio de la Educación en Córdoba"
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
