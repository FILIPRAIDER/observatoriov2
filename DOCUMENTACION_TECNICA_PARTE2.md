# 📘 Documentación Técnica del Proyecto - Parte 2: Arquitectura y Base de Datos

**Proyecto:** Observatorio Educativo v2  
**Fecha:** Noviembre 9, 2025

---

## 🏗️ Arquitectura de la Aplicación

### Patrón Arquitectónico

El proyecto utiliza la **arquitectura de Next.js 15 App Router** con:

- **Server Components**: Por defecto, para mejor rendimiento
- **Client Components**: Solo cuando se necesita interactividad
- **Server Actions**: Para operaciones del servidor sin API routes
- **Streaming y Suspense**: Para carga progresiva

### Flujo de Datos

```
Usuario
   ↓
Next.js App Router (Server Components)
   ↓
Server Actions (src/app/actions/)
   ↓
Prisma ORM
   ↓
MySQL Database
```

### Estructura por Capas

```
┌─────────────────────────────────────┐
│  PRESENTACIÓN (Components)          │
│  - UI Components                    │
│  - Client Components                │
│  - Server Components                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  LÓGICA DE NEGOCIO (Actions)        │
│  - Server Actions                   │
│  - Validación                       │
│  - Transformación de datos          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  ACCESO A DATOS (Queries)           │
│  - Prisma Queries                   │
│  - Cache de React                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  BASE DE DATOS (MySQL)               │
│  - Tablas relacionales              │
│  - Índices optimizados              │
└─────────────────────────────────────┘
```

---

## 🗄️ Modelo de Datos

### Diagrama de Entidad-Relación

```
┌─────────────────┐
│     authors     │
├─────────────────┤
│ id (PK)         │
│ first_name      │
│ last_name       │
│ birth_date      │
│ organization    │
└─────────────────┘
        │
        │ 1:N
        ↓
┌─────────────────────────┐
│    publications         │
├─────────────────────────┤
│ id (PK)                 │
│ title                   │
│ abstract                │
│ content                 │
│ publication_date        │
│ author_id (FK)          │────┐
│ publication_type_id (FK)│    │
│ pdf_url                 │    │
│ pdf_file_id             │    │
│ pdf_original_name       │    │
│ pdf_size                │    │
│ event_date              │    │
│ submission_deadline     │    │
│ registration_deadline   │    │
│ external_url            │    │
│ is_featured             │    │
│ keywords                │    │
└─────────────────────────┘    │
        │                       │
        │ 1:N                   │ N:1
        ↓                       ↓
┌─────────────────┐    ┌──────────────────┐
│     images      │    │ publication_types│
├─────────────────┤    ├──────────────────┤
│ id (PK)         │    │ id (PK)          │
│ publication_id  │    │ name             │
│ url             │    │ description      │
│ file_id         │    │ allows_pdf       │
│ provider        │    │ requires_pdf     │
│ alt             │    │ has_event_dates  │
│ caption         │    │ icon             │
│ sort_order      │    │ color            │
│ width           │    │ sort_order       │
│ height          │    └──────────────────┘
│ size            │
│ mime            │
│ metadata        │
└─────────────────┘
```

---

## 📊 Tablas de la Base de Datos

### 1. `publications` (Tabla Principal)

**Propósito**: Almacena todas las publicaciones del observatorio

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | ID único |
| `title` | VARCHAR(255) | NO | - | Título de la publicación |
| `abstract` | TEXT | YES | NULL | Resumen/extracto (HTML) |
| `content` | LONGTEXT | NO | - | Contenido completo (HTML) |
| `publication_date` | DATE | NO | - | Fecha de publicación |
| `author_id` | BIGINT UNSIGNED | NO | - | ID del autor |
| `publication_type_id` | BIGINT UNSIGNED | NO | - | ID del tipo |
| `pdf_url` | VARCHAR(500) | YES | NULL | URL del PDF en ImageKit |
| `pdf_file_id` | VARCHAR(255) | YES | NULL | ID del archivo en ImageKit |
| `pdf_original_name` | VARCHAR(255) | YES | NULL | Nombre original del PDF |
| `pdf_size` | BIGINT UNSIGNED | YES | NULL | Tamaño en bytes |
| `event_date` | DATE | YES | NULL | Fecha del evento |
| `submission_deadline` | DATE | YES | NULL | Fecha límite de envío |
| `registration_deadline` | DATE | YES | NULL | Fecha límite de registro |
| `external_url` | VARCHAR(500) | YES | NULL | URL externa relacionada |
| `is_featured` | BOOLEAN | NO | false | ¿Es destacada? |
| `keywords` | TEXT | YES | NULL | Palabras clave (separadas por comas) |
| `created_at` | TIMESTAMP | YES | NULL | Fecha de creación |
| `updated_at` | TIMESTAMP | YES | NULL | Fecha de actualización |

**Índices:**
- PRIMARY KEY (`id`)
- FOREIGN KEY (`author_id`) REFERENCES `authors(id)` ON DELETE CASCADE
- FOREIGN KEY (`publication_type_id`) REFERENCES `publication_types(id)` ON DELETE CASCADE
- INDEX (`is_featured`)
- INDEX (`publication_date`)

---

### 2. `authors` (Autores)

**Propósito**: Almacena información de los autores

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | ID único |
| `first_name` | VARCHAR(255) | NO | - | Nombre |
| `last_name` | VARCHAR(255) | NO | - | Apellido |
| `birth_date` | DATE | NO | - | Fecha de nacimiento |
| `organization` | VARCHAR(255) | NO | - | Organización |
| `created_at` | TIMESTAMP | YES | NULL | Fecha de creación |
| `updated_at` | TIMESTAMP | YES | NULL | Fecha de actualización |

**Índices:**
- PRIMARY KEY (`id`)

---

### 3. `publication_types` (Tipos de Publicación)

**Propósito**: Define los diferentes tipos de publicaciones

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | ID único |
| `name` | VARCHAR(255) | NO | - | Nombre del tipo |
| `description` | TEXT | NO | - | Descripción |
| `allows_pdf` | BOOLEAN | NO | true | ¿Permite adjuntar PDF? |
| `requires_pdf` | BOOLEAN | NO | false | ¿Requiere PDF obligatorio? |
| `has_event_dates` | BOOLEAN | NO | false | ¿Tiene fechas de evento? |
| `icon` | VARCHAR(255) | YES | NULL | Ícono (heroicon) |
| `color` | VARCHAR(50) | YES | NULL | Color hexadecimal |
| `sort_order` | INT | NO | 0 | Orden de visualización |
| `created_at` | TIMESTAMP | YES | NULL | Fecha de creación |
| `updated_at` | TIMESTAMP | YES | NULL | Fecha de actualización |

**Índices:**
- PRIMARY KEY (`id`)
- INDEX (`sort_order`)

**Tipos Predefinidos:**

| ID | Nombre | Color | Requiere PDF | Tiene Fechas |
|----|--------|-------|--------------|--------------|
| 1 | Informe de Investigación | #3b82f6 | ✅ | ❌ |
| 2 | Artículo Académico | #8b5cf6 | ✅ | ❌ |
| 3 | Boletín Informativo | #10b981 | ❌ | ❌ |
| 4 | Convocatoria | #f59e0b | ❌ | ✅ |
| 5 | Evento Académico | #ef4444 | ❌ | ✅ |
| 6 | Nota de Prensa | #6366f1 | ❌ | ❌ |
| 7 | Estadística Educativa | #06b6d4 | ✅ | ❌ |
| 8 | Libro o Capítulo | #84cc16 | ✅ | ❌ |

---

### 4. `images` (Imágenes)

**Propósito**: Almacena imágenes asociadas a publicaciones

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | ID único |
| `publication_id` | BIGINT UNSIGNED | NO | - | ID de la publicación |
| `file_id` | VARCHAR(255) | YES | NULL | ID en ImageKit |
| `url` | VARCHAR(255) | NO | - | URL de la imagen |
| `provider` | VARCHAR(255) | NO | 'imagekit' | Proveedor (imagekit) |
| `width` | INT UNSIGNED | YES | NULL | Ancho en px |
| `height` | INT UNSIGNED | YES | NULL | Alto en px |
| `size` | BIGINT UNSIGNED | YES | NULL | Tamaño en bytes |
| `mime` | VARCHAR(100) | YES | NULL | Tipo MIME |
| `alt` | VARCHAR(255) | YES | NULL | Texto alternativo |
| `caption` | TEXT | YES | NULL | Pie de foto |
| `sort_order` | INT | NO | 0 | Orden de visualización |
| `metadata` | JSON | YES | NULL | Metadatos adicionales |
| `created_at` | TIMESTAMP | YES | NULL | Fecha de creación |
| `updated_at` | TIMESTAMP | YES | NULL | Fecha de actualización |

**Índices:**
- PRIMARY KEY (`id`)
- FOREIGN KEY (`publication_id`) REFERENCES `publications(id)` ON DELETE CASCADE
- INDEX (`file_id`)
- INDEX (`publication_id`)

---

### 5. Otras Tablas (Sistema Laravel)

El proyecto también incluye tablas estándar de Laravel para gestión del backend:

- `users`: Usuarios del sistema administrativo
- `sessions`: Sesiones de usuario
- `cache`: Sistema de caché
- `cache_locks`: Locks de caché
- `failed_jobs`: Trabajos fallados
- `job_batches`: Lotes de trabajos
- `jobs`: Cola de trabajos
- `migrations`: Historial de migraciones
- `password_reset_tokens`: Tokens de reseteo de contraseña

---

## 🔧 Schema de Prisma

### Archivo: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ============================================
// TABLAS DE SISTEMA (Laravel)
// ============================================

model cache {
  key        String @id @db.VarChar(255)
  value      String @db.MediumText
  expiration Int
}

model users {
  id                BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  name              String    @db.VarChar(255)
  email             String    @unique @db.VarChar(255)
  email_verified_at DateTime? @db.Timestamp(0)
  password          String    @db.VarChar(255)
  remember_token    String?   @db.VarChar(100)
  created_at        DateTime? @db.Timestamp(0)
  updated_at        DateTime? @db.Timestamp(0)
}

// ============================================
// TABLAS DE CONTENIDO
// ============================================

model authors {
  id           BigInt         @id @default(autoincrement()) @db.UnsignedBigInt
  first_name   String         @db.VarChar(255)
  last_name    String         @db.VarChar(255)
  birth_date   DateTime       @db.Date
  organization String         @db.VarChar(255)
  created_at   DateTime?      @db.Timestamp(0)
  updated_at   DateTime?      @db.Timestamp(0)
  publications publications[]
}

model publication_types {
  id              BigInt         @id @default(autoincrement()) @db.UnsignedBigInt
  name            String         @db.VarChar(255)
  description     String         @db.Text
  allows_pdf      Boolean        @default(true)
  requires_pdf    Boolean        @default(false)
  has_event_dates Boolean        @default(false)
  icon            String?        @db.VarChar(255)
  color           String?        @db.VarChar(50)
  sort_order      Int            @default(0)
  created_at      DateTime?      @db.Timestamp(0)
  updated_at      DateTime?      @db.Timestamp(0)
  publications    publications[]

  @@index([sort_order], map: "idx_publication_types_sort_order")
}

model publications {
  id                    BigInt            @id @default(autoincrement()) @db.UnsignedBigInt
  title                 String            @db.VarChar(255)
  abstract              String            @db.Text
  content               String            @db.LongText
  pdf_url               String?           @db.VarChar(500)
  pdf_file_id           String?           @db.VarChar(255)
  pdf_original_name     String?           @db.VarChar(255)
  pdf_size              BigInt?           @db.UnsignedBigInt
  event_date            DateTime?         @db.Date
  submission_deadline   DateTime?         @db.Date
  registration_deadline DateTime?         @db.Date
  external_url          String?           @db.VarChar(500)
  is_featured           Boolean           @default(false)
  keywords              String?           @db.Text
  publication_date      DateTime          @db.Date
  author_id             BigInt            @db.UnsignedBigInt
  publication_type_id   BigInt            @db.UnsignedBigInt
  created_at            DateTime?         @db.Timestamp(0)
  updated_at            DateTime?         @db.Timestamp(0)
  images                images[]
  authors               authors           @relation(fields: [author_id], references: [id], onDelete: Cascade)
  publication_types     publication_types @relation(fields: [publication_type_id], references: [id], onDelete: Cascade)

  @@index([author_id], map: "publications_author_id_foreign")
  @@index([publication_type_id], map: "publications_publication_type_id_foreign")
  @@index([is_featured], map: "idx_publications_is_featured")
  @@index([publication_date], map: "idx_publications_publication_date")
}

model images {
  id             BigInt       @id @default(autoincrement()) @db.UnsignedBigInt
  publication_id BigInt       @db.UnsignedBigInt
  file_id        String?      @db.VarChar(255)
  url            String       @db.VarChar(255)
  provider       String       @default("imagekit") @db.VarChar(255)
  width          Int?         @db.UnsignedInt
  height         Int?         @db.UnsignedInt
  size           BigInt?      @db.UnsignedBigInt
  mime           String?      @db.VarChar(100)
  alt            String?      @db.VarChar(255)
  caption        String?      @db.Text
  sort_order     Int          @default(0)
  metadata       Json?
  created_at     DateTime?    @db.Timestamp(0)
  updated_at     DateTime?    @db.Timestamp(0)
  publications   publications @relation(fields: [publication_id], references: [id], onDelete: Cascade)

  @@index([file_id], map: "images_file_id_index")
  @@index([publication_id], map: "images_publication_id_foreign")
}
```

---

## 🔍 Queries Importantes

### Cliente Prisma Singleton

**Archivo:** `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Ejemplos de Queries Comunes

#### 1. Obtener publicaciones con relaciones

```typescript
const publications = await prisma.publications.findMany({
  include: {
    authors: true,
    publication_types: true,
    images: {
      orderBy: { sort_order: 'asc' },
      take: 1
    }
  },
  orderBy: {
    publication_date: 'desc'
  }
});
```

#### 2. Buscar publicaciones

```typescript
const results = await prisma.publications.findMany({
  where: {
    OR: [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { abstract: { contains: searchTerm, mode: 'insensitive' } },
      { keywords: { contains: searchTerm, mode: 'insensitive' } }
    ]
  },
  include: {
    authors: true,
    publication_types: true
  }
});
```

#### 3. Filtrar por tipo y destacadas

```typescript
const filtered = await prisma.publications.findMany({
  where: {
    publication_type_id: typeId,
    is_featured: true,
    pdf_url: { not: null }
  },
  include: {
    authors: true,
    publication_types: true
  }
});
```

---

**Continúa en:** DOCUMENTACION_TECNICA_PARTE3.md
