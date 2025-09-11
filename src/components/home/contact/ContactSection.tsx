"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const MAP_CENTER: [number, number] = [-75.86842707819238, 8.766181023767054]; // [lng, lat]
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export default function ContactSection() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !token) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: MAP_CENTER,
      zoom: 14,
      attributionControl: false,
      cooperativeGestures: true,
    });
    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: false }),
      "bottom-right"
    );
    new mapboxgl.Marker({ color: "#0F766E" }).setLngLat(MAP_CENTER).addTo(map);

    // Asegura que el mapa tome el tamaño real del contenedor
    const onLoad = () => map.resize();
    map.on("load", onLoad);

    // Redimensiona cuando cambie el contenedor (por ejemplo, por diferencias de altura con el formulario)
    let ro: ResizeObserver | null = null;
    if (wrapRef.current && "ResizeObserver" in window) {
      ro = new ResizeObserver(() => map.resize());
      ro.observe(wrapRef.current);
    }
    const onWinResize = () => map.resize();
    window.addEventListener("resize", onWinResize);

    mapInstance.current = map;
    return () => {
      window.removeEventListener("resize", onWinResize);
      ro?.disconnect();
      map.off("load", onLoad);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  const cardClass =
    "rounded-3xl border border-gray-200 bg-white overflow-hidden";
  const inputClass =
    "w-full rounded-2xl bg-gray-100/70 px-4 py-3 text-[15px] outline-none ring-1 ring-transparent placeholder:text-gray-400 transition focus:bg-white focus:ring-emerald-600";

  return (
    <section
      id="Contactanos"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16"
    >
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Contáctanos</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Escríbenos para cualquier consulta o colaboración. ¡Estamos para
          ayudarte!
        </p>
      </div>

      {/* items-stretch hace que ambas columnas tengan la misma altura; el mapa la llena completa */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
        {/* MAPA: card a altura completa */}
        <div className={`${cardClass} h-full`}>
          {/* wrapper del mapa: altura total + una altura mínima para móviles */}
          <div
            ref={wrapRef}
            className="h-full min-h-[380px] sm:min-h-[440px] md:min-h-[520px] w-full"
          >
            {token ? (
              <div ref={mapRef} className="h-full w-full" />
            ) : (
              <iframe
                title="Mapa UCC Montería"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=-75.90%2C8.73%2C-75.85%2C8.77&layer=mapnik&marker=8.7517%2C-75.8779`}
                className="h-full w-full"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* FORMULARIO (sin cambios funcionales) */}
        <form noValidate className={`${cardClass} p-4 sm:p-6 md:p-8`}>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm text-gray-600">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-600">
                Correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@framer.com"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm text-gray-600">
                Número de teléfono
              </label>
              <input
                id="phone"
                name="phone"
                inputMode="tel"
                placeholder="+57"
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="service" className="text-sm text-gray-600">
                Servicio
              </label>
              <select
                id="service"
                name="service"
                className={inputClass}
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione uno
                </option>
                <option>Estudios</option>
                <option>Consultorías</option>
                <option>Proyectos de investigación</option>
                <option>Acompañamiento curricular</option>
                <option>Cursos / Diplomados</option>
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="message" className="text-sm text-gray-600">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Mensaje"
                className={inputClass}
              />
            </div>
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#17594A] px-6 py-3.5 text-white font-semibold hover:bg-emerald-800 transition"
              >
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
