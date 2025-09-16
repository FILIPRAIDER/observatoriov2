"use client";

import { useRef, useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, A11y } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

type Slide = { src: string; alt?: string };

const FALLBACK: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=70",
    alt: "Campus y estudiantes",
  },
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70",
    alt: "Trabajo colaborativo",
  },
  {
    src: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=70",
    alt: "Biblioteca universitaria",
  },
];

export default function HeroCarousel({
  slides = FALLBACK,
}: {
  slides?: Slide[];
}) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const uid = useId();

  return (
    <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl">
      {/* Flecha izquierda (sutil, sin fondo) */}
      <button
        ref={prevRef}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 p-2 text-white/60 hover:text-white transition cursor-pointer"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" className="drop-shadow">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Flecha derecha (sutil, sin fondo) */}
      <button
        ref={nextRef}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 p-2 text-white/60 hover:text-white transition cursor-pointer"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" className="drop-shadow">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Swiper
        modules={[Autoplay, Navigation, A11y]}
        autoplay={{ delay: 3800, disableOnInteraction: false }}
        loop
        speed={600}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper: SwiperInstance) => {
          // navigation puede ser boolean | NavigationOptions → hacemos type guard
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        onInit={(swiper) => {
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="w-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={`${uid}-${i}`}>
            {/* Alturas que pediste */}
            <div className="relative flex h-[200px] sm:h-[260px] md:h-[360px] lg:h-[420px] items-center justify-center bg-neutral-100">
              <Image
                src={s.src}
                alt={s.alt ?? `Slide ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
