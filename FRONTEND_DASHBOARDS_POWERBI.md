# 📊 Guía de Integración: Dashboards Power BI - Frontend

## Dashboards Disponibles

El Observatorio de la Educación en Córdoba tiene **4 dashboards de Power BI** configurados:

### 1. Saber 11 en Córdoba
- **ID:** `2c615028-1b7a-434a-a972-0283dd9ff455`
- **Categoría:** Educación
- **Descripción:** Análisis de resultados de las pruebas Saber 11 en Córdoba
- **Orden:** 1

### 2. Cobertura Educativa en Córdoba
- **ID:** `9defdf7f-5236-4351-a5c1-d8eddd503c05`
- **Categoría:** Educación
- **Descripción:** Dashboard sobre cobertura educativa en todos los niveles
- **Orden:** 2

### 3. Empleabilidad
- **ID:** `c18a0c40-2fa3-40a1-9aeb-e155114124ab`
- **Categoría:** Educación
- **Descripción:** Análisis de empleabilidad de egresados de educación superior
- **Orden:** 3

### 4. Deserción en Córdoba
- **ID:** `efdf61a3-8fa1-4fad-831f-ef385ab654ba`
- **Categoría:** Educación
- **Descripción:** Cifras de deserción estudiantil en educación superior
- **Orden:** 4

---

## Estructura de Datos

### Modelo `Dashboard`

```typescript
interface Dashboard {
  id: number;
  name: string;
  description: string | null;
  embed_url: string;
  workspace_id: string | null;
  report_id: string;
  category: 'educacion' | 'economia' | 'demografia' | 'infraestructura' | 'salud' | 'otro';
  is_active: boolean;
  sort_order: number;
  thumbnail_url: string | null;
  created_at: Date;
  updated_at: Date;
}
```

---

## Consultas desde el Backend Laravel

### Obtener todos los dashboards activos

```php
use App\Models\Dashboard;

// Todos los dashboards activos ordenados
$dashboards = Dashboard::active()
    ->ordered()
    ->get();
```

### Obtener un dashboard específico

```php
// Por ID
$dashboard = Dashboard::where('is_active', true)
    ->findOrFail($id);

// Por report_id de Power BI
$dashboard = Dashboard::where('report_id', '2c615028-1b7a-434a-a972-0283dd9ff455')
    ->where('is_active', true)
    ->firstOrFail();
```

### API Controller (ejemplo)

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dashboard;

class DashboardController extends Controller
{
    public function index()
    {
        return Dashboard::active()
            ->ordered()
            ->get();
    }

    public function show($id)
    {
        return Dashboard::where('is_active', true)
            ->findOrFail($id);
    }
}
```

---

## Integración en el Frontend

### Página: Listado de Dashboards (`/cordoba-en-datos`)

```tsx
// app/cordoba-en-datos/page.tsx
import { prisma } from '@/lib/prisma';

export default async function CordobaEnDatosPage() {
  // Obtener todos los dashboards activos
  const dashboards = await prisma.powerbi_dashboards.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      sort_order: 'asc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Córdoba en Datos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboards.map((dashboard) => (
          <DashboardCard key={dashboard.id} dashboard={dashboard} />
        ))}
      </div>
    </div>
  );
}
```

### Componente: Tarjeta de Dashboard

```tsx
// components/DashboardCard.tsx
import Link from 'next/link';

interface DashboardCardProps {
  dashboard: {
    id: number;
    name: string;
    description: string | null;
    thumbnail_url: string | null;
  };
}

export function DashboardCard({ dashboard }: DashboardCardProps) {
  return (
    <Link 
      href={`/cordoba-en-datos/${dashboard.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      {dashboard.thumbnail_url && (
        <img 
          src={dashboard.thumbnail_url} 
          alt={dashboard.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      
      <h3 className="text-xl font-semibold mb-2">{dashboard.name}</h3>
      
      {dashboard.description && (
        <p className="text-gray-600 text-sm line-clamp-3">
          {dashboard.description}
        </p>
      )}
      
      <div className="mt-4 text-blue-600 font-medium">
        Ver dashboard →
      </div>
    </Link>
  );
}
```

### Página: Vista Individual del Dashboard

```tsx
// app/cordoba-en-datos/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PowerBIEmbed } from '@/components/PowerBIEmbed';

export default async function DashboardPage({ params }: { params: { id: string } }) {
  const dashboard = await prisma.powerbi_dashboards.findFirst({
    where: {
      id: parseInt(params.id),
      is_active: true,
    },
  });

  if (!dashboard) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <a href="/" className="hover:text-blue-600">Inicio</a>
        {' > '}
        <a href="/cordoba-en-datos" className="hover:text-blue-600">Córdoba en Datos</a>
        {' > '}
        <span className="text-gray-900">{dashboard.name}</span>
      </nav>

      {/* Título y descripción */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{dashboard.name}</h1>
        {dashboard.description && (
          <p className="text-lg text-gray-700">{dashboard.description}</p>
        )}
      </div>

      {/* Dashboard embebido */}
      <PowerBIEmbed 
        embedUrl={dashboard.embed_url}
        title={dashboard.name}
      />
    </div>
  );
}

// Generar rutas estáticas para todos los dashboards
export async function generateStaticParams() {
  const dashboards = await prisma.powerbi_dashboards.findMany({
    where: { is_active: true },
    select: { id: true },
  });

  return dashboards.map((dashboard) => ({
    id: dashboard.id.toString(),
  }));
}
```

### Componente: Embebido de Power BI

```tsx
// components/PowerBIEmbed.tsx
'use client';

interface PowerBIEmbedProps {
  embedUrl: string;
  title: string;
}

export function PowerBIEmbed({ embedUrl, title }: PowerBIEmbedProps) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        title={title}
        src={embedUrl}
        frameBorder="0"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
      />
    </div>
  );
}
```

---

## Estilos CSS Adicionales

### Responsive Design para el Iframe

```css
/* Contenedor responsive 16:9 */
.powerbi-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.powerbi-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Para pantallas pequeñas, usar altura mínima */
@media (max-width: 768px) {
  .powerbi-container {
    padding-bottom: 75%; /* Más cuadrado en móvil */
    min-height: 500px;
  }
}
```

---

## Características de Seguridad

### URLs de Embebido

Las URLs incluyen parámetros de autenticación:
- `autoAuth=true`: Permite autenticación automática
- `ctid=...`: Tenant ID de la organización

**Nota:** Estos dashboards son públicos dentro de la organización. Si necesitas control de acceso más estricto, considera implementar Power BI Embedded con tokens.

---

## Optimizaciones

### 1. Lazy Loading

```tsx
'use client';
import { useEffect, useState } from 'react';

export function LazyPowerBIEmbed({ embedUrl, title }: PowerBIEmbedProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('powerbi-container');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div id="powerbi-container" className="powerbi-container">
      {isVisible ? (
        <iframe
          title={title}
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500">Cargando dashboard...</p>
        </div>
      )}
    </div>
  );
}
```

### 2. Caché con ISR (Incremental Static Regeneration)

```tsx
// En la página del dashboard
export const revalidate = 3600; // Revalidar cada hora

export default async function DashboardPage({ params }: { params: { id: string } }) {
  // ... código del dashboard
}
```

### 3. Loading State

```tsx
// app/cordoba-en-datos/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-8"></div>
        <div className="w-full h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
```

---

## Ejemplo Completo: Aplicación Next.js

### Estructura de Archivos

```
app/
├── cordoba-en-datos/
│   ├── page.tsx                    # Listado de dashboards
│   ├── [id]/
│   │   ├── page.tsx                # Vista individual
│   │   └── loading.tsx             # Estado de carga
│   └── layout.tsx                  # Layout específico
├── api/
│   └── dashboards/
│       ├── route.ts                # GET /api/dashboards
│       └── [id]/
│           └── route.ts            # GET /api/dashboards/:id
components/
├── PowerBIEmbed.tsx                # Componente de embebido
├── DashboardCard.tsx               # Tarjeta de dashboard
└── DashboardGrid.tsx               # Grilla de dashboards
lib/
└── prisma.ts                       # Cliente de Prisma
```

### API Route (opcional)

```typescript
// app/api/dashboards/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const dashboards = await prisma.powerbi_dashboards.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' },
  });

  return NextResponse.json(dashboards);
}
```

---

## Testing

### Verificar Dashboards desde Terminal

```bash
# En el proyecto Laravel
php artisan tinker --execute="echo 'Total dashboards: ' . \App\Models\Dashboard::count();"

# Ver dashboards activos
php artisan tinker --execute="\App\Models\Dashboard::active()->get(['name', 'report_id'])->each(fn(\$d) => dump(\$d));"
```

### Probar Embebido

1. Acceder a http://127.0.0.1:8000/admin
2. Ir a "Córdoba en Datos" > "Dashboards Power BI"
3. Verificar que los 4 dashboards están listados
4. Hacer clic en "Ver" para probar el embebido

---

## Troubleshooting

### El dashboard no se muestra

**Problema:** Iframe vacío o error de carga

**Soluciones:**
1. Verificar que la URL de embebido es correcta
2. Verificar permisos en Power BI Service
3. Verificar que `is_active` está en `true`
4. Revisar consola del navegador para errores de CORS

### Error de autenticación

**Problema:** "Sign in required" en el iframe

**Soluciones:**
1. Verificar que el dashboard es público en Power BI
2. Verificar que `autoAuth=true` está en la URL
3. Verificar que el `ctid` coincide con tu organización

---

## Próximos Pasos

1. ✅ Dashboards creados en la base de datos
2. ⬜ Implementar páginas en el frontend Next.js
3. ⬜ Agregar miniaturas (thumbnails) a los dashboards
4. ⬜ Implementar búsqueda y filtros
5. ⬜ Agregar analytics para tracking de visualizaciones

---

**Actualizado:** 20 de noviembre de 2025  
**Dashboards disponibles:** 4  
**Estado:** ✅ Listo para integrar en frontend
