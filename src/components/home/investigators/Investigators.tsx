import Image from "next/image";

type Investigator = {
  name: string;
  role: string;
  src: string;
  alt?: string;
};

const INVESTIGATORS: Investigator[] = [
  {
    name: "Luis Fernando Alfonso Garzón",
    role: "Decano (E)",
    src: "/hero/inv1.webp",
  },
  {
    name: "Juan David Osorio Bustamante",
    role: "Coordinador",
    src: "/hero/inv2.webp",
  },
  {
    name: "Aura Esther Castillo Lozano",
    role: "Subdirectora",
    src: "/hero/inv3.webp",
  },
];

function InvestigatorCard({ person }: { person: Investigator }) {
  return (
    <article
      tabIndex={0}
      className="
        group relative
        w-full sm:w-[320px] lg:w-[347px] h-[440px]
        rounded-t-3xl overflow-hidden      /* ← solo esquinas de arriba */
        bg-neutral-100 shadow-sm
        focus:outline-none
      "
    >
      {/* La imagen llena el contenedor */}
      <Image
        src={person.src}
        alt={person.alt ?? person.name}
        fill
        className="object-cover" /* ← ocupa todo el ancho/alto */
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 320px, 347px"
        priority={false}
      />

      {/* Overlay que sube desde abajo */}
      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          translate-y-full group-hover:translate-y-0 group-focus:translate-y-0
          transition-transform duration-300 ease-out
        "
      >
        <div className="mx-2 mb-2 rounded-2xl bg-black/65 backdrop-blur-sm px-4 py-3 text-center text-white">
          <h3 className="text-sm sm:text-base font-extrabold">{person.name}</h3>
          <p className="text-xs sm:text-sm opacity-90">{person.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function Investigators() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Investigadores</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Conoce a los investigadores que han participado en los estudios y
          análisis del Observatorio de la educación en Córdoba.
        </p>
      </div>

      {/* Centrado de cards y 3 columnas en desktop */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
        {INVESTIGATORS.map((p) => (
          <InvestigatorCard key={p.name} person={p} />
        ))}
      </div>
    </section>
  );
}
