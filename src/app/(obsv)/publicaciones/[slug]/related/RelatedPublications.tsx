import { getFeaturedPublications } from "@/app/actions/getFeaturedPublications";
import PublicationCard from "@/components/publications/PublicationCard";

export default async function RelatedPublications({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const pubs = await getFeaturedPublications(4);
  const filtered = pubs.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 mt-16 border-t border-neutral-200">
      <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-neutral-900">
        Más publicaciones
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PublicationCard key={p.id} pub={p} />
        ))}
      </div>
    </section>
  );
}
