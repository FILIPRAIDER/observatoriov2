import { slugify } from "./slug";

export type PublicationMock = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  img: string;
  alt: string;
  slug: string;
};

const base: Omit<PublicationMock, "slug">[] = [
  {
    id: "p-01",
    title: "Cobertura Educación Superior en Córdoba: seguir aunando esfuerzos",
    excerpt:
      "El Observatorio de la Educación en Córdoba, analiza los indicadores del sistema educativo con la intención de monitorear aspectos claves y dar a conocer a la ciudadanía la realidad del departamento en términos educativos y posibles soluciones a implementar,",
    tag: "Educación",
    date: "12/12/2024",
    img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
    alt: "Estudiante caminando en campus",
  },
  {
    id: "p-02",
    title:
      "Universidad Cooperativa de Colombia, lanza el Observatorio de la Educación en Córdoba",
    excerpt:
      "La Universidad Cooperativa de Colombia, campus Montería hizo la presentación del Observatorio de la Educación en Córdoba, espacio de análisis, interpretación, reflexión y articulación sobre los principales indicadores y políticas públicas del sistema educativo en el departamento.",
    tag: "Noticia",
    date: "5/08/2025",
    img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    alt: "Grupo de estudiantes conversando",
  },
  {
    id: "p-03",
    title:
      "El Instituto de Estudios en Educación y el Centro de Consultoría de la universidad brindan apoyo a la Secretaría de Educación",
    excerpt:
      "El Instituto de Estudios en Educación y el Centro de Consultoría de la universidad brindan apoyo a la Secretaría de Educación Departamental en la estructuración del Plan Decenal de Educación 2024–2034.",
    tag: "Informe",
    date: "6/08/2025",
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop",
    alt: "Laboratorio con equipo tecnológico",
  },
  {
    id: "p-04",
    title:
      "Empleabilidad de graduados profesionales en Córdoba: la articulación es clave",
    excerpt:
      "Para el año 2023, en el departamento de Córdoba se graduaron 161 técnicos profesionales, 797 tecnólogos y 6.843 universitarios, según el SNIES; el 45% de las personas graduadas en universidades corresponden a...",
    tag: "Análisis",
    date: "11/06/2025",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    alt: "Biblioteca con estanterías curvadas",
  },
  {
    id: "p-05",
    title:
      "Tasas de deserción en educación superior en Córdoba: apostarles a la permanencia",
    excerpt:
      "Con base en información institucional y departamental, se analizan factores que influyen en el abandono y estrategias de permanencia.",
    tag: "Boletín",
    date: "20/05/2025",
    img: "https://images.unsplash.com/photo-1550418290-a8d86ad674a6?q=80&w=1600&auto=format&fit=crop",
    alt: "Grupo de estudiantes en aula",
  },
  {
    id: "p-06",
    title:
      "copia Universidad Cooperativa de Colombia, lanza el Observatorio de la Educación en Córdoba",
    excerpt:
      "La Universidad Cooperativa de Colombia presentó el Observatorio como un espacio de articulación para fortalecer la toma de decisiones en educación.",
    tag: "Noticia",
    date: "5/08/2025",
    img: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop",
    alt: "Estudiantes en pasillo universitario",
  },
];

export const mockPublications: PublicationMock[] = base.map((p) => ({
  ...p,
  slug: slugify(p.title),
}));

export function getPublicationBySlug(slug: string) {
  return mockPublications.find((p) => p.slug === slug);
}
