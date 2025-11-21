# 📘 Documentación Técnica del Proyecto - Parte 4: Configuración y Deployment

**Proyecto:** Observatorio Educativo v2  
**Fecha:** Noviembre 9, 2025

---

## 📚 Sistema de Publicaciones

### Visión General

El sistema de publicaciones es el módulo principal del proyecto. Incluye:

- ✅ Lista paginada de publicaciones
- ✅ Búsqueda en tiempo real con debounce
- ✅ Filtros múltiples (tipo, destacadas, con PDF)
- ✅ Página de detalle con información completa
- ✅ Descarga de PDFs con información de tamaño
- ✅ Badges visuales (destacado, PDF disponible)
- ✅ Responsive design
- ✅ Optimización de imágenes con ImageKit

---

## 🎯 Server Actions

### Archivo: `src/app/actions/publications.ts`

#### Types Principales

```typescript
export type PublicationsPageItem = {
  id: bigint;
  slug: string;
  title: string;
  abstract: string;
  publicationDate: string; // ISO
  category: string;
  categoryColor: string | null;
  authorName: string;
  authorOrg: string;
  imageUrl: string;
  imageAlt: string | null;
  hasPdf: boolean;
  pdfUrl: string | null;
  pdfName: string | null;
  pdfSize: bigint | null;
  isFeatured: boolean;
};

export type PublicationsPageResult = {
  items: PublicationsPageItem[];
  total: number;
  hasMore: boolean;
};

export type PublicationsFilters = {
  search?: string;
  typeId?: string;
  onlyWithPdf?: boolean;
  onlyFeatured?: boolean;
};
```

#### Función Principal: `fetchPublicationsPage`

```typescript
export async function fetchPublicationsPage({
  offset = 0,
  limit = 6,
  filters = {},
}: {
  offset?: number;
  limit?: number;
  filters?: PublicationsFilters;
}): Promise<PublicationsPageResult>
```

**Características:**
- Caché con React `cache()`
- Filtrado dinámico (búsqueda, tipo, PDF, destacadas)
- Paginación con offset/limit
- Generación automática de slugs
- Imágenes de fallback
- Transformación de datos para el frontend

**Lógica de Filtrado:**

```typescript
// Búsqueda en título, abstract y keywords
if (filters.search) {
  where.OR = [
    { title: { contains: filters.search, mode: 'insensitive' } },
    { abstract: { contains: filters.search, mode: 'insensitive' } },
    { keywords: { contains: filters.search, mode: 'insensitive' } }
  ];
}

// Filtrar por tipo
if (filters.typeId) {
  where.publication_type_id = BigInt(filters.typeId);
}

// Solo con PDF
if (filters.onlyWithPdf) {
  where.pdf_url = { not: null };
}

// Solo destacadas
if (filters.onlyFeatured) {
  where.is_featured = true;
}
```

---

### Archivo: `src/app/actions/getFeaturedPublications.ts`

#### Función: `getFeaturedPublications`

```typescript
export async function getFeaturedPublications(limit = 4): Promise<Publication[]>
```

**Propósito:** Obtener publicaciones destacadas para el home

**Características:**
- Filtra por `is_featured = true`
- Orden por fecha descendente
- Límite configurable (default: 4)
- Fallback a publicaciones recientes si no hay destacadas
- Caché con `unstable_cache`

---

## 🧩 Componentes Principales

### 1. PublicationsSection (Contenedor Principal)

**Ruta:** `src/components/publications/list/PublicationsSection.tsx`

**Tipo:** Client Component (`'use client'`)

**Responsabilidades:**
- Gestión del estado de filtros
- Paginación (scroll infinito)
- Llamadas a server actions
- Estados de carga

**Props:**
```typescript
{
  initialTypes: Array<{ id: string; name: string; color: string | null }>;
}
```

**Estados:**
```typescript
const [filters, setFilters] = useState<PublicationsFilters>({});
const [publications, setPublications] = useState<PublicationsPageItem[]>([]);
const [offset, setOffset] = useState(0);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);
```

**Funciones clave:**
```typescript
// Cargar publicaciones
const loadPublications = async (reset = false) => { ... }

// Cargar más (scroll infinito)
const loadMore = () => { ... }

// Cambiar filtros
const handleFilterChange = (newFilters: PublicationsFilters) => { ... }
```

---

### 2. PublicationFilters (Búsqueda y Filtros)

**Ruta:** `src/components/publications/list/PublicationFilters.tsx`

**Tipo:** Client Component

**Responsabilidades:**
- Input de búsqueda con debounce
- Dropdown de tipos
- Checkboxes (PDF, destacadas)
- Gestión de filtros activos
- Badges de filtros activos

**Props:**
```typescript
{
  types: Array<{ id: string; name: string; color: string | null }>;
  filters: PublicationsFilters;
  onFilterChange: (filters: PublicationsFilters) => void;
  totalResults: number;
}
```

**Características:**
- Debounce de 300ms en búsqueda
- Panel colapsable de filtros
- Contador de filtros activos
- Botón "Limpiar todo"
- Badges de filtros con opción de eliminar individual

**Estructura visual:**
```
┌──────────────────────────────────────────┐
│  🔍 Buscar...                  [Filtros] │
├──────────────────────────────────────────┤
│  [Panel de Filtros - Colapsable]         │
│  ┌────────────────────────────────────┐  │
│  │ Tipo: [Dropdown ▼]               │  │
│  │ ☐ Solo con PDF disponible         │  │
│  │ ☐ Solo destacados                 │  │
│  │ [Limpiar todo]                     │  │
│  └────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│  Filtros activos:                         │
│  [Búsqueda: "educación" ✕]               │
│  [Tipo: Informe ✕]  [Con PDF ✕]          │
└──────────────────────────────────────────┘
```

---

### 3. PublicationListItem (Card de Publicación)

**Ruta:** `src/components/publications/list/PublicationListItem.tsx`

**Tipo:** Client Component

**Responsabilidades:**
- Mostrar información de publicación
- Badges visuales (destacado, PDF)
- Link a página de detalle
- Botón de descarga PDF

**Props:**
```typescript
{
  pub: PublicationsPageItem;
}
```

**Elementos visuales:**

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │  [Imagen con badges]         │   │
│  │  ⭐ DESTACADO    📄 PDF      │   │
│  └─────────────────────────────┘   │
│                                      │
│  [Badge Tipo]                        │
│  Título de la Publicación            │
│                                      │
│  Autor • Organización                │
│  📅 dd/mm/yyyy    [📄 PDF (2MB)]    │
│                                      │
│  Resumen truncado...                 │
│                                      │
│  [Leer más →]                        │
└─────────────────────────────────────┘
```

**Código de badges:**

```tsx
{/* Badge de destacado */}
{pub.isFeatured && (
  <div className="absolute top-2 left-2 bg-yellow-400 text-neutral-900 ...">
    ⭐ DESTACADO
  </div>
)}

{/* Badge de PDF */}
{pub.hasPdf && (
  <div className="absolute top-2 right-2 bg-red-600 text-white ...">
    📄 PDF
  </div>
)}
```

---

### 4. PDFDownloadButton (Botón de Descarga)

**Ruta:** `src/components/publications/PDFDownloadButton.tsx`

**Tipo:** Client Component

**Responsabilidades:**
- Mostrar botón de descarga
- Formatear tamaño de archivo
- Tres variantes visuales

**Props:**
```typescript
{
  pdfUrl: string;
  pdfName: string;
  pdfSize?: bigint | null;
  variant?: 'default' | 'compact' | 'card';
  className?: string;
}
```

**Variantes:**

#### 1. Default (Botón grande)
```tsx
<PDFDownloadButton 
  pdfUrl="..." 
  pdfName="..." 
  variant="default" 
/>
```
Uso: Página de detalle, CTAs principales

#### 2. Compact (Link pequeño)
```tsx
<PDFDownloadButton 
  pdfUrl="..." 
  pdfName="..." 
  variant="compact" 
/>
```
Uso: Cards de listado, espacios reducidos

#### 3. Card (Tarjeta visual)
```tsx
<PDFDownloadButton 
  pdfUrl="..." 
  pdfName="..." 
  variant="card" 
/>
```
Uso: Página de detalle, destacar descarga

---

### 5. PublicationStats (Estadísticas)

**Ruta:** `src/components/publications/list/PublicationStats.tsx`

**Tipo:** Server Component

**Responsabilidades:**
- Mostrar total de publicaciones
- Mostrar mensaje cuando no hay resultados
- Separador visual

**Props:**
```typescript
{
  total: number;
}
```

---

## 📄 Páginas del Sistema

### 1. Lista de Publicaciones

**Ruta:** `src/app/(obsv)/publicaciones/page.tsx`

**Tipo:** Server Component

**Código:**
```tsx
export default async function PublicacionesPage() {
  const types = await prisma.publication_types.findMany({
    select: {
      id: true,
      name: true,
      color: true,
    },
    orderBy: {
      sort_order: 'asc',
    },
  });

  const typesForClient = types.map((t) => ({
    id: String(t.id),
    name: t.name,
    color: t.color,
  }));

  return (
    <main>
      <section>
        <h1>Publicaciones</h1>
        <PublicationsSection initialTypes={typesForClient} />
      </section>
    </main>
  );
}
```

---

### 2. Detalle de Publicación

**Ruta:** `src/app/(obsv)/publicaciones/[slug]/page.tsx`

**Tipo:** Server Component con Dynamic Metadata

**Características:**
- Metadata dinámica (SEO)
- Contenido HTML sanitizado
- Información completa del autor
- Keywords como badges
- Fechas importantes (si aplica)
- Botón de descarga PDF (si aplica)
- URL externa (si aplica)
- Publicaciones relacionadas

**Estructura:**

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  // Genera metadata para SEO
}

export default async function PublicacionPage({ params }) {
  // 1. Buscar publicación por slug
  const publication = await findPublicationBySlug(params.slug);
  
  // 2. Renderizar
  return (
    <article>
      {/* Hero con imagen */}
      {/* Información principal */}
      {/* Contenido HTML */}
      {/* PDF Download (si aplica) */}
      {/* Fechas importantes (si aplica) */}
      {/* URL externa (si aplica) */}
      {/* Publicaciones relacionadas */}
    </article>
  );
}
```

**Renderizado de HTML:**
```tsx
<div
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(publication.content) 
  }}
/>
```

---

## 🎨 Componentes de UI Reutilizables

### Accordion

**Ruta:** `src/components/ui/Accordion/Accordion.tsx`

**Uso:** FAQs, secciones colapsables

```tsx
<Accordion title="¿Qué es el observatorio?">
  <p>Contenido...</p>
</Accordion>
```

---

### FadeIn (Animación)

**Ruta:** `src/components/ui/animation/FadeIn.tsx`

**Uso:** Animaciones de entrada con Framer Motion

```tsx
<FadeIn delay={0.2}>
  <Component />
</FadeIn>
```

---

### Footer

**Ruta:** `src/components/ui/footer/Footer.tsx`

**Contenido:**
- Logo
- Enlaces a secciones
- Redes sociales
- Copyright

---

### Navbar

**Ruta:** `src/components/ui/navbar/Navbar.tsx`

**Características:**
- Responsive
- Drawer mobile
- Links de navegación
- Logo

---

## 🏠 Componentes del Home

### Hero

**Ruta:** `src/components/home/Hero/Hero.tsx`

**Características:**
- Carrusel de imágenes de fondo
- Título principal
- Call to action

---

### WhoWeAre (Quiénes Somos)

**Ruta:** `src/components/home/about/WhoWeAre.tsx`

**Contenido:**
- Texto descriptivo
- Imagen
- Animaciones

---

### Services (Servicios)

**Ruta:** `src/components/home/services/Services.tsx`

**Contenido:**
- Grid de servicios
- Iconos
- Descripciones

---

### FeaturedPublications (Publicaciones Destacadas)

**Ruta:** `src/components/home/publications/FeaturedPublications.tsx`

**Características:**
- Muestra últimas 4 publicaciones destacadas
- Usa `PublicationCard`
- Link a página completa

---

### PartnersMarquee (Aliados)

**Ruta:** `src/components/home/partners/PartnersMarquee.tsx`

**Características:**
- Carrusel automático
- Logos de aliados
- Loop infinito

---

### FAQ

**Ruta:** `src/components/home/faq/Faq.tsx`

**Características:**
- Lista de preguntas frecuentes
- Usa componente `Accordion`

---

### ContactSection

**Ruta:** `src/components/home/contact/ContactSection.tsx`

**Contenido:**
- Mapa (Google Maps o Mapbox)
- Información de contacto
- Formulario (si aplica)

---

## 🛠️ Utilidades (lib/)

### dates.ts

```typescript
export function formatISOShortUTC(iso: string): string {
  // Convierte "2024-10-21" a "21/10/2024"
}
```

---

### formatBytes.ts

```typescript
export function formatBytes(bytes: bigint | number | null | undefined): string {
  // Convierte bytes a formato legible (KB, MB, GB)
  // Ejemplo: 1024000 → "1.00 MB"
}
```

---

### slug.ts

```typescript
export function generateSlug(text: string): string {
  // Genera slug SEO-friendly
  // Ejemplo: "Título con Ñ" → "titulo-con-n"
}
```

---

### prisma.ts

```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
// Singleton de Prisma Client
```

---

**Continúa en:** DOCUMENTACION_TECNICA_PARTE4.md
