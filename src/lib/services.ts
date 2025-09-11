export type ServiceBlock = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  items: string[];
};

export const SERVICES: ServiceBlock[] = [
  {
    title: "Estudios",
    imageUrl:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Personas analizando datos en computador",
    items: [
      "Empleabilidad de egresados.",
      "Resultados de pruebas Saber.",
      "Estudios sobre cobertura educativa.",
      "Tasas de deserción escolar.",
      "Vocación educativa territorial.",
      "Oferta académica vs necesidades.",
    ],
  },
  {
    title: "Consultorías",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Equipo de consultores trabajando",
    items: [
      "Trayectorias educativas",
      "Evaluación de resultados",
      "Impacto de políticas educativas",
      "Planes de formación docente",
    ],
  },
  {
    title: "Proyectos de investigación",
    imageUrl:
      "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Trabajo de investigación en pizarra",
    items: [
      "Investigación sobre calidad educativa",
      "Insumos para políticas públicas",
      "Apoyo al aseguramiento de calidad",
    ],
  },
  {
    title: "Acompañamiento curriculares",
    imageUrl:
      "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Docentes revisando documentos",
    items: [
      "Revisión de proyectos educativos",
      "Currículos integradores",
      "Aplicación del enfoque STEAM",
      "Mejora de calidad educativa",
    ],
  },
  {
    title: "Cursos, seminarios y diplomados",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=60",
    imageAlt: "Sesión formativa con docentes",
    items: [
      "Programas de formación a docentes",
      "Tendencias educativas actuales",
      "Convivencia escolar",
      "Rol del docente como mediador",
    ],
  },
];
