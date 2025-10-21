# 🚀 Guía Rápida de Inicio - Publicaciones Mejoradas

## ⚡ Quick Start

### 1. Verificar Base de Datos

Asegúrate de que tu base de datos MySQL tenga las nuevas columnas. Si no las tiene, ejecuta las migraciones correspondientes desde tu backend Laravel/Filament.

**Campos necesarios en `publications`:**
- pdf_url
- pdf_file_id  
- pdf_original_name
- pdf_size
- event_date
- submission_deadline
- registration_deadline
- external_url
- is_featured
- keywords

**Campos necesarios en `publication_types`:**
- allows_pdf
- requires_pdf
- has_event_dates
- icon
- color
- sort_order

### 2. Prisma ya está configurado ✅

El schema ya fue actualizado y el cliente generado. No necesitas hacer nada más.

### 3. Probar la aplicación

```bash
# Iniciar el servidor de desarrollo
bun run dev
```

Navega a: `http://localhost:3000/publicaciones`

---

## 🎯 Funcionalidades Disponibles

### 🔍 Búsqueda y Filtros

1. **Barra de búsqueda**
   - Escribe cualquier término
   - Busca en: título, abstract, keywords
   - Debounce automático de 300ms

2. **Botón de Filtros**
   - Click en el botón con ícono de filtro
   - Ver contador de filtros activos
   - Panel desplegable con opciones

3. **Filtrar por tipo**
   - Dropdown con todos los tipos disponibles
   - Colores personalizados por tipo

4. **Opciones rápidas**
   - ☑️ Solo con PDF disponible
   - ☑️ Solo destacados

5. **Gestión de filtros**
   - Ver badges de filtros activos
   - Eliminar filtros individuales (X)
   - Botón "Limpiar todo"

### 📄 Visualización de PDFs

#### En el listado:
- Badge rojo "PDF" en la esquina de la imagen
- Botón compacto de descarga al lado de la fecha
- Muestra el tamaño del archivo

#### En la página de detalle:
- Tarjeta destacada para descarga
- Información completa del documento
- Botón grande de descarga

### ⭐ Publicaciones Destacadas

- Badge amarillo "⭐ DESTACADO" en la imagen
- Filtro específico en el panel de filtros
- Prioridad visual en el listado

### 📊 Información Adicional

#### En la página de detalle verás:

1. **Autor**
   - Nombre completo
   - Organización

2. **Keywords**
   - Badges grises con palabras clave
   - Facilita identificar temas

3. **Fechas importantes** (si aplica)
   - Fecha del evento
   - Fecha límite de envío
   - Fecha límite de inscripción

4. **URL externa** (si aplica)
   - Link a sitio relacionado
   - Abre en nueva pestaña

---

## 🎨 Variantes de Botón PDF

Puedes usar el componente `PDFDownloadButton` con 3 variantes:

### 1. Default (Botón grande)
```tsx
<PDFDownloadButton
  pdfUrl="https://example.com/doc.pdf"
  pdfName="documento.pdf"
  pdfSize={1024000}
  variant="default"
/>
```
**Uso:** Página de detalle, llamadas a la acción principales

### 2. Compact (Link pequeño)
```tsx
<PDFDownloadButton
  pdfUrl="https://example.com/doc.pdf"
  pdfName="documento.pdf"
  pdfSize={1024000}
  variant="compact"
/>
```
**Uso:** Cards de listado, espacios reducidos

### 3. Card (Tarjeta visual)
```tsx
<PDFDownloadButton
  pdfUrl="https://example.com/doc.pdf"
  pdfName="documento.pdf"
  pdfSize={1024000}
  variant="card"
/>
```
**Uso:** Página de detalle, destacar la descarga

---

## 🧪 Testing Checklist

Prueba estas funcionalidades:

### Búsqueda y Filtros
- [ ] Buscar por palabra clave
- [ ] Filtrar por tipo de publicación
- [ ] Activar "Solo con PDF"
- [ ] Activar "Solo destacados"
- [ ] Combinar múltiples filtros
- [ ] Limpiar filtros individualmente
- [ ] Limpiar todos los filtros
- [ ] Ver mensaje cuando no hay resultados

### Listado
- [ ] Ver publicaciones ordenadas por fecha
- [ ] Scroll infinito (cargar más)
- [ ] Hover en cards
- [ ] Ver badges de PDF y destacado
- [ ] Click en publicación
- [ ] Descargar PDF desde el listado

### Página de Detalle
- [ ] Ver información completa
- [ ] Ver autor y organización
- [ ] Ver keywords
- [ ] Descargar PDF (si disponible)
- [ ] Ver fechas importantes (si aplica)
- [ ] Click en URL externa (si aplica)
- [ ] Ver publicaciones relacionadas

### Responsive
- [ ] Probar en móvil (< 640px)
- [ ] Probar en tablet (640px - 1024px)
- [ ] Probar en desktop (> 1024px)
- [ ] Verificar que filtros colapsen en móvil
- [ ] Verificar que imágenes se adapten

---

## 🎨 Personalización

### Cambiar colores de badges

Edita `PublicationListItem.tsx`:

```tsx
// Badge de destacado (línea ~75)
<div className="... bg-yellow-400 text-neutral-900 ...">

// Badge de PDF (línea ~85)
<div className="... bg-red-600 text-white ...">
```

### Cambiar límite de resultados por página

Edita `PublicationsSection.tsx`:

```tsx
const LIMIT = 6; // Cambia este número
```

### Modificar tiempo de debounce en búsqueda

Edita `PublicationFilters.tsx`:

```tsx
const timer = setTimeout(() => {
  onFilterChange(filters);
}, 300); // Cambia de 300ms a lo que desees
```

---

## 📚 Estructura de Archivos

```
src/
├── app/
│   ├── actions/
│   │   ├── publications.ts          # ⭐ Server actions con filtros
│   │   └── getFeaturedPublications.ts
│   └── (obsv)/
│       └── publicaciones/
│           ├── page.tsx              # Lista de publicaciones
│           └── [slug]/
│               └── page.tsx          # ⭐ Detalle mejorado
├── components/
│   └── publications/
│       ├── PDFDownloadButton.tsx     # ⭐ NUEVO
│       └── list/
│           ├── PublicationFilters.tsx    # ⭐ NUEVO
│           ├── PublicationStats.tsx      # ⭐ NUEVO
│           ├── PublicationListItem.tsx   # ⭐ Mejorado
│           └── PublicationsSection.tsx   # ⭐ Mejorado
├── lib/
│   ├── formatBytes.ts               # ⭐ NUEVO
│   └── queries/
│       └── publications.ts          # ⭐ Actualizado
└── prisma/
    └── schema.prisma                # ⭐ Actualizado
```

**⭐ = Archivo nuevo o con cambios significativos**

---

## 🔧 Solución de Problemas

### Los filtros no aparecen
**Causa:** No hay tipos de publicación en la BD  
**Solución:** Asegúrate de tener datos en `publication_types`

### Las imágenes no cargan
**Causa:** URLs incorrectas o faltantes  
**Solución:** Verifica que las publicaciones tengan imágenes asociadas o fallback

### El PDF no descarga
**Causa:** Campo `pdf_url` es null o inválido  
**Solución:** Verifica que la publicación tenga un PDF válido en la BD

### Error "Cannot find module '@/components/publications/PDFDownloadButton'"
**Causa:** Path incorrecto o archivo no guardado  
**Solución:** Verifica que el archivo exista en la ruta correcta

### Prisma error "Unknown field..."
**Causa:** Cliente de Prisma desactualizado  
**Solución:** 
```bash
bunx prisma generate
```

---

## 📊 Datos de Prueba Sugeridos

Para probar todas las funcionalidades, asegúrate de tener publicaciones con:

1. **Al menos una con PDF**
   - `pdf_url`: URL válida
   - `pdf_original_name`: "Documento-Ejemplo.pdf"
   - `pdf_size`: 1024000 (1MB)

2. **Al menos una destacada**
   - `is_featured`: true

3. **Al menos una con fechas**
   - `event_date`: Fecha futura
   - `submission_deadline`: Fecha futura
   - `registration_deadline`: Fecha futura

4. **Al menos una con keywords**
   - `keywords`: "educación, investigación, estadística"

5. **Publicaciones de diferentes tipos**
   - Varios `publication_type_id` distintos

---

## 🎓 Recursos Adicionales

### Documentación Completa
- `MEJORAS_PUBLICACIONES.md` - Documentación técnica detallada
- `RESUMEN_MEJORAS.md` - Resumen ejecutivo
- `DOCUMENTACION_FRONTEND.md` - Documentación original de BD

### Ejemplos de Código
Todos los componentes incluyen comentarios explicativos y tipos TypeScript completos.

### Stack Tecnológico
- **Next.js 15** - Framework React
- **Prisma** - ORM
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilos
- **Bun** - Runtime y package manager

---

## ✅ Checklist de Producción

Antes de hacer deploy:

- [ ] Correr `bun run build` sin errores
- [ ] Verificar que todos los filtros funcionen
- [ ] Probar descarga de PDFs
- [ ] Verificar responsive en dispositivos reales
- [ ] Revisar performance con Lighthouse
- [ ] Verificar accesibilidad (ARIA labels)
- [ ] Probar con datos reales de producción
- [ ] Configurar caché de Prisma adecuadamente
- [ ] Verificar que ImageKit esté configurado
- [ ] Backup de base de datos antes de migrar

---

## 🎉 ¡Listo!

Tu sistema de publicaciones ahora cuenta con:
- ✅ Búsqueda avanzada
- ✅ Filtros múltiples
- ✅ Soporte completo de PDFs
- ✅ Publicaciones destacadas
- ✅ Diseño responsive
- ✅ Performance optimizada

**¡Disfruta de las nuevas funcionalidades!** 🚀

---

**Última actualización:** 21 de octubre de 2025  
**Versión:** 2.0.0  
**Autor:** GitHub Copilot
