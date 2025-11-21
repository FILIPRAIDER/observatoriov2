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
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-[36px]">
            Observatorio de la educación
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-700">
            Explora <span className="font-semibold text-emerald-700">datos y cifras</span>{" "}
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
