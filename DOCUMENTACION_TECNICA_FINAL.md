# 📘 Documentación Técnica del Proyecto - Parte 4: Configuración y Deployment

**Proyecto:** Observatorio Educativo v2  
**Fecha:** Noviembre 9, 2025

---

## 🔐 Variables de Entorno

### Archivo: `.env` (no incluido en el repositorio)

```env
# Base de Datos MySQL
DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_base_datos"

# Next.js
NEXT_PUBLIC_SITE_URL="https://tu-dominio.com"

# ImageKit (opcional, si se usa para transformaciones)
NEXT_PUBLIC_IMAGEKIT_URL="https://ik.imagekit.io/tu_id"

# Google Maps API (si se usa)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu_api_key"

# Mapbox (si se usa)
NEXT_PUBLIC_MAPBOX_TOKEN="tu_token"
```

### Variables Requeridas

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ Sí | Conexión a MySQL |
| `NEXT_PUBLIC_SITE_URL` | ❌ No | URL del sitio (para metadata) |
| `NEXT_PUBLIC_IMAGEKIT_URL` | ❌ No | URL base de ImageKit |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ❌ No | API Key de Google Maps |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ❌ No | Token de Mapbox |

### Formato de DATABASE_URL

```
mysql://[usuario]:[password]@[host]:[puerto]/[nombre_base_datos]
```

**Ejemplo:**
```
mysql://root:mi_password@localhost:3306/observatorio_db
```

---

## 📦 Instalación y Configuración

### 1. Requisitos Previos

- **Bun**: 1.1.0 o superior
- **MySQL**: 8.x o superior
- **Git**: Para clonar el repositorio

### 2. Clonar el Repositorio

```powershell
git clone https://github.com/FILIPRAIDER/observatoriov2.git
cd observatoriov2
```

### 3. Instalar Dependencias

```powershell
bun install
```

### 4. Configurar Base de Datos

```sql
CREATE DATABASE observatorio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Crear `.env`:
```env
DATABASE_URL="mysql://root:tu_password@localhost:3306/observatorio_db"
```

### 5. Generar Cliente Prisma

```powershell
bun run prisma:generate
```

### 6. Iniciar Servidor

```powershell
bun run dev
```

---

## 🚀 Deployment

### Opción 1: Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar `DATABASE_URL`
3. Deploy automático

### Opción 2: VPS/Servidor

```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash

# Clonar e instalar
git clone https://github.com/FILIPRAIDER/observatoriov2.git
cd observatoriov2
bun install
bun run build
bun run start
```

---

## 🔧 Scripts Disponibles

```powershell
# Desarrollo
bun run dev

# Build de producción
bun run build
bun run start

# Prisma
bun run prisma:generate
bunx prisma studio

# Linting
bun run lint
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```powershell
bun run prisma:generate
```

### Error: "PrismaClientInitializationError"
Verificar `.env` y conexión a MySQL

### Imágenes no cargan
Agregar dominio a `remotePatterns` en `next.config.ts`

### Puerto 3000 en uso
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

## ✅ Checklist de Producción

- [ ] `bun run build` sin errores
- [ ] Variables de entorno configuradas
- [ ] Backup de base de datos
- [ ] SSL/HTTPS habilitado
- [ ] Lighthouse Score > 90
- [ ] Logs y monitoring configurados

---

## 📚 Resumen Completo para Manual

### Stack Tecnológico
- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 4
- **Base de Datos**: MySQL 8 con Prisma ORM 6
- **Runtime**: Bun 1.1+
- **Librerías**: Framer Motion, Embla Carousel, Swiper, Mapbox GL

### Arquitectura
- App Router de Next.js 15
- Server Components por defecto
- Server Actions para lógica de negocio
- Prisma para acceso a datos
- Caché con React cache()

### Funcionalidades Principales
1. **Sistema de Publicaciones**
   - Lista paginada con scroll infinito
   - Búsqueda en tiempo real (debounce 300ms)
   - Filtros múltiples (tipo, PDF, destacadas)
   - Página de detalle completa
   - Descarga de PDFs

2. **Home Page**
   - Hero con carrusel
   - Quiénes somos
   - Servicios
   - Publicaciones destacadas
   - Aliados (marquee)
   - FAQs
   - Contacto

3. **Córdoba en Datos**
   - Integración con Power BI
   - Visualización de estadísticas

### Base de Datos
- **Tablas principales**: publications, authors, publication_types, images
- **Relaciones**: 1:N entre authors y publications, N:1 entre publications y publication_types, 1:N entre publications e images
- **Índices optimizados** para búsquedas y filtros

### Instalación
```powershell
git clone https://github.com/FILIPRAIDER/observatoriov2.git
cd observatoriov2
bun install
# Configurar .env con DATABASE_URL
bun run prisma:generate
bun run dev
```

### Deployment
- **Vercel**: Deploy automático con integración GitHub
- **VPS**: Node.js 20+, MySQL 8+, Nginx, PM2
- **Docker**: Dockerfile y docker-compose incluidos

---

**FIN DE LA DOCUMENTACIÓN TÉCNICA COMPLETA**

**Archivos generados:**
1. `DOCUMENTACION_TECNICA_PARTE1.md` - Información General y Stack
2. `DOCUMENTACION_TECNICA_PARTE2.md` - Arquitectura y Base de Datos
3. `DOCUMENTACION_TECNICA_PARTE4.md` - Componentes (originalmente Parte 3)
4. `DOCUMENTACION_TECNICA_FINAL.md` - Configuración y Deployment (este archivo)

Con esta documentación tienes todo lo necesario para generar el manual técnico y de usuario del proyecto.
