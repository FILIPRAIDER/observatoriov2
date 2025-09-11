"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const LOGOS = [
  { src: "/aliados/alcaldia.png", alt: "Alcaldía de Montería" },
  { src: "/aliados/ademacor.svg", alt: "ADEMACOR" },
  { src: "/aliados/gobernacion.png", alt: "Gobernación de Córdoba" },
];

function LogoBox({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-12 sm:h-14 md:h-16 lg:h-20 w-full items-center justify-center">
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
    </div>
  );
}

export default function PartnersMarquee() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: "trimSnaps", // evita micro solapes en bordes
    },
    [
      AutoScroll({
        playOnInit: true,
        stopOnMouseEnter: false,
        stopOnInteraction: false,
        speed: 1.0, // ← más despacio
      }),
    ]
  );

  // duplicamos para densidad y uniones suaves
  const ITEMS = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Organizaciones Aliadas
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Colaboramos con instituciones académicas, entidades gubernamentales y
          organizaciones privadas para fortalecer la educación en Córdoba.
        </p>
      </div>

      <div className="relative mt-8 bg-white">
        {/* fades laterales */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="overflow-hidden" ref={emblaRef}>
          {/* track sin gap; cada slide tiene su propio margen */}
          <div className="flex will-change-transform">
            {ITEMS.map((l, i) => (
              <div
                key={`${l.src}-${i}`}
                className="
                  shrink-0
                  basis-[160px] sm:basis-[180px] md:basis-[200px] lg:basis-[220px]
                  mr-10 md:mr-12          /* separación controlada slide a slide */
                "
              >
                <LogoBox src={l.src} alt={l.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
