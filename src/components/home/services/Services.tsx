import Image from "next/image";
import { SERVICES } from "@/lib/services";

function ServiceCard({
  title,
  imageUrl,
  imageAlt,
  items,
}: (typeof SERVICES)[number]) {
  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
          className="object-cover grayscale"
        />
      </div>

      <h3 className="text-xl font-extrabold">{title}</h3>

      <ul className="space-y-2">
        {items.map((txt, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
            <Image
              src="/checkservices.svg"
              alt=""
              width={18}
              height={18}
              className="mt-0.5 shrink-0"
            />
            <span>{txt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ServicesSection() {
  // Garantiza que sean 5 (por si el array cambia)
  const blocks = SERVICES.slice(0, 5);

  return (
    <section
      id="services"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16"
    >
      {/* Grid 3 columnas × 2 filas en lg; incluye el bloque de texto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {/* Celda 1: texto “Nuestros Servicios …” */}
        <div>
          <h2 className="text-2xl md:text-2xl font-extrabold leading-tight">
            Nuestros{" "}
            <span className="rounded-full bg-[#17594A] px-3 py-1 text-white">
              Servicios
            </span>{" "}
            para el <br className="hidden sm:block" />
            Fortalecimiento Educativo
          </h2>
          <p className="mt-4 text-gray-600">
            Desde el Observatorio de Educación ofrecemos servicios que
            fortalecen la toma de decisiones, mejoran la calidad educativa y
            promueven la formación continua, con un enfoque basado en evidencia
            e innovación.
          </p>
        </div>

        {/* Celdas 2..6: los 5 servicios */}
        {blocks.map((s) => (
          <ServiceCard key={s.title} {...s} />
        ))}
      </div>
    </section>
  );
}
