import { notFound } from "next/navigation";
import Link from "next/link";
import { getDashboardById, getAllDashboards } from "@/app/actions/dashboards";
import PowerBIEmbed from "@/components/cordoba/powerbi/PowerBIEmbed";
import DashboardNavigation from "@/components/cordoba/powerbi/DashboardNavigation";
import FadeIn from "@/components/ui/animation/FadeIn";

// Deshabilitar generación estática
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dashboard = await getDashboardById(parseInt(id));
  const allDashboards = await getAllDashboards();

  if (!dashboard) {
    notFound();
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Inicio
          </Link>
          {" > "}
          <Link
            href="/cordoba-en-datos"
            className="hover:text-emerald-600 transition-colors"
          >
            Córdoba en Datos
          </Link>
          {" > "}
          <span className="text-neutral-900 dark:text-neutral-100">
            {dashboard.name}
          </span>
        </nav>

        {/* Título y descripción */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
            {dashboard.name}
          </h1>
          {dashboard.description && (
            <p className="text-lg text-neutral-700 leading-relaxed">
              {dashboard.description}
            </p>
          )}
        </div>

        {/* Navegación entre dashboards */}
        <DashboardNavigation
          dashboards={allDashboards}
          currentDashboardId={id}
        />

        {/* Dashboard embebido */}
        <PowerBIEmbed embedUrl={dashboard.embed_url} title={dashboard.name} />

        {/* Botón para volver */}
        <div className="mt-8">
          <Link
            href="/cordoba-en-datos"
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a todos los dashboards
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}
