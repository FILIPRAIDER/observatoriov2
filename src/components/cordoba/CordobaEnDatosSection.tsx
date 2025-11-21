import FadeIn from "@/components/ui/animation/FadeIn";
import DashboardCard from "./powerbi/DashboardCard";
import DashboardSearch from "./powerbi/DashboardSearch";
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

        {/* Buscador */}
        {dashboards.length > 0 && <DashboardSearch dashboards={dashboards} />}
      </section>
    </FadeIn>
  );
}
