# 📘 Documentación Técnica del Proyecto - Parte 1: Información General

**Proyecto:** Observatorio Educativo v2  
**Repositorio:** observatoriov2 (FILIPRAIDER/observatoriov2)  
**Rama principal:** main  
**Fecha de documentación:** Noviembre 9, 2025  
**Versión:** 2.0.0

---

## 📋 Índice General

**PARTE 1 - INFORMACIÓN GENERAL** (Este documento)
- Resumen Ejecutivo
- Stack Tecnológico
- Requisitos del Sistema
- Estructura del Proyecto

**PARTE 2 - ARQUITECTURA Y BASE DE DATOS**
- Arquitectura de la Aplicación
- Modelo de Datos
- Schema de Prisma

**PARTE 3 - COMPONENTES Y FUNCIONALIDADES**
- Sistema de Publicaciones
- Componentes UI
- Server Actions

**PARTE 4 - CONFIGURACIÓN Y DEPLOYMENT**
- Variables de Entorno
- Scripts y Comandos
- Guía de Instalación
- Deployment

---

## 🎯 Resumen Ejecutivo

### Descripción del Proyecto

**Observatorio Educativo v2** es una plataforma web moderna desarrollada con Next.js 15 que presenta información, publicaciones y datos educativos del observatorio. El proyecto incluye:

- Sistema completo de gestión de publicaciones académicas
- Búsqueda y filtrado avanzado
- Soporte para múltiples tipos de publicaciones
- Sistema de descarga de documentos PDF
- Integración con ImageKit para gestión de imágenes
- Visualización de datos con Power BI
- Secciones informativas sobre el observatorio

### Objetivos Principales

1. **Difusión de Investigaciones**: Publicar y compartir investigaciones educativas
2. **Accesibilidad**: Proporcionar acceso fácil a documentos y estadísticas
3. **Categorización**: Organizar publicaciones por tipos y categorías
4. **Experiencia de Usuario**: Interfaz moderna, responsive y rápida

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.5.2 | Framework React con SSR y App Router |
| **React** | 19.1.0 | Librería de UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Framework de estilos utility-first |

### Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **MySQL** | - | Base de datos relacional |
| **Prisma** | 6.16.1 | ORM para Node.js y TypeScript |

### Librerías Principales

| Librería | Versión | Propósito |
|----------|---------|-----------|
| **framer-motion** | 12.23.12 | Animaciones y transiciones |
| **embla-carousel** | 8.6.0 | Carruseles y sliders |
| **swiper** | 11.2.10 | Carruseles avanzados |
| **clsx** | 2.1.1 | Utilidad para clases CSS condicionales |
| **mapbox-gl** | 3.15.0 | Mapas interactivos |
| **@react-google-maps/api** | 2.20.7 | Integración con Google Maps |

### Herramientas de Desarrollo

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **Bun** | >=1.1.0 | Runtime JavaScript y package manager |
| **ESLint** | 9.x | Linter de código |
| **PostCSS** | - | Procesador de CSS |

### Tipografías

- **Inter**: Fuente principal del sitio (Google Fonts)
- **Geist Mono**: Fuente monoespaciada para código

---

## 💻 Requisitos del Sistema

### Para Desarrollo

**Software Requerido:**
- **Node.js**: 20.x o superior (aunque se usa Bun)
- **Bun**: 1.1.0 o superior (recomendado)
- **MySQL**: 8.x o superior
- **Git**: Para control de versiones

**Opcional:**
- **VS Code**: Editor recomendado
- **MySQL Workbench**: Para gestión de base de datos

### Para Producción

**Servidor:**
- Soporte para Node.js 20+
- MySQL 8.x
- 2GB RAM mínimo (4GB recomendado)
- Conexión a servicios externos:
  - ImageKit (para imágenes)
  - Power BI (para visualizaciones)

---

## 📁 Estructura del Proyecto

### Vista General

```
observatoriov2/
├── 📄 Archivos de Configuración
│   ├── package.json              # Dependencias y scripts
│   ├── bun.lockb                 # Lockfile de Bun
│   ├── tsconfig.json             # Configuración TypeScript
│   ├── next.config.ts            # Configuración Next.js
│   ├── eslint.config.mjs         # Configuración ESLint
│   ├── postcss.config.mjs        # Configuración PostCSS
│   └── next-env.d.ts             # Types de Next.js
│
├── 📚 Documentación
│   ├── README.md                 # Readme básico
│   ├── GUIA_RAPIDA.md           # Guía de inicio rápido
│   ├── DOCUMENTACION_FRONTEND.md # Documentación de BD
│   ├── MEJORAS_PUBLICACIONES.md  # Documentación técnica
│   ├── RESUMEN_MEJORAS.md        # Resumen de mejoras
│   ├── BACKEND_MIGRATION_GUIDE.md
│   ├── MIGRACION_EXITOSA.md
│   ├── MIGRACION_VISUAL.md
│   └── CHANGELOG.md
│
├── 📂 prisma/
│   └── schema.prisma             # Schema de base de datos
│
├── 📂 database/
│   ├── README.md
│   ├── migrations/               # Migraciones SQL
│   │   ├── add_publication_fields.sql
│   │   ├── step1_add_pdf_url.sql
│   │   ├── verify_publications.sql
│   │   └── verify_types.sql
│   └── scripts/
│       └── migrate_publication_fields.php
│
├── 📂 public/                    # Archivos estáticos
│   ├── aliados/                  # Logos de aliados
│   ├── hero/                     # Imágenes del hero
│   ├── Logo.svg
│   ├── whoweare.jpg
│   └── [otros archivos SVG]
│
└── 📂 src/                       # Código fuente
    ├── app/                      # App Router de Next.js
    ├── components/               # Componentes React
    └── lib/                      # Utilidades y helpers
```

### Estructura Detallada de `/src`

```
src/
├── 📂 app/
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout raíz
│   │
│   ├── 📂 (obsv)/               # Grupo de rutas principal
│   │   ├── layout.tsx           # Layout con Navbar/Footer
│   │   ├── page.tsx             # Página de inicio
│   │   │
│   │   ├── 📂 cordoba-en-datos/
│   │   │   └── page.tsx         # Datos de Córdoba
│   │   │
│   │   └── 📂 publicaciones/    # Sistema de publicaciones
│   │       ├── loading.tsx      # Estado de carga
│   │       ├── page.tsx         # Lista de publicaciones
│   │       └── 📂 [slug]/
│   │           ├── page.tsx     # Detalle de publicación
│   │           └── 📂 related/
│   │               └── RelatedPublications.tsx
│   │
│   └── 📂 actions/               # Server Actions
│       ├── getFeaturedPublications.ts
│       └── publications.ts       # Acciones de publicaciones
│
├── 📂 components/
│   ├── index.ts                  # Exportaciones centralizadas
│   │
│   ├── 📂 cordoba/              # Córdoba en Datos
│   │   ├── CordobaEnDatosSection.tsx
│   │   └── 📂 powerbi/
│   │       └── PowerBIPlaceholder.tsx
│   │
│   ├── 📂 home/                 # Componentes del Home
│   │   ├── 📂 about/
│   │   │   └── WhoWeAre.tsx
│   │   ├── 📂 contact/
│   │   │   ├── ContactCta.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── 📂 faq/
│   │   │   └── Faq.tsx
│   │   ├── 📂 Hero/
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroCarousel.tsx
│   │   │   └── 📂 WhatWeDo/
│   │   │       └── WhatWeDo.tsx
│   │   ├── 📂 investigators/
│   │   │   └── Investigators.tsx
│   │   ├── 📂 partners/
│   │   │   └── PartnersMarquee.tsx
│   │   ├── 📂 publications/
│   │   │   └── FeaturedPublications.tsx
│   │   └── 📂 services/
│   │       └── Services.tsx
│   │
│   ├── 📂 publications/         # Sistema de publicaciones
│   │   ├── PDFDownloadButton.tsx
│   │   ├── PublicationCard.tsx
│   │   └── 📂 list/
│   │       ├── PublicationFilters.tsx    # ⭐ Búsqueda y filtros
│   │       ├── PublicationListItem.tsx   # ⭐ Card de lista
│   │       ├── PublicationListItemSkeleton.tsx
│   │       ├── PublicationsSection.tsx   # ⭐ Contenedor principal
│   │       └── PublicationStats.tsx      # ⭐ Estadísticas
│   │
│   └── 📂 ui/                   # Componentes UI reutilizables
│       ├── 📂 Accordion/
│       │   └── Accordion.tsx
│       ├── 📂 animation/
│       │   └── FadeIn.tsx
│       ├── 📂 footer/
│       │   └── Footer.tsx
│       ├── 📂 logo/
│       │   └── Logo.tsx
│       ├── 📂 navbar/
│       │   └── Navbar.tsx
│       └── 📂 sidebar/
│           └── Drawer.tsx
│
└── 📂 lib/                      # Utilidades y helpers
    ├── dates.ts                 # Formateo de fechas
    ├── faq.ts                   # Datos de FAQs
    ├── formatBytes.ts           # Formateo de tamaños de archivo
    ├── heroImages.ts            # Configuración de imágenes hero
    ├── prisma.ts                # Cliente de Prisma
    ├── publications.mock.ts     # Datos mock
    ├── services.ts              # Datos de servicios
    ├── slug.ts                  # Generación de slugs
    ├── whatWeDo.ts              # Datos "Qué hacemos"
    └── 📂 queries/
        └── publications.ts      # Queries de publicaciones
```

### Archivos Clave

#### Configuración

- **`package.json`**: Define dependencias, scripts y configuración del proyecto
- **`tsconfig.json`**: Configuración de TypeScript con paths `@/*`
- **`next.config.ts`**: Configuración de Next.js (imágenes remotas)
- **`prisma/schema.prisma`**: Schema completo de la base de datos

#### Aplicación

- **`src/app/layout.tsx`**: Layout raíz con fuentes e idioma
- **`src/app/(obsv)/layout.tsx`**: Layout con navegación y footer
- **`src/app/(obsv)/page.tsx`**: Página de inicio con todas las secciones
- **`src/lib/prisma.ts`**: Instancia singleton de Prisma Client

#### Publicaciones (Sistema Principal)

- **`src/app/actions/publications.ts`**: Server actions con lógica de negocio
- **`src/components/publications/list/PublicationsSection.tsx`**: Componente principal
- **`src/components/publications/list/PublicationFilters.tsx`**: Búsqueda y filtros
- **`src/components/publications/PDFDownloadButton.tsx`**: Descarga de PDFs

---

## 🎨 Convenciones de Código

### TypeScript

- Uso estricto de tipos (`strict: true`)
- Interfaces para props de componentes
- Types para modelos de datos
- Evitar `any`, usar `unknown` cuando sea necesario

### Componentes React

- Componentes funcionales con TypeScript
- Server Components por defecto (Next.js 15)
- Client Components solo cuando sea necesario (`'use client'`)
- Props tipadas explícitamente

### Estilos

- Tailwind CSS con utility classes
- Mobile-first approach
- Clases condicionales con `clsx`
- Variables CSS personalizadas en `globals.css`

### Nomenclatura

- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Componentes**: PascalCase
- **Funciones**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

---

## 📦 Scripts Disponibles

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "predev": "prisma generate",
  "prebuild": "prisma generate",
  "postinstall": "prisma generate",
  "prisma:generate": "prisma generate",
  "prisma:migrate:deploy": "prisma migrate deploy"
}
```

### Descripción de Scripts

- **`bun run dev`**: Inicia servidor de desarrollo con Turbopack
- **`bun run build`**: Construye la aplicación para producción
- **`bun run start`**: Inicia servidor de producción
- **`bun run lint`**: Ejecuta ESLint
- **`bun run prisma:generate`**: Genera el cliente de Prisma
- **`bun run prisma:migrate:deploy`**: Aplica migraciones en producción

---

**Continúa en:** DOCUMENTACION_TECNICA_PARTE2.md
