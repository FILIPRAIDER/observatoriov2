# 📘 Documentación de Base de Datos - Para Frontend Next.js

## 📊 Estructura de la Base de Datos

### Ubicación
- **Base de datos:** SQLite
- **Archivo:** `database/database.sqlite`
- **ORM Backend:** Eloquent (Laravel)
- **ORM Frontend:** Prisma (Next.js)

---

## 📋 Tablas Principales

### 1. `publications` (Publicaciones)

Tabla principal que almacena todas las publicaciones del observatorio.

#### Estructura:

```sql
CREATE TABLE publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    abstract TEXT,
    content LONGTEXT NOT NULL,
    publication_date DATE NOT NULL,
    author_id INTEGER NOT NULL,
    publication_type_id INTEGER NOT NULL,
    
    -- Campos para PDF
    pdf_url VARCHAR NULL,
    pdf_file_id VARCHAR NULL,
    pdf_original_name VARCHAR NULL,
    pdf_size INTEGER NULL,
    
    -- Fechas adicionales (todas opcionales)
    event_date DATE NULL,
    submission_deadline DATE NULL,
    registration_deadline DATE NULL,
    
    -- Campos adicionales
    external_url VARCHAR NULL,
    is_featured BOOLEAN DEFAULT 0,
    keywords TEXT NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
    FOREIGN KEY (publication_type_id) REFERENCES publication_types(id) ON DELETE CASCADE
);
```

#### Campos Importantes:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `title` | string | Título de la publicación | ✅ Sí |
| `abstract` | text/html | Resumen breve (puede contener HTML) | ❌ No |
| `content` | text/html | Contenido completo (contiene HTML) | ✅ Sí |
| `publication_date` | date | Fecha de publicación | ✅ Sí |
| `author_id` | integer | ID del autor | ✅ Sí |
| `publication_type_id` | integer | ID del tipo de publicación | ✅ Sí |
| `pdf_url` | string | URL del PDF en ImageKit | ❌ No |
| `pdf_file_id` | string | ID del archivo en ImageKit | ❌ No |
| `pdf_original_name` | string | Nombre original del PDF | ❌ No |
| `pdf_size` | integer | Tamaño del PDF en bytes | ❌ No |
| `event_date` | date | Fecha del evento (para convocatorias) | ❌ No |
| `submission_deadline` | date | Fecha límite de envío | ❌ No |
| `registration_deadline` | date | Fecha límite de inscripción | ❌ No |
| `external_url` | string | URL externa relacionada | ❌ No |
| `is_featured` | boolean | Si es publicación destacada | ❌ No (default: false) |
| `keywords` | text | Palabras clave separadas por comas | ❌ No |

---

### 2. `authors` (Autores)

```sql
CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    organization VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

### 3. `publication_types` (Tipos de Publicación)

```sql
CREATE TABLE publication_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Configuración
    allows_pdf BOOLEAN DEFAULT 1,
    requires_pdf BOOLEAN DEFAULT 0,
    has_event_dates BOOLEAN DEFAULT 0,
    
    -- Visualización
    icon VARCHAR NULL,
    color VARCHAR NULL,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Tipos Predefinidos:

| ID | Nombre | Requiere PDF | Tiene Fechas | Color | Ícono |
|----|--------|--------------|--------------|-------|-------|
| 1 | Informe de Investigación | ✅ Sí | ❌ No | #3b82f6 | heroicon-o-clipboard-document-list |
| 2 | Artículo Académico | ✅ Sí | ❌ No | #8b5cf6 | heroicon-o-academic-cap |
| 3 | Boletín Informativo | ❌ No | ❌ No | #10b981 | heroicon-o-newspaper |
| 4 | Convocatoria | ❌ No | ✅ Sí | #f59e0b | heroicon-o-megaphone |
| 5 | Evento Académico | ❌ No | ✅ Sí | #ef4444 | heroicon-o-calendar |
| 6 | Nota de Prensa | ❌ No | ❌ No | #6366f1 | heroicon-o-document-text |
| 7 | Estadística Educativa | ✅ Sí | ❌ No | #06b6d4 | heroicon-o-presentation-chart-line |
| 8 | Libro o Capítulo | ✅ Sí | ❌ No | #84cc16 | heroicon-o-book-open |

---

### 4. `images` (Imágenes)

```sql
CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publication_id INTEGER NOT NULL,
    url VARCHAR(255) NOT NULL,
    file_id VARCHAR NULL,
    provider VARCHAR DEFAULT 'imagekit',
    alt VARCHAR NULL,
    caption TEXT NULL,
    sort_order INTEGER DEFAULT 0,
    width INTEGER NULL,
    height INTEGER NULL,
    size INTEGER NULL,
    mime VARCHAR NULL,
    metadata TEXT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE
);
```

---

## 🔧 Schema de Prisma para Next.js

Crea o actualiza tu `schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./path/to/database.sqlite"
}

model Publication {
  id                     Int              @id @default(autoincrement())
  title                  String
  abstract               String?
  content                String
  publication_date       DateTime
  author_id              Int
  publication_type_id    Int
  
  // PDF fields
  pdf_url                String?
  pdf_file_id            String?
  pdf_original_name      String?
  pdf_size               Int?
  
  // Additional dates
  event_date             DateTime?
  submission_deadline    DateTime?
  registration_deadline  DateTime?
  
  // Additional fields
  external_url           String?
  is_featured            Boolean          @default(false)
  keywords               String?
  
  created_at             DateTime         @default(now())
  updated_at             DateTime         @updatedAt
  
  // Relations
  author                 Author           @relation(fields: [author_id], references: [id], onDelete: Cascade)
  publicationType        PublicationType  @relation(fields: [publication_type_id], references: [id], onDelete: Cascade)
  images                 Image[]
  
  @@map("publications")
}

model Author {
  id           Int           @id @default(autoincrement())
  first_name   String
  last_name    String
  birth_date   DateTime
  organization String
  created_at   DateTime      @default(now())
  updated_at   DateTime      @updatedAt
  
  publications Publication[]
  
  @@map("authors")
}

model PublicationType {
  id              Int           @id @default(autoincrement())
  name            String
  description     String
  allows_pdf      Boolean       @default(true)
  requires_pdf    Boolean       @default(false)
  has_event_dates Boolean       @default(false)
  icon            String?
  color           String?
  sort_order      Int           @default(0)
  created_at      DateTime      @default(now())
  updated_at      DateTime      @updatedAt
  
  publications    Publication[]
  
  @@map("publication_types")
}

model Image {
  id             Int          @id @default(autoincrement())
  publication_id Int
  url            String
  file_id        String?
  provider       String       @default("imagekit")
  alt            String?
  caption        String?
  sort_order     Int          @default(0)
  width          Int?
  height         Int?
  size           Int?
  mime           String?
  metadata       String?
  created_at     DateTime     @default(now())
  updated_at     DateTime     @updatedAt
  
  publication    Publication  @relation(fields: [publication_id], references: [id], onDelete: Cascade)
  
  @@map("images")
}

model User {
  id                Int      @id @default(autoincrement())
  name              String
  email             String   @unique
  email_verified_at DateTime?
  password          String
  remember_token    String?
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  @@map("users")
}
```

---

## 📝 Ejemplos de Queries con Prisma

### 1. Obtener todas las publicaciones con relaciones

```typescript
const publications = await prisma.publication.findMany({
  include: {
    author: true,
    publicationType: true,
    images: {
      orderBy: {
        sort_order: 'asc'
      }
    }
  },
  orderBy: {
    publication_date: 'desc'
  }
});
```

### 2. Obtener publicaciones destacadas

```typescript
const featuredPublications = await prisma.publication.findMany({
  where: {
    is_featured: true
  },
  include: {
    author: true,
    publicationType: true,
    images: {
      take: 1,
      orderBy: {
        sort_order: 'asc'
      }
    }
  },
  orderBy: {
    publication_date: 'desc'
  },
  take: 5
});
```

### 3. Obtener publicaciones por tipo

```typescript
const informes = await prisma.publication.findMany({
  where: {
    publication_type_id: 1 // Informe de Investigación
  },
  include: {
    author: true,
    publicationType: true
  },
  orderBy: {
    publication_date: 'desc'
  }
});
```

### 4. Obtener una publicación completa

```typescript
const publication = await prisma.publication.findUnique({
  where: {
    id: publicationId
  },
  include: {
    author: true,
    publicationType: true,
    images: {
      orderBy: {
        sort_order: 'asc'
      }
    }
  }
});
```

### 5. Buscar publicaciones por palabra clave

```typescript
const searchResults = await prisma.publication.findMany({
  where: {
    OR: [
      {
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      {
        abstract: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      {
        keywords: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      }
    ]
  },
  include: {
    author: true,
    publicationType: true
  },
  orderBy: {
    publication_date: 'desc'
  }
});
```

### 6. Obtener publicaciones con PDF disponible

```typescript
const publicationsWithPdf = await prisma.publication.findMany({
  where: {
    pdf_url: {
      not: null
    }
  },
  include: {
    author: true,
    publicationType: true
  }
});
```

### 7. Obtener próximos eventos

```typescript
const upcomingEvents = await prisma.publication.findMany({
  where: {
    event_date: {
      gte: new Date()
    },
    publicationType: {
      has_event_dates: true
    }
  },
  include: {
    author: true,
    publicationType: true
  },
  orderBy: {
    event_date: 'asc'
  }
});
```

### 8. Obtener estadísticas

```typescript
// Contar publicaciones por tipo
const stats = await prisma.publicationType.findMany({
  include: {
    _count: {
      select: {
        publications: true
      }
    }
  },
  orderBy: {
    sort_order: 'asc'
  }
});

// Total de publicaciones
const totalPublications = await prisma.publication.count();

// Publicaciones del último mes
const recentPublications = await prisma.publication.count({
  where: {
    created_at: {
      gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
    }
  }
});
```

---

## 🎨 Renderizado de Contenido HTML

### ⚠️ IMPORTANTE: Los campos `abstract` y `content` contienen HTML

Estos campos se generan con el **RichEditor** de Filament y contienen HTML seguro.

### En React/Next.js:

```tsx
import DOMPurify from 'isomorphic-dompurify';

function PublicationContent({ publication }) {
  // Sanitizar el HTML antes de renderizarlo
  const sanitizedContent = DOMPurify.sanitize(publication.content);
  
  return (
    <div>
      {/* Abstract */}
      {publication.abstract && (
        <div 
          className="prose prose-lg mb-8"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(publication.abstract) 
          }}
        />
      )}
      
      {/* Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
  );
}
```

### Instalar DOMPurify:

```bash
npm install isomorphic-dompurify
```

---

## 📦 Formato de Fechas

Las fechas se almacenan en formato **ISO 8601** (YYYY-MM-DD).

### Formatear en JavaScript:

```typescript
// Usando date-fns
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const formattedDate = format(
  parseISO(publication.publication_date),
  "d 'de' MMMM 'de' yyyy",
  { locale: es }
);
// Resultado: "15 de octubre de 2024"
```

---

## 🖼️ Imágenes de ImageKit

Las URLs de las imágenes apuntan directamente a ImageKit:

```typescript
// Ejemplo de URL
publication.images[0].url
// "https://ik.imagekit.io/tu_id/publications/imagen.jpg"

// Para transformaciones (redimensionar, etc.)
const thumbnailUrl = publication.images[0].url + '?tr=w-400,h-300,fo-auto';
```

---

## 📄 Descargar PDFs

```tsx
function DownloadButton({ publication }) {
  if (!publication.pdf_url) return null;
  
  return (
    <a
      href={publication.pdf_url}
      download={publication.pdf_original_name}
      className="btn btn-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      Descargar PDF ({formatBytes(publication.pdf_size)})
    </a>
  );
}

function formatBytes(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

---

## 🎯 TypeScript Types

```typescript
export type Publication = {
  id: number;
  title: string;
  abstract: string | null;
  content: string;
  publication_date: Date;
  author_id: number;
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
  created_at: Date;
  updated_at: Date;
  author: Author;
  publicationType: PublicationType;
  images: Image[];
};

export type Author = {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  organization: string;
  created_at: Date;
  updated_at: Date;
};

export type PublicationType = {
  id: number;
  name: string;
  description: string;
  allows_pdf: boolean;
  requires_pdf: boolean;
  has_event_dates: boolean;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
};

export type Image = {
  id: number;
  publication_id: number;
  url: string;
  file_id: string | null;
  provider: string;
  alt: string | null;
  caption: string | null;
  sort_order: number;
  width: number | null;
  height: number | null;
  size: number | null;
  mime: string | null;
  metadata: string | null;
  created_at: Date;
  updated_at: Date;
};
```

---

## 🚀 Ejemplo Completo: Página de Publicaciones

```tsx
// app/publicaciones/page.tsx
import { prisma } from '@/lib/prisma';
import DOMPurify from 'isomorphic-dompurify';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    include: {
      author: true,
      publicationType: true,
      images: {
        take: 1,
        orderBy: {
          sort_order: 'asc'
        }
      }
    },
    orderBy: {
      publication_date: 'desc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Publicaciones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publications.map((pub) => (
          <article key={pub.id} className="card bg-white shadow-lg">
            {/* Imagen */}
            {pub.images[0] && (
              <img 
                src={pub.images[0].url + '?tr=w-400,h-250,fo-auto'} 
                alt={pub.images[0].alt || pub.title}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-6">
              {/* Badge de tipo */}
              <span 
                className="inline-block px-3 py-1 text-sm rounded-full mb-3"
                style={{ 
                  backgroundColor: pub.publicationType.color + '20',
                  color: pub.publicationType.color 
                }}
              >
                {pub.publicationType.name}
              </span>
              
              {/* Título */}
              <h2 className="text-xl font-bold mb-2">{pub.title}</h2>
              
              {/* Autor y fecha */}
              <p className="text-sm text-gray-600 mb-3">
                {pub.author.first_name} {pub.author.last_name} • {' '}
                {format(parseISO(pub.publication_date.toString()), 'd MMM yyyy', { locale: es })}
              </p>
              
              {/* Resumen */}
              {pub.abstract && (
                <div 
                  className="prose prose-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(pub.abstract) 
                  }}
                />
              )}
              
              {/* Acciones */}
              <div className="flex gap-2">
                <a 
                  href={`/publicaciones/${pub.id}`}
                  className="btn btn-primary flex-1"
                >
                  Leer más
                </a>
                
                {pub.pdf_url && (
                  <a
                    href={pub.pdf_url}
                    download
                    className="btn btn-outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 PDF
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

---

## 📌 Notas Importantes

### 1. **Seguridad del HTML**
- Siempre sanitiza el HTML antes de renderizarlo
- Usa `DOMPurify` o similar
- El contenido ya viene "limpio" desde Filament pero es buena práctica

### 2. **Optimización de Imágenes**
- Las imágenes en ImageKit soportan transformaciones en la URL
- Parámetros útiles:
  - `?tr=w-400,h-300` - Redimensionar
  - `?tr=fo-auto` - Recorte inteligente
  - `?tr=q-80` - Calidad
  - Ejemplo: `imagen.jpg?tr=w-400,h-300,fo-auto,q-80`

### 3. **Paginación**
- Usa `skip` y `take` de Prisma para paginar:

```typescript
const page = 1;
const perPage = 10;

const publications = await prisma.publication.findMany({
  skip: (page - 1) * perPage,
  take: perPage,
  include: { author: true, publicationType: true }
});

const total = await prisma.publication.count();
```

### 4. **Caché**
- Considera usar React Server Components con caché
- O Next.js ISR (Incremental Static Regeneration)

```typescript
export const revalidate = 3600; // Revalidar cada hora
```

---

## 🆘 Soporte

Si tienes dudas sobre:
- Estructura de datos
- Campos adicionales
- Relaciones
- Queries específicos

Consulta con el equipo de backend o revisa:
- `app/Models/*.php` - Modelos de Laravel
- `app/Filament/Resources/*.php` - Recursos de Filament
- `database/migrations/*.php` - Estructura de tablas

---

**Documentación generada el:** 21 de octubre de 2025  
**Versión del backend:** Laravel 12 + Filament 3  
**Base de datos:** SQLite
