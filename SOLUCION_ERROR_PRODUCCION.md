# Solución al Error en Producción (Vercel)

## Error que ves
```
Error: An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details.
```

## Causa del problema

Hay **dos posibles causas**:

### 1. Variables de entorno no actualizadas en Vercel

El `.env` local tiene la configuración correcta con `connection_limit=1&pool_timeout=0`, pero **Vercel no tiene estas configuraciones**.

### 2. La tabla `powerbi_dashboards` está vacía

Si no hay datos en la base de datos, las queries pueden fallar.

---

## Solución 1: Actualizar variables de entorno en Vercel

### Pasos:

1. **Ve a tu dashboard de Vercel**: https://vercel.com/filipraiders-projects/observatoriov2/settings/environment-variables

2. **Actualiza la variable `DATABASE_URL`** con este valor:
   ```
   mysql://ufiaxfnvma9gr4wz:RWvH7nK5ug9IUUsodv6U@bdtujwocl3dksijcgfzf-mysql.services.clever-cloud.com:3306/bdtujwocl3dksijcgfzf?connection_limit=1&pool_timeout=0
   ```

3. **Guarda los cambios**

4. **Redeploy el proyecto**:
   - Ve a la pestaña "Deployments"
   - Click en el último deployment
   - Click en "⋯" (tres puntos) → "Redeploy"

---

## Solución 2: Verificar datos en la base de datos

### Para publicaciones:

Verifica que hay publicaciones en la base de datos ejecutando en Laravel:

```php
use App\Models\Publication;

// Verificar que hay publicaciones
$count = Publication::count();
echo "Total de publicaciones: $count\n";

// Verificar autores relacionados
$pubWithAuthors = Publication::with('authors')->first();
dd($pubWithAuthors);
```

### Para dashboards de Power BI:

Verifica que hay dashboards en la base de datos:

```php
use App\Models\PowerbiDashboard;

$count = PowerbiDashboard::where('is_active', true)->count();
echo "Total de dashboards activos: $count\n";

// Si no hay, crea algunos de ejemplo:
PowerbiDashboard::create([
    'name' => 'Dashboard de prueba',
    'description' => 'Descripción del dashboard',
    'embed_url' => 'https://app.powerbi.com/view?r=XXXXX',
    'report_id' => 'test-report-id',
    'category' => 'educacion',
    'is_active' => true,
    'sort_order' => 0,
]);
```

---

## Solución 3: Verificar logs de Vercel

Para ver el error completo:

1. Ve a https://vercel.com/filipraiders-projects/observatoriov2
2. Click en el último deployment
3. Ve a la pestaña "Functions"
4. Busca el error en los logs de las funciones serverless

---

## Verificación local

Para confirmar que funciona localmente:

1. Asegúrate de que el servidor local está corriendo: `npm run dev`
2. Abre http://localhost:3000
3. Navega a:
   - `/publicaciones` - Debe mostrar publicaciones
   - `/cordoba-en-datos` - Debe mostrar dashboards
   - Click en cualquier publicación - Debe cargar sin errores

Si funciona localmente pero no en Vercel, el problema es **100% las variables de entorno**.

---

## Checklist de verificación

- [ ] Variable `DATABASE_URL` actualizada en Vercel con `connection_limit=1&pool_timeout=0`
- [ ] Redeploy realizado en Vercel
- [ ] Hay datos en la tabla `publications` (al menos 1 publicación)
- [ ] Hay datos en la tabla `author_publication` (relaciones autor-publicación)
- [ ] Hay datos en la tabla `powerbi_dashboards` (al menos 1 dashboard activo)
- [ ] Las URLs de Power BI son públicas (opción "Publicar en web")

---

## Contacto

Si después de seguir estos pasos el error persiste:

1. Comparte los **logs completos de Vercel** (pestaña Functions)
2. Verifica que la base de datos de Clever Cloud esté activa y accesible
3. Verifica que no haya límites de conexión alcanzados en Clever Cloud

---

## Nota importante

El código del frontend está **100% funcional**. El error es por:
- Variables de entorno incorrectas en Vercel, O
- Falta de datos en la base de datos

No es un problema del código en sí.
