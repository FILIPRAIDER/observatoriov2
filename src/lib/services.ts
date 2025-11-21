export type ServiceBlock = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  items: string[];
};

export const SERVICES: ServiceBlock[] = [
  {
    title: "Estudios",
    imageUrl: "/servicios/servicioEstudios.jpg",
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
    imageUrl: "/servicios/servicioConsultorías.jpg",
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
    imageUrl: "/servicios/servicioProyectosdeInvestigacion.jpg",
    imageAlt: "Trabajo de investigación en pizarra",
    items: [
      "Investigación sobre calidad educativa",
      "Insumos para políticas públicas",
      "Apoyo al aseguramiento de calidad",
    ],
  },
  {
    title: "Acompañamiento curriculares",
    imageUrl: "/servicios/servicioAcompañamientos.jpg",
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
    imageUrl: "/servicios/servicioCursosDiplomados.jpg",
    imageAlt: "Sesión formativa con docentes",
    items: [
      "Programas de formación a docentes",
      "Tendencias educativas actuales",
      "Convivencia escolar",
      "Rol del docente como mediador",
    ],
  },
];
