# 📚 Guía Completa de Integración Frontend - Observatorio de la Educación en Córdoba

**Actualizado:** 20 de noviembre de 2025  
**Versión:** 2.0 - Con soporte para múltiples autores

---

## 📊 Resumen del Sistema

El backend Laravel del Observatorio cuenta con:

- ✅ **6 Publicaciones** con contenido completo
- ✅ **4 Autores individuales** del equipo
- ✅ **4 Dashboards Power BI** reales y funcionales
- ✅ **Soporte para múltiples autores por publicación**
- ✅ **Imágenes vinculadas** a publicaciones
- ✅ **8+ Tipos de publicación** configurados

---

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

```
publications          - Publicaciones del observatorio
├── authors (M:M)     - Múltiples autores por publicación
├── publication_types - Tipos de publicación
└── images           - Galería de imágenes

powerbi_dashboards   - Dashboards de Power BI
authors              - Autores individuales
author_publication   - Tabla pivot autores-publicaciones
```

---

## 🔗 Relaciones entre Tablas

### Publications ↔ Authors (Muchos a Muchos)

Una publicación puede tener **múltiples autores** y un autor puede tener **múltiples publicaciones**.

```sql
-- Tabla pivot: author_publication
id
author_id (FK → authors)
publication_id (FK → publications)
sort_order (orden de aparición)
created_at
updated_at
```

### Otras Relaciones

- **Publications** → **PublicationType** (1:1)
- **Publications** → **Images** (1:N)
- **Dashboards** → Independiente (no relacionado)

---

## 📝 Modelos y Schemas

### Schema Prisma Completo

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================
// PUBLICACIONES Y RELACIONES
// ============================================

model publications {
  id                    BigInt                @id @default(autoincrement()) @db.UnsignedBigInt
  title                 String                @db.VarChar(255)
  abstract              String                @db.Text
  content               String                @db.LongText
  publication_date      DateTime              @db.Date
  publication_type_id   BigInt                @db.UnsignedBigInt
  pdf_url               String?               @db.VarChar(500)
  pdf_file_id           String?               @db.VarChar(255)
  pdf_original_name     String?               @db.VarChar(255)
  pdf_size              BigInt?               @db.UnsignedBigInt
  event_date            DateTime?             @db.Date
  submission_deadline   DateTime?             @db.Date
  registration_deadline DateTime?             @db.Date
  external_url          String?               @db.VarChar(500)
  is_featured           Boolean               @default(false)
  keywords              String?               @db.Text
  created_at            DateTime?             @db.Timestamp(0)
  updated_at            DateTime?             @db.Timestamp(0)
  
  // Relaciones
  publication_type      publication_types     @relation(fields: [publication_type_id], references: [id], onDelete: Cascade)
  images                images[]
  authors               author_publication[]

  @@index([publication_type_id])
  @@index([is_featured])
  @@index([publication_date])
}

model authors {
  id           BigInt               @id @default(autoincrement()) @db.UnsignedBigInt
  first_name   String               @db.VarChar(255)
  last_name    String               @db.VarChar(255)
  birth_date   DateTime             @db.Date
  organization String               @db.VarChar(255)
  created_at   DateTime?            @db.Timestamp(0)
  updated_at   DateTime?            @db.Timestamp(0)
  
  // Relaciones
  publications author_publication[]
}

model author_publication {
  id             BigInt        @id @default(autoincrement()) @db.UnsignedBigInt
  author_id      BigInt        @db.UnsignedBigInt
  publication_id BigInt        @db.UnsignedBigInt
  sort_order     Int           @default(0)
  created_at     DateTime?     @db.Timestamp(0)
  updated_at     DateTime?     @db.Timestamp(0)
  
  // Relaciones
  author         authors       @relation(fields: [author_id], references: [id], onDelete: Cascade)
  publication    publications  @relation(fields: [publication_id], references: [id], onDelete: Cascade)
  
  @@unique([author_id, publication_id])
  @@index([publication_id, sort_order])
  @@index([author_id])
}

model publication_types {
  id              BigInt          @id @default(autoincrement()) @db.UnsignedBigInt
  name            String          @db.VarChar(255)
  description     String          @db.Text
  allows_pdf      Boolean         @default(true)
  requires_pdf    Boolean         @default(false)
  has_event_dates Boolean         @default(false)
  icon            String?         @db.VarChar(255)
  color           String?         @db.VarChar(50)
  sort_order      Int             @default(0)
  created_at      DateTime?       @db.Timestamp(0)
  updated_at      DateTime?       @db.Timestamp(0)
  
  // Relaciones
  publications    publications[]
  
  @@index([sort_order])
}

model images {
  id             BigInt        @id @default(autoincrement()) @db.UnsignedBigInt
  publication_id BigInt        @db.UnsignedBigInt
  file_id        String?       @db.VarChar(255)
  url            String        @db.VarChar(255)
  provider       String        @default("imagekit") @db.VarChar(255)
  width          Int?          @db.UnsignedInt
  height         Int?          @db.UnsignedInt
  size           BigInt?       @db.UnsignedBigInt
  mime           String?       @db.VarChar(100)
  alt            String?       @db.VarChar(255)
  caption        String?       @db.Text
  sort_order     Int           @default(0)
  metadata       Json?
  created_at     DateTime?     @db.Timestamp(0)
  updated_at     DateTime?     @db.Timestamp(0)
  
  // Relaciones
  publication    publications  @relation(fields: [publication_id], references: [id], onDelete: Cascade)
  
  @@index([file_id])
  @@index([publication_id])
}

// ============================================
// DASHBOARDS POWER BI
// ============================================

model powerbi_dashboards {
  id            BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  name          String    @db.VarChar(255)
  description   String?   @db.Text
  embed_url     String    @db.VarChar(1000)
  workspace_id  String?   @db.VarChar(255)
  report_id     String    @db.VarChar(255)
  category      String    @default("educacion") @db.VarChar(50)
  is_active     Boolean   @default(true)
  sort_order    Int       @default(0)
  thumbnail_url String?   @db.VarChar(500)
  created_at    DateTime? @db.Timestamp(0)
  updated_at    DateTime? @db.Timestamp(0)
  
  @@index([is_active, sort_order], name: "idx_active_sort")
  @@index([category])
}
```

---

## 🔍 Queries Esenciales

### 1. Obtener Publicaciones con Autores

```typescript
// Publicaciones con TODOS sus autores ordenados
const publications = await prisma.publications.findMany({
  include: {
    authors: {
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            organization: true,
          },
        },
      },
      orderBy: {
        sort_order: 'asc',
      },
    },
    publication_type: true,
    images: {
      orderBy: {
        sort_order: 'asc',
      },
    },
  },
  where: {
    is_featured: true,
  },
  orderBy: {
    publication_date: 'desc',
  },
});

// Transformar para uso fácil en el frontend
const formattedPublications = publications.map(pub => ({
  ...pub,
  authorsList: pub.authors.map(ap => ({
    id: ap.author.id,
    fullName: `${ap.author.first_name} ${ap.author.last_name}`,
    firstName: ap.author.first_name,
    lastName: ap.author.last_name,
    organization: ap.author.organization,
  })),
}));
```

### 2. Publicación Individual con Todos los Detalles

```typescript
const publication = await prisma.publications.findUnique({
  where: { id: publicationId },
  include: {
    authors: {
      include: {
        author: true,
      },
      orderBy: {
        sort_order: 'asc',
      },
    },
    publication_type: true,
    images: {
      orderBy: {
        sort_order: 'asc',
      },
    },
  },
});

if (!publication) {
  notFound();
}
```

### 3. Publicaciones por Autor

```typescript
const authorPublications = await prisma.authors.findUnique({
  where: { id: authorId },
  include: {
    publications: {
      include: {
        publication: {
          include: {
            publication_type: true,
            images: true,
          },
        },
      },
      orderBy: {
        publication: {
          publication_date: 'desc',
        },
      },
    },
  },
});
```

### 4. Dashboards Power BI

```typescript
const dashboards = await prisma.powerbi_dashboards.findMany({
  where: {
    is_active: true,
  },
  orderBy: {
    sort_order: 'asc',
  },
});
```

### 5. Publicaciones Destacadas para Homepage

```typescript
const featuredPublications = await prisma.publications.findMany({
  where: {
    is_featured: true,
  },
  include: {
    authors: {
      include: {
        author: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        sort_order: 'asc',
      },
      take: 1, // Solo el primer autor para la vista previa
    },
    publication_type: {
      select: {
        name: true,
        color: true,
        icon: true,
      },
    },
    images: {
      take: 1, // Solo la primera imagen
      orderBy: {
        sort_order: 'asc',
      },
    },
  },
  orderBy: {
    publication_date: 'desc',
  },
  take: 6,
});
```

---

## 📱 Componentes React/Next.js

### Componente: PublicationCard

```tsx
// components/PublicationCard.tsx
interface PublicationCardProps {
  publication: {
    id: number;
    title: string;
    abstract: string;
    publication_date: Date;
    is_featured: boolean;
    authors: Array<{
      author: {
        first_name: string;
        last_name: string;
      };
    }>;
    publication_type: {
      name: string;
      color: string | null;
      icon: string | null;
    };
    images: Array<{
      url: string;
      alt: string | null;
    }>;
  };
}

export function PublicationCard({ publication }: PublicationCardProps) {
  // Formatear autores
  const authorsText = publication.authors
    .map(ap => `${ap.author.first_name} ${ap.author.last_name}`)
    .join(', ');

  return (
    <Link href={`/publicaciones/${publication.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
        {/* Imagen destacada */}
        {publication.images[0] && (
          <img
            src={publication.images[0].url}
            alt={publication.images[0].alt || publication.title}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-6">
          {/* Badge del tipo */}
          <div className="mb-3">
            <span 
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full`}
              style={{ 
                backgroundColor: publication.publication_type.color || '#gray',
                color: 'white'
              }}
            >
              {publication.publication_type.name}
            </span>
            {publication.is_featured && (
              <span className="ml-2 text-yellow-500">⭐</span>
            )}
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold mb-2 line-clamp-2">
            {publication.title}
          </h3>

          {/* Autores */}
          <p className="text-sm text-gray-600 mb-2">
            Por: {authorsText}
          </p>

          {/* Resumen */}
          <div 
            className="text-gray-700 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: publication.abstract }}
          />

          {/* Fecha */}
          <p className="text-xs text-gray-500">
            {new Date(publication.publication_date).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
```

### Página: Vista Individual de Publicación

```tsx
// app/publicaciones/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

export default async function PublicationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const publication = await prisma.publications.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      authors: {
        include: {
          author: true,
        },
        orderBy: {
          sort_order: 'asc',
        },
      },
      publication_type: true,
      images: {
        orderBy: {
          sort_order: 'asc',
        },
      },
    },
  });

  if (!publication) {
    notFound();
  }

  // Sanitizar HTML
  const cleanAbstract = DOMPurify.sanitize(publication.abstract);
  const cleanContent = DOMPurify.sanitize(publication.content);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-600">Inicio</a>
        {' > '}
        <a href="/publicaciones" className="hover:text-blue-600">Publicaciones</a>
        {' > '}
        <span className="text-gray-900">{publication.title}</span>
      </nav>

      {/* Tipo de publicación */}
      <div className="mb-4">
        <span 
          className="inline-block px-4 py-2 text-sm font-semibold rounded-full"
          style={{ 
            backgroundColor: publication.publication_type.color || '#gray',
            color: 'white'
          }}
        >
          {publication.publication_type.name}
        </span>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>

      {/* Autores - MÚLTIPLES */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          {publication.authors.length > 1 ? 'Autores:' : 'Autor:'}
        </h3>
        <div className="space-y-2">
          {publication.authors.map((ap) => (
            <div key={ap.id} className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {ap.author.first_name[0]}{ap.author.last_name[0]}
              </div>
              <div>
                <p className="font-semibold">
                  {ap.author.first_name} {ap.author.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {ap.author.organization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fecha */}
      <p className="text-gray-600 mb-8">
        📅 {new Date(publication.publication_date).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>

      {/* Imagen destacada */}
      {publication.images[0] && (
        <img
          src={publication.images[0].url}
          alt={publication.images[0].alt || publication.title}
          className="w-full rounded-lg mb-8"
        />
      )}

      {/* Resumen */}
      {publication.abstract && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <h2 className="text-xl font-bold mb-3">Resumen</h2>
          <div 
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanAbstract }}
          />
        </div>
      )}

      {/* Contenido principal */}
      <div 
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />

      {/* Galería de imágenes adicionales */}
      {publication.images.length > 1 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Galería</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {publication.images.slice(1).map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.alt || ''}
                className="rounded-lg shadow-md hover:shadow-xl transition-shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* PDF descargable */}
      {publication.pdf_url && (
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-3">📄 Documento PDF</h3>
          <a
            href={publication.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Descargar PDF ({publication.pdf_original_name})
          </a>
        </div>
      )}

      {/* Palabras clave */}
      {publication.keywords && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3">🏷️ Palabras clave:</h3>
          <div className="flex flex-wrap gap-2">
            {publication.keywords.split(',').map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {keyword.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enlace externo */}
      {publication.external_url && (
        <a
          href={publication.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 hover:underline"
        >
          🔗 Ver artículo original →
        </a>
      )}
    </article>
  );
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const publications = await prisma.publications.findMany({
    select: { id: true },
  });

  return publications.map((pub) => ({
    id: pub.id.toString(),
  }));
}

// Revalidar cada hora
export const revalidate = 3600;
```

---

## 🎨 Tipos TypeScript

```typescript
// types/publication.ts
export interface Author {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  organization: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AuthorPublication {
  id: number;
  author_id: number;
  publication_id: number;
  sort_order: number;
  author: Author;
}

export interface PublicationType {
  id: number;
  name: string;
  description: string;
  allows_pdf: boolean;
  requires_pdf: boolean;
  has_event_dates: boolean;
  icon: string | null;
  color: string | null;
  sort_order: number;
}

export interface Image {
  id: number;
  publication_id: number;
  file_id: string | null;
  url: string;
  provider: string;
  width: number | null;
  height: number | null;
  size: number | null;
  mime: string | null;
  alt: string | null;
  caption: string | null;
  sort_order: number;
}

export interface Publication {
  id: number;
  title: string;
  abstract: string;
  content: string;
  publication_date: Date;
  publication_type_id: number;
  pdf_url: string | null;
  pdf_file_id: string | null;
  pdf_original_name: string | null;
  pdf_size: number | null;
  event_date: Date | null;
  submission_deadline: Date | null;
  registration_deadline: Date | null;
  external_url: string | null;
  is_featured: boolean;
  keywords: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  
  // Relaciones
  authors: AuthorPublication[];
  publication_type: PublicationType;
  images: Image[];
}

// Helper type para publicación con autores formateados
export interface PublicationWithFormattedAuthors extends Publication {
  authorsList: {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    organization: string;
  }[];
}
```

---

## 🚀 Optimizaciones y Mejores Prácticas

### 1. Caché con ISR

```typescript
// En cualquier página de publicaciones
export const revalidate = 3600; // Revalidar cada hora
```

### 2. Sanitización de HTML

```bash
npm install isomorphic-dompurify
```

```typescript
import DOMPurify from 'isomorphic-dompurify';

const cleanHTML = DOMPurify.sanitize(publication.content);
```

### 3. Paginación

```typescript
const ITEMS_PER_PAGE = 12;

const publications = await prisma.publications.findMany({
  skip: (page - 1) * ITEMS_PER_PAGE,
  take: ITEMS_PER_PAGE,
  // ... resto de la query
});

const totalCount = await prisma.publications.count();
const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
```

### 4. Búsqueda

```typescript
const publications = await prisma.publications.findMany({
  where: {
    OR: [
      { title: { contains: searchQuery } },
      { abstract: { contains: searchQuery } },
      { keywords: { contains: searchQuery } },
      {
        authors: {
          some: {
            author: {
              OR: [
                { first_name: { contains: searchQuery } },
                { last_name: { contains: searchQuery } },
              ],
            },
          },
        },
      },
    ],
  },
  // ... resto de la query
});
```

---

## 📊 Dashboard Power BI - Guía Rápida

Ver archivo completo: `FRONTEND_DASHBOARDS_POWERBI.md`

### Query Básico

```typescript
const dashboards = await prisma.powerbi_dashboards.findMany({
  where: { is_active: true },
  orderBy: { sort_order: 'asc' },
});
```

### Componente de Embebido

```tsx
<iframe
  src={dashboard.embed_url}
  frameBorder="0"
  allowFullScreen
  className="w-full h-[600px] rounded-lg"
/>
```

---

## ✅ Checklist de Integración

- [ ] Instalar Prisma: `npm install @prisma/client`
- [ ] Copiar schema.prisma
- [ ] Configurar DATABASE_URL en .env
- [ ] Generar cliente: `npx prisma generate`
- [ ] Probar conexión: `npx prisma studio`
- [ ] Crear páginas de publicaciones
- [ ] Crear componentes reutilizables
- [ ] Implementar sanitización de HTML
- [ ] Configurar ISR para caché
- [ ] Implementar página de dashboards
- [ ] Probar en producción

---

## 📞 Soporte

**Base de datos:** `C:\Users\filip\OneDrive\Desktop\adminOBEDU\database\database.sqlite`  
**Panel Admin:** http://127.0.0.1:8000/admin  
**Credenciales:** admin@obedu.com / password

---

**¡Toda la información está lista para ser consumida por el frontend!** 🎉
