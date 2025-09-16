import { getFeaturedPublications } from "@/app/actions/getFeaturedPublications";
import PublicationCard from "@/components/publications/PublicationCard";

export default async function FeaturedPublications() {
  const pubs = await getFeaturedPublications(4); // ⬅️ pide exactamente 4

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 mt-30">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Publicaciones Destacadas
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Conoce los estudios y análisis más relevantes sobre educación en
          Córdoba. Investigaciones basadas en datos que buscan generar impacto y
          mejorar la calidad educativa.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pubs.map((p) => (
          <PublicationCard key={p.id} pub={p} />
        ))}
      </div>
    </section>
  );
}
