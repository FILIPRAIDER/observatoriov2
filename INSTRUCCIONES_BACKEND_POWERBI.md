# 🔧 INSTRUCCIONES PARA EL BACKEND LARAVEL

## ⚠️ AJUSTE REQUERIDO EN LA MIGRACIÓN

El frontend de Next.js está listo para consumir los dashboards desde la base de datos usando Prisma.

### Cambio necesario en la migración de Laravel:

**Archivo:** `database/migrations/XXXX_XX_XX_create_powerbi_dashboards_table.php`

**Cambio requerido:**
- El campo `category` debe ser tipo `ENUM` o `VARCHAR(50)` en lugar de solo valores predefinidos
- Los valores permitidos son: `'educacion'`, `'economia'`, `'demografia'`, `'infraestructura'`, `'salud'`, `'otro'`

### Código sugerido para la migración:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('powerbi_dashboards', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->string('embed_url', 1000);
            $table->string('workspace_id', 255)->nullable();
            $table->string('report_id', 255);
            $table->enum('category', [
                'educacion',
                'economia', 
                'demografia',
                'infraestructura',
                'salud',
                'otro'
            ])->default('educacion');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('thumbnail_url', 500)->nullable();
            $table->timestamps();

            // Índices para optimizar consultas
            $table->index(['is_active', 'sort_order'], 'idx_powerbi_dashboards_active_sort');
            $table->index('category', 'idx_powerbi_dashboards_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('powerbi_dashboards');
    }
};
```

### Modelo Dashboard (si no existe):

**Archivo:** `app/Models/Dashboard.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dashboard extends Model
{
    protected $table = 'powerbi_dashboards';

    protected $fillable = [
        'name',
        'description',
        'embed_url',
        'workspace_id',
        'report_id',
        'category',
        'is_active',
        'sort_order',
        'thumbnail_url',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
```

### API Controller (opcional, si quieres exponer como API REST):

**Archivo:** `app/Http/Controllers/Api/DashboardController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dashboard;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $dashboards = Dashboard::active()
            ->ordered()
            ->get();

        return response()->json($dashboards);
    }

    public function show(int $id): JsonResponse
    {
        $dashboard = Dashboard::active()
            ->findOrFail($id);

        return response()->json($dashboard);
    }

    public function byCategory(string $category): JsonResponse
    {
        $dashboards = Dashboard::active()
            ->byCategory($category)
            ->ordered()
            ->get();

        return response()->json($dashboards);
    }
}
```

### Rutas API (opcional):

**Archivo:** `routes/api.php`

```php
use App\Http\Controllers\Api\DashboardController;

Route::prefix('dashboards')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('/{id}', [DashboardController::class, 'show']);
    Route::get('/category/{category}', [DashboardController::class, 'byCategory']);
});
```

---

## ✅ VERIFICACIÓN

Una vez aplicados los cambios:

1. Ejecutar la migración:
```bash
php artisan migrate
```

2. Verificar que los dashboards existen:
```bash
php artisan tinker --execute="echo Dashboard::count();"
```

3. Ver dashboards activos:
```bash
php artisan tinker --execute="Dashboard::active()->get(['name', 'report_id'])->each(fn(\$d) => dump(\$d));"
```

---

## 🎯 FRONTEND CONECTADO

El frontend Next.js ya está configurado para:

✅ Leer dashboards desde la base de datos vía Prisma
✅ Mostrar grid de tarjetas en `/cordoba-en-datos`
✅ Página individual para cada dashboard en `/cordoba-en-datos/[id]`
✅ Embebido de Power BI con iframe responsive
✅ Caché de 1 hora con React cache()
✅ ISR (Incremental Static Regeneration)

---

## 📝 NOTAS IMPORTANTES

1. **El campo `category` debe coincidir** con los valores TypeScript del frontend:
   - `educacion`
   - `economia`
   - `demografia`
   - `infraestructura`
   - `salud`
   - `otro`

2. **Los IDs en Prisma son BigInt** por lo que en Next.js se manejan como `bigint` de JavaScript

3. **Las URLs de embebido** deben incluir todos los parámetros necesarios de Power BI

4. **Sin API REST:** El frontend consulta directamente la base de datos con Prisma (no necesita API de Laravel)

---

**Siguiente paso:** Ejecutar `bun run prisma:generate` en el frontend después de verificar que la tabla existe en MySQL.
