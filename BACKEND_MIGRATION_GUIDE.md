# 📋 DOCUMENTACIÓN PARA BACKEND LARAVEL - Cambios en Publicaciones

## 🚨 IMPORTANTE: Migración de Base de Datos Requerida

**Fecha:** 21 de octubre de 2025  
**Versión Frontend:** 2.0.0  
**Base de Datos:** MySQL (Clever Cloud - Producción)  
**Impacto:** BAJO - Solo agrega campos nuevos (no rompe nada existente)

---

## 📊 Resumen de Cambios

El frontend de Next.js ahora soporta funcionalidades adicionales que requieren nuevos campos en la base de datos. **Esta migración es 100% segura** ya que:

✅ Solo **AGREGA** columnas nuevas  
✅ Todas las columnas son **NULLABLE** (no afecta datos existentes)  
✅ No modifica ni elimina datos existentes  
✅ Backward compatible con el código actual  

---

## 🗄️ Cambios en Base de Datos

### Tabla `publications`

#### Nuevos Campos:

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `pdf_url` | VARCHAR(500) | YES | NULL | URL del PDF en ImageKit |
| `pdf_file_id` | VARCHAR(255) | YES | NULL | ID del archivo en ImageKit |
| `pdf_original_name` | VARCHAR(255) | YES | NULL | Nombre original del PDF |
| `pdf_size` | BIGINT UNSIGNED | YES | NULL | Tamaño del PDF en bytes |
| `event_date` | DATE | YES | NULL | Fecha del evento |
| `submission_deadline` | DATE | YES | NULL | Fecha límite de envío |
| `registration_deadline` | DATE | YES | NULL | Fecha límite de inscripción |
| `external_url` | VARCHAR(500) | YES | NULL | URL externa relacionada |
| `is_featured` | TINYINT(1) | NO | 0 | Publicación destacada (boolean) |
| `keywords` | TEXT | YES | NULL | Palabras clave (separadas por comas) |

#### Índices Agregados:
- `idx_publications_is_featured` - Optimiza filtrado por destacadas
- `idx_publications_publication_date` - Optimiza ordenamiento por fecha

---

### Tabla `publication_types`

#### Nuevos Campos:

| Campo | Tipo | Null | Default | Descripción |
|-------|------|------|---------|-------------|
| `allows_pdf` | TINYINT(1) | NO | 1 | Permite adjuntar PDF |
| `requires_pdf` | TINYINT(1) | NO | 0 | Requiere PDF obligatorio |
| `has_event_dates` | TINYINT(1) | NO | 0 | Tiene fechas de evento |
| `icon` | VARCHAR(255) | YES | NULL | Ícono (heroicon-o-*) |
| `color` | VARCHAR(50) | YES | NULL | Color en formato hex (#rrggbb) |
| `sort_order` | INT | NO | 0 | Orden de visualización |

#### Índice Agregado:
- `idx_publication_types_sort_order` - Optimiza ordenamiento

---

## 🚀 Pasos para Migrar (3 Opciones)

### Opción 1: Migración Manual SQL (Recomendado para Producción)

1. **Hacer Backup de la BD** ⚠️
   ```bash
   # Conectarse a Clever Cloud y hacer backup
   mysqldump -h bdtujwocl3dksijcgfzf-mysql.services.clever-cloud.com \
     -u ufiaxfnvma9gr4wz -p \
     bdtujwocl3dksijcgfzf > backup_$(date +%Y%m%d).sql
   ```

2. **Ejecutar el script SQL**
   ```bash
   # Conectarse a la BD
   mysql -h bdtujwocl3dksijcgfzf-mysql.services.clever-cloud.com \
     -u ufiaxfnvma9gr4wz -p \
     bdtujwocl3dksijcgfzf < database/migrations/add_publication_fields.sql
   ```

3. **Verificar** que todo se aplicó correctamente (el script incluye verificaciones)

---

### Opción 2: Crear Migración de Laravel

Crear archivo de migración en Laravel:

```php
<?php
// database/migrations/2025_10_21_000001_add_publication_fields.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Agregar campos a publications
        Schema::table('publications', function (Blueprint $table) {
            // PDF fields
            $table->string('pdf_url', 500)->nullable()->after('content');
            $table->string('pdf_file_id')->nullable()->after('pdf_url');
            $table->string('pdf_original_name')->nullable()->after('pdf_file_id');
            $table->unsignedBigInteger('pdf_size')->nullable()->after('pdf_original_name');
            
            // Additional dates
            $table->date('event_date')->nullable()->after('pdf_size');
            $table->date('submission_deadline')->nullable()->after('event_date');
            $table->date('registration_deadline')->nullable()->after('submission_deadline');
            
            // Additional fields
            $table->string('external_url', 500)->nullable()->after('registration_deadline');
            $table->boolean('is_featured')->default(false)->after('external_url');
            $table->text('keywords')->nullable()->after('is_featured');
            
            // Índices
            $table->index('is_featured');
            $table->index('publication_date');
        });
        
        // Agregar campos a publication_types
        Schema::table('publication_types', function (Blueprint $table) {
            $table->boolean('allows_pdf')->default(true)->after('description');
            $table->boolean('requires_pdf')->default(false)->after('allows_pdf');
            $table->boolean('has_event_dates')->default(false)->after('requires_pdf');
            $table->string('icon')->nullable()->after('has_event_dates');
            $table->string('color', 50)->nullable()->after('icon');
            $table->integer('sort_order')->default(0)->after('color');
            
            // Índice
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::table('publications', function (Blueprint $table) {
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['publication_date']);
            $table->dropColumn([
                'pdf_url', 'pdf_file_id', 'pdf_original_name', 'pdf_size',
                'event_date', 'submission_deadline', 'registration_deadline',
                'external_url', 'is_featured', 'keywords'
            ]);
        });
        
        Schema::table('publication_types', function (Blueprint $table) {
            $table->dropIndex(['sort_order']);
            $table->dropColumn([
                'allows_pdf', 'requires_pdf', 'has_event_dates',
                'icon', 'color', 'sort_order'
            ]);
        });
    }
};
```

Ejecutar:
```bash
php artisan migrate
```

---

### Opción 3: Desde Filament Admin Panel

Si tienes acceso al panel de Filament en producción, puedes usar **Database Manager** o ejecutar las migraciones desde ahí.

---

## 📝 Actualizar Modelos de Laravel

### Modelo `Publication`

Agregar los nuevos campos al array `$fillable` o `$guarded`:

```php
<?php
// app/Models/Publication.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = [
        // ... campos existentes
        
        // PDF fields
        'pdf_url',
        'pdf_file_id',
        'pdf_original_name',
        'pdf_size',
        
        // Additional dates
        'event_date',
        'submission_deadline',
        'registration_deadline',
        
        // Additional fields
        'external_url',
        'is_featured',
        'keywords',
    ];
    
    protected $casts = [
        // ... casts existentes
        'event_date' => 'date',
        'submission_deadline' => 'date',
        'registration_deadline' => 'date',
        'is_featured' => 'boolean',
    ];
    
    // Scopes útiles
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
    
    public function scopeWithPdf($query)
    {
        return $query->whereNotNull('pdf_url');
    }
}
```

---

### Modelo `PublicationType`

```php
<?php
// app/Models/PublicationType.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicationType extends Model
{
    protected $fillable = [
        // ... campos existentes
        'allows_pdf',
        'requires_pdf',
        'has_event_dates',
        'icon',
        'color',
        'sort_order',
    ];
    
    protected $casts = [
        'allows_pdf' => 'boolean',
        'requires_pdf' => 'boolean',
        'has_event_dates' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    // Ordenar por defecto
    protected static function booted()
    {
        static::addGlobalScope('sorted', function ($query) {
            $query->orderBy('sort_order');
        });
    }
}
```

---

## 🎨 Actualizar Recursos de Filament

### PublicationResource

Agregar los nuevos campos al formulario:

```php
<?php
// app/Filament/Resources/PublicationResource.php

use Filament\Forms;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form->schema([
        // ... campos existentes (title, abstract, content, etc.)
        
        Forms\Components\Section::make('Archivo PDF')
            ->schema([
                Forms\Components\FileUpload::make('pdf_url')
                    ->label('Archivo PDF')
                    ->acceptedFileTypes(['application/pdf'])
                    ->maxSize(10240) // 10MB
                    ->disk('imagekit') // O el disco que uses
                    ->directory('publications/pdfs')
                    ->visibility('public')
                    ->downloadable()
                    ->openable()
                    ->afterStateUpdated(function ($state, callable $set) {
                        if ($state) {
                            $set('pdf_original_name', $state->getClientOriginalName());
                            $set('pdf_size', $state->getSize());
                        }
                    }),
                    
                Forms\Components\Hidden::make('pdf_file_id'),
                Forms\Components\Hidden::make('pdf_original_name'),
                Forms\Components\Hidden::make('pdf_size'),
            ])
            ->collapsible()
            ->visible(fn ($get) => 
                PublicationType::find($get('publication_type_id'))?->allows_pdf ?? false
            ),
        
        Forms\Components\Section::make('Fechas Especiales')
            ->schema([
                Forms\Components\DatePicker::make('event_date')
                    ->label('Fecha del Evento'),
                    
                Forms\Components\DatePicker::make('submission_deadline')
                    ->label('Fecha Límite de Envío'),
                    
                Forms\Components\DatePicker::make('registration_deadline')
                    ->label('Fecha Límite de Inscripción'),
            ])
            ->columns(3)
            ->collapsible()
            ->visible(fn ($get) => 
                PublicationType::find($get('publication_type_id'))?->has_event_dates ?? false
            ),
        
        Forms\Components\Section::make('Información Adicional')
            ->schema([
                Forms\Components\TextInput::make('external_url')
                    ->label('URL Externa')
                    ->url()
                    ->maxLength(500)
                    ->placeholder('https://ejemplo.com'),
                    
                Forms\Components\Toggle::make('is_featured')
                    ->label('Publicación Destacada')
                    ->helperText('Aparecerá en la página principal'),
                    
                Forms\Components\TagsInput::make('keywords')
                    ->label('Palabras Clave')
                    ->placeholder('Presiona Enter para agregar')
                    ->separator(',')
                    ->helperText('Separadas por comas'),
            ])
            ->collapsible(),
    ]);
}

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ... columnas existentes
            
            Tables\Columns\IconColumn::make('is_featured')
                ->label('Destacado')
                ->boolean()
                ->trueIcon('heroicon-o-star')
                ->falseIcon('heroicon-o-star')
                ->trueColor('warning')
                ->falseColor('gray'),
                
            Tables\Columns\IconColumn::make('pdf_url')
                ->label('PDF')
                ->boolean()
                ->exists()
                ->trueIcon('heroicon-o-document')
                ->falseIcon('heroicon-o-x-mark')
                ->trueColor('success')
                ->falseColor('gray'),
        ])
        ->filters([
            Tables\Filters\Filter::make('featured')
                ->label('Destacadas')
                ->query(fn ($query) => $query->where('is_featured', true)),
                
            Tables\Filters\Filter::make('with_pdf')
                ->label('Con PDF')
                ->query(fn ($query) => $query->whereNotNull('pdf_url')),
        ]);
}
```

---

### PublicationTypeResource

```php
<?php
// app/Filament/Resources/PublicationTypeResource.php

public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('name')
            ->required()
            ->maxLength(255),
            
        Forms\Components\Textarea::make('description')
            ->required(),
        
        Forms\Components\Section::make('Configuración')
            ->schema([
                Forms\Components\Toggle::make('allows_pdf')
                    ->label('Permite PDF')
                    ->default(true),
                    
                Forms\Components\Toggle::make('requires_pdf')
                    ->label('Requiere PDF')
                    ->default(false),
                    
                Forms\Components\Toggle::make('has_event_dates')
                    ->label('Tiene Fechas de Evento')
                    ->default(false),
            ])->columns(3),
        
        Forms\Components\Section::make('Visualización')
            ->schema([
                Forms\Components\TextInput::make('icon')
                    ->label('Ícono')
                    ->placeholder('heroicon-o-document')
                    ->helperText('Nombre del ícono de Heroicons'),
                    
                Forms\Components\ColorPicker::make('color')
                    ->label('Color')
                    ->helperText('Color del badge en formato hex'),
                    
                Forms\Components\TextInput::make('sort_order')
                    ->label('Orden')
                    ->numeric()
                    ->default(0)
                    ->helperText('Menor número aparece primero'),
            ])->columns(3),
    ]);
}
```

---

## 🔌 API Endpoints (Si tienes API)

Si expones una API REST desde Laravel, asegúrate de incluir los nuevos campos:

```php
<?php
// app/Http/Resources/PublicationResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PublicationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'abstract' => $this->abstract,
            'content' => $this->content,
            'publication_date' => $this->publication_date->toISOString(),
            
            // PDF info
            'pdf' => $this->pdf_url ? [
                'url' => $this->pdf_url,
                'file_id' => $this->pdf_file_id,
                'original_name' => $this->pdf_original_name,
                'size' => $this->pdf_size,
            ] : null,
            
            // Additional dates
            'event_date' => $this->event_date?->toISOString(),
            'submission_deadline' => $this->submission_deadline?->toISOString(),
            'registration_deadline' => $this->registration_deadline?->toISOString(),
            
            // Additional fields
            'external_url' => $this->external_url,
            'is_featured' => $this->is_featured,
            'keywords' => $this->keywords ? explode(',', $this->keywords) : [],
            
            // Relations
            'author' => new AuthorResource($this->whenLoaded('author')),
            'type' => new PublicationTypeResource($this->whenLoaded('publicationType')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
```

---

## ✅ Testing

### Tests Unitarios

```php
<?php
// tests/Feature/PublicationTest.php

use Tests\TestCase;
use App\Models\Publication;

class PublicationTest extends TestCase
{
    /** @test */
    public function can_create_publication_with_pdf()
    {
        $publication = Publication::factory()->create([
            'pdf_url' => 'https://example.com/doc.pdf',
            'pdf_size' => 1024000,
            'pdf_original_name' => 'documento.pdf',
        ]);
        
        $this->assertNotNull($publication->pdf_url);
        $this->assertEquals(1024000, $publication->pdf_size);
    }
    
    /** @test */
    public function can_filter_featured_publications()
    {
        Publication::factory()->create(['is_featured' => true]);
        Publication::factory()->create(['is_featured' => false]);
        
        $featured = Publication::featured()->get();
        
        $this->assertCount(1, $featured);
    }
}
```

---

## 🎯 Valores Recomendados para `publication_types`

Aquí están los valores sugeridos para los tipos comunes:

| Tipo | Color | Ícono | allows_pdf | requires_pdf | has_event_dates |
|------|-------|-------|------------|--------------|-----------------|
| Informe de Investigación | #3b82f6 | heroicon-o-clipboard-document-list | ✅ | ✅ | ❌ |
| Artículo Académico | #8b5cf6 | heroicon-o-academic-cap | ✅ | ✅ | ❌ |
| Boletín Informativo | #10b981 | heroicon-o-newspaper | ✅ | ❌ | ❌ |
| Convocatoria | #f59e0b | heroicon-o-megaphone | ❌ | ❌ | ✅ |
| Evento Académico | #ef4444 | heroicon-o-calendar | ❌ | ❌ | ✅ |
| Nota de Prensa | #6366f1 | heroicon-o-document-text | ❌ | ❌ | ❌ |
| Estadística Educativa | #06b6d4 | heroicon-o-presentation-chart-line | ✅ | ✅ | ❌ |
| Libro o Capítulo | #84cc16 | heroicon-o-book-open | ✅ | ✅ | ❌ |

---

## 🚨 Checklist de Migración

- [ ] **1. Hacer backup de la base de datos** ⚠️
- [ ] **2. Ejecutar script SQL** o crear migración Laravel
- [ ] **3. Verificar** que las columnas se crearon correctamente
- [ ] **4. Actualizar** modelo `Publication.php`
- [ ] **5. Actualizar** modelo `PublicationType.php`
- [ ] **6. Actualizar** `PublicationResource` de Filament
- [ ] **7. Actualizar** `PublicationTypeResource` de Filament
- [ ] **8. Actualizar** API Resources (si aplica)
- [ ] **9. Ejecutar tests** (si los tienes)
- [ ] **10. Probar** en Filament admin panel
- [ ] **11. Coordinar** con frontend para pruebas integradas

---

## 📞 Coordinación Frontend-Backend

### Frontend ya está listo ✅
El frontend de Next.js ya está preparado para consumir estos campos. Una vez que hagas la migración, todo funcionará automáticamente.

### Frontend espera estos campos:
```typescript
{
  // PDF
  pdf_url?: string;
  pdf_file_id?: string;
  pdf_original_name?: string;
  pdf_size?: number;
  
  // Dates
  event_date?: string; // ISO 8601
  submission_deadline?: string;
  registration_deadline?: string;
  
  // Extra
  external_url?: string;
  is_featured: boolean;
  keywords?: string; // CSV
}
```

---

## 🆘 Soporte

Si hay algún problema durante la migración:

1. **Restaurar desde backup** si es necesario
2. **Verificar logs** de MySQL
3. **Revisar** que los tipos de datos coincidan
4. **Contactar** al equipo de frontend si hay dudas sobre el uso

---

## 📅 Timeline Sugerido

1. **Día 1 (Hoy):**
   - Hacer backup
   - Ejecutar migración en staging/desarrollo
   - Probar

2. **Día 2:**
   - Si todo funciona, migrar a producción
   - Actualizar Filament resources
   - Coordinar con frontend

3. **Día 3:**
   - Testing integrado
   - Monitorear errores
   - Ajustes finales

---

**Documentación creada:** 21 de octubre de 2025  
**Versión:** 1.0  
**Autor:** GitHub Copilot  
**Contacto:** Equipo Frontend Next.js
