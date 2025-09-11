import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import { HERO_IMAGES } from "@/lib/heroImages";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 md:pt-10 mt-8">
      {/* Layout móvil: columna; desktop: dos columnas */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
        <div className="order-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
            Analizamos la educación en Córdoba para impulsar decisiones basadas
            en evidencia
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-prose">
            A través de la investigación, el análisis y la colaboración,
            generamos información útil para tomar mejores decisiones en el
            sistema educativo de Córdoba.
          </p>

          <div className="mt-5">
            <Link
              href="#Contactanos"
              className="inline-flex items-center rounded-full bg-[#17594A] px-5 py-2.5 text-white font-medium hover:bg-emerald-700 transition"
            >
              Contáctanos
            </Link>
          </div>
        </div>

        <div className="order-2">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}
