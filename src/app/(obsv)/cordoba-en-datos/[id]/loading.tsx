export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 h-4 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />

        {/* Título skeleton */}
        <div className="mb-4 h-10 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />

        {/* Descripción skeleton */}
        <div className="mb-8 h-6 w-full rounded bg-neutral-200 dark:bg-neutral-800" />

        {/* Dashboard skeleton con aspect ratio 16:9 */}
        <div
          className="w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800"
          style={{ paddingBottom: "56.25%" }}
        />

        {/* Botón volver skeleton */}
        <div className="mt-8 h-6 w-48 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
