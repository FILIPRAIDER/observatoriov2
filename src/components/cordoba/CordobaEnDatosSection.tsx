import FadeIn from "@/components/ui/animation/FadeIn";
import DashboardCard from "./powerbi/DashboardCard";
import { getAllDashboards } from "@/app/actions/dashboards";

export default async function CordobaEnDatosSection() {
  const dashboards = await getAllDashboards();

  return (
    <FadeIn>
      <section className="w-full py-10 sm:py-12">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 sm:text-[26px] dark:text-neutral-100">
            Observatorio de la educación
          </h1>

          <p className="mx-auto mt-3 inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            Explore <span className="px-1 font-semibold">datos y cifras</span>{" "}
            desde la primera infancia hasta la educación superior
          </p>
        </div>

        {/* Grid de dashboards */}
        {dashboards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {dashboards.map((dashboard) => (
              <DashboardCard key={Number(dashboard.id)} dashboard={dashboard} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-neutral-600 dark:text-neutral-400">
              No hay dashboards disponibles en este momento.
            </p>
          </div>
        )}
      </section>
    </FadeIn>
  );
}
