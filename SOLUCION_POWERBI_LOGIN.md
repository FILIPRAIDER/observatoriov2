# ⚠️ SOLUCIÓN URGENTE: Power BI Pide Inicio de Sesión

## 🔴 Problema

Los dashboards de Power BI están pidiendo "Iniciar sesión" porque **las URLs en la base de datos son PRIVADAS**.

**Esto NO se arregla desde el código del frontend Next.js.** Es una configuración que se debe hacer en **Power BI Service** (el backend de Microsoft).

---

## ✅ Solución Paso a Paso

### 1️⃣ Entra a Power BI Service
Ve a: https://app.powerbi.com

### 2️⃣ Abre el informe/dashboard que quieres hacer público
Busca el dashboard en "Mi área de trabajo" o el workspace correspondiente.

### 3️⃣ Publica en web (hacer público)
1. Click en el informe
2. Click en **Archivo** → **Insertar informe** → **Publicar en web (público)**
3. Click en **Crear código para insertar**
4. Power BI mostrará un iframe con una URL pública

### 4️⃣ Copia la URL pública
La URL se verá así:
```
https://app.powerbi.com/view?r=eyJrIjoiXXXXXXXXXXXX...
```

**IMPORTANTE:** Esta URL es diferente a la URL privada que tienes ahora en la base de datos.

### 5️⃣ Actualiza la base de datos en Laravel
Abre tu panel de administración de Laravel (Filament o phpMyAdmin) y actualiza la tabla `powerbi_dashboards`:

```sql
UPDATE powerbi_dashboards 
SET embed_url = 'https://app.powerbi.com/view?r=eyJrIjoiXXXXXXXXXXXX...'
WHERE id = 8; -- O el ID que corresponda
```

O en PHP/Laravel:
```php
use App\Models\PowerbiDashboard;

PowerbiDashboard::find(8)->update([
    'embed_url' => 'https://app.powerbi.com/view?r=eyJrIjoiXXXXXXXXXXXX...'
]);
```

### 6️⃣ Verifica que funciona
Recarga la página en tu sitio web. El dashboard debería cargar sin pedir login.

---

## 📋 Checklist

Para cada dashboard que quieras hacer público:

- [ ] Entrar a https://app.powerbi.com
- [ ] Abrir el informe
- [ ] Ir a Archivo → Insertar informe → Publicar en web
- [ ] Copiar la URL pública (`https://app.powerbi.com/view?r=...`)
- [ ] Actualizar la tabla `powerbi_dashboards` con la nueva URL
- [ ] Verificar que carga sin pedir login

---

## ⚠️ Advertencia de Seguridad

**"Publicar en web"** hace que el dashboard sea **completamente público**. Cualquier persona con el link puede verlo.

Si el dashboard contiene información sensible o privada, **NO uses esta opción**. En ese caso necesitarías Power BI Embedded con Azure (opción de pago).

---

## 🔍 ¿Cómo saber si una URL es pública?

### ✅ URL Pública (correcta):
```
https://app.powerbi.com/view?r=eyJrIjoiXXXXXX...
```
- Contiene `/view?r=`
- NO pide login

### ❌ URL Privada (incorrecta):
```
https://app.powerbi.com/groups/.../reports/...
https://app.powerbi.com/reportEmbed?reportId=...
```
- Contiene `/groups/`, `/reports/`, o `/reportEmbed`
- SÍ pide login

---

## 🆘 Si sigue sin funcionar

1. **Verifica que la URL sea pública** - Ábrela en una ventana de incógnito. Si pide login, no es pública.

2. **Limpia la caché de la base de datos** - En Laravel:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```

3. **Verifica los permisos en Power BI** - En Power BI Service, asegúrate de que el dashboard tenga permisos de "Publicar en web" habilitados (esto puede estar bloqueado por el administrador de Power BI de tu organización).

4. **Contacta al administrador de Power BI** - Si "Publicar en web" no aparece como opción, es porque está deshabilitado a nivel organizacional. Necesitas que el admin lo habilite.

---

## 💡 Resumen

El problema es simple:
- **Causa:** URLs privadas en la base de datos
- **Solución:** Reemplazarlas con URLs públicas generadas desde "Publicar en web"
- **Dónde hacerlo:** Power BI Service (app.powerbi.com)
- **Quién debe hacerlo:** El equipo de backend/base de datos o quien tenga acceso a Power BI

**El frontend de Next.js ya está correctamente configurado.** Solo falta actualizar las URLs en la base de datos.
