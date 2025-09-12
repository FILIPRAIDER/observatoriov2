import PublicationListItemSkeleton from "@/components/publications/list/PublicationListItemSkeleton";

export default function LoadingPublicaciones() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Encabezado */}
      <section className="w-full py-10 sm:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-neutral-900">
            Publicaciones
          </h1>
          <p className="mt-2 text-[14px] text-neutral-600">
            Descubre los últimos análisis y tendencias en el sector educativo.
          </p>
        </div>

        {/* Barra superior (buscador “estático”) */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <span className="text-[14px] text-neutral-600">Buscador</span>
          <div className="h-8 w-8 rounded-full border border-neutral-300" />
        </div>

        {/* Lista skeleton */}
        <div className="flex flex-col gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <PublicationListItemSkeleton key={i} />
          ))}
        </div>

        {/* CTA skeleton */}
        <div className="mt-10 flex justify-center">
          <div className="h-10 w-28 rounded-xl bg-neutral-200" />
        </div>
      </section>
    </main>
  );
}
