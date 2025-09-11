"use server";

export type Publication = {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedAt: string; // ISO date
  imageUrl: string;
  imageAlt?: string;
};

// FICTICIO por ahora: cámbialo luego por Prisma
export async function getFeaturedPublications(): Promise<Publication[]> {
  return [
    {
      id: "1",
      slug: "lanzamiento-observatorio-educacion-cordoba",
      title:
        "Universidad Cooperativa de Colombia lanza el Observatorio de la Educación en Córdoba",
      category: "Noticia",
      publishedAt: "2025-08-05",
      imageUrl:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=60",
      imageAlt: "Estudiantes conversando en campus",
    },
    {
      id: "2",
      slug: "cobertura-educacion-superior-cordoba",
      title:
        "Cobertura Educación Superior en Córdoba: seguir aunando esfuerzos",
      category: "Educación",
      publishedAt: "2024-12-12",
      imageUrl:
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=60",
      imageAlt: "Camino en campus universitario",
    },
    {
      id: "3",
      slug: "empleabilidad-graduados-cordoba-articulacion",
      title:
        "Empleabilidad de graduados profesionales en Córdoba: la articulación es clave",
      category: "Análisis",
      publishedAt: "2025-06-11",
      imageUrl:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=60",
      imageAlt: "Estantes de biblioteca",
    },
    {
      id: "4",
      slug: "infraestructura-escolar-rural-brechas-oportunidades",
      title: "Acceso a infraestructura escolar rural: brechas y oportunidades",
      category: "Reporte",
      publishedAt: "2025-04-23",
      imageUrl:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=60",
      imageAlt: "Computadoras en sala de estudio",
    },
  ];
}
