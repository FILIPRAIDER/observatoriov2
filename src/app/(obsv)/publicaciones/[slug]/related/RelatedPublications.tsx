import { getFeaturedPublications } from "@/app/actions/getFeaturedPublications";
import PublicationCard from "@/components/publications/PublicationCard";

export default async function RelatedPublications({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const pubs = await getFeaturedPublications();
  const filtered = pubs.filter((p) => p.slug !== currentSlug).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h2 className="mb-6 text-2xl sm:text-3xl font-extrabold">
        Mas Noticias relacionadas
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PublicationCard key={p.id} pub={p} />
        ))}
      </div>
    </section>
  );
}
