# 🔧 ACCIÓN REQUERIDA: Migración de Base de Datos

## ⚠️ IMPORTANTE

El frontend de Next.js ha sido actualizado con nuevas funcionalidades que **requieren cambios en la base de datos**. Esta migración es **SEGURA** y **NO DESTRUCTIVA** (solo agrega campos nuevos).

---

## 📋 ¿Qué se agregó?

### Nuevas Funcionalidades del Frontend:
✅ Sistema de filtros avanzados  
✅ Soporte de PDFs con descarga  
✅ Publicaciones destacadas  
✅ Keywords y metadata  
✅ Fechas para eventos/convocatorias  
✅ URLs externas  

### Campos Nuevos en BD:
- **10 campos** en tabla `publications`
- **6 campos** en tabla `publication_types`
- **3 índices** para optimización

---

## 🚀 Opciones para Migrar

### Opción 1: SQL Directo (Más Rápido) ⚡
```bash
# 1. Hacer backup
mysqldump -h bdtujwocl3dksijcgfzf-mysql.services.clever-cloud.com \
  -u ufiaxfnvma9gr4wz -p \
  bdtujwocl3dksijcgfzf > backup_$(date +%Y%m%d).sql

# 2. Ejecutar migración
mysql -h bdtujwocl3dksijcgfzf-mysql.services.clever-cloud.com \
  -u ufiaxfnvma9gr4wz -p \
  bdtujwocl3dksijcgfzf < database/migrations/add_publication_fields.sql
```

### Opción 2: Laravel Migration (Más Controlado) 🎯
```bash
# Crear el archivo de migración (código incluido en BACKEND_MIGRATION_GUIDE.md)
php artisan make:migration add_publication_fields

# Ejecutar
php artisan migrate
```

### Opción 3: Script PHP (Automático) 🤖
```bash
php artisan tinker
# Luego ejecutar:
include('database/scripts/migrate_publication_fields.php');
```

---

## 📚 Documentación Completa

👉 **Lee:** `BACKEND_MIGRATION_GUIDE.md`

Incluye:
- ✅ Lista completa de campos
- ✅ Código para modelos Laravel
- ✅ Código para Filament Resources
- ✅ Ejemplos de uso
- ✅ Tests
- ✅ Rollback si es necesario

---

## 🔒 Seguridad

Esta migración es **100% segura** porque:
- ✅ Solo **AGREGA** columnas (no modifica ni elimina)
- ✅ Todas las columnas son **NULLABLE** (no afecta datos existentes)
- ✅ **Backward compatible** (código actual sigue funcionando)
- ✅ Incluye **rollback** por si acaso

---

## ✅ Checklist

- [ ] 1. **Hacer backup de la BD** (¡Muy importante!)
- [ ] 2. **Ejecutar migración** (elegir una opción)
- [ ] 3. **Verificar** que todo funcionó
- [ ] 4. **Actualizar modelos** Laravel (ver guía)
- [ ] 5. **Actualizar Filament** Resources (ver guía)
- [ ] 6. **Probar** en admin panel
- [ ] 7. **Coordinar con frontend** para testing

---

## 📞 Contacto

Si tienes dudas:
1. Lee `BACKEND_MIGRATION_GUIDE.md` (muy detallado)
2. Revisa los archivos en `database/`
3. Contacta al equipo de frontend

---

## ⏱️ Tiempo Estimado

- **Migración SQL:** 2-5 minutos
- **Actualizar código:** 15-30 minutos
- **Testing:** 30-60 minutos
- **Total:** ~1 hora

---

## 🎯 Resultado

Después de migrar:
- ✅ Frontend funcionará 100%
- ✅ Filament tendrá campos nuevos
- ✅ BD estará optimizada
- ✅ Todo backward compatible

---

**Base de Datos:** Clever Cloud MySQL (Producción)  
**Versión Frontend:** 2.0.0  
**Fecha:** 21 de octubre de 2025  
**Status:** ⚠️ MIGRACIÓN PENDIENTE
