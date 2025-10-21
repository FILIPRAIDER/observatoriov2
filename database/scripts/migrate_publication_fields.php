<?php
/**
 * Script de Migración Manual
 * 
 * Este script ejecuta las migraciones directamente desde Laravel
 * Útil si prefieres no usar archivos SQL directamente
 * 
 * Uso: php artisan tinker
 * Luego: include('database/scripts/migrate_publication_fields.php');
 */

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "🚀 Iniciando migración de campos de publicaciones...\n\n";

// Verificar conexión
try {
    DB::connection()->getPdo();
    echo "✅ Conexión a base de datos exitosa\n";
} catch (\Exception $e) {
    echo "❌ Error de conexión: " . $e->getMessage() . "\n";
    exit(1);
}

// ============================================
// 1. MIGRAR TABLA publications
// ============================================

echo "\n📊 Migrando tabla 'publications'...\n";

try {
    // Verificar si las columnas ya existen
    $hasFields = Schema::hasColumns('publications', [
        'pdf_url', 'pdf_file_id', 'pdf_original_name', 'pdf_size',
        'event_date', 'submission_deadline', 'registration_deadline',
        'external_url', 'is_featured', 'keywords'
    ]);
    
    if ($hasFields) {
        echo "⚠️  Los campos ya existen en 'publications'. Saltando...\n";
    } else {
        DB::statement('ALTER TABLE publications ADD COLUMN pdf_url VARCHAR(500) NULL COMMENT "URL del PDF en ImageKit" AFTER content');
        DB::statement('ALTER TABLE publications ADD COLUMN pdf_file_id VARCHAR(255) NULL COMMENT "ID del archivo en ImageKit" AFTER pdf_url');
        DB::statement('ALTER TABLE publications ADD COLUMN pdf_original_name VARCHAR(255) NULL COMMENT "Nombre original del archivo PDF" AFTER pdf_file_id');
        DB::statement('ALTER TABLE publications ADD COLUMN pdf_size BIGINT UNSIGNED NULL COMMENT "Tamaño del PDF en bytes" AFTER pdf_original_name');
        DB::statement('ALTER TABLE publications ADD COLUMN event_date DATE NULL COMMENT "Fecha del evento" AFTER pdf_size');
        DB::statement('ALTER TABLE publications ADD COLUMN submission_deadline DATE NULL COMMENT "Fecha límite de envío" AFTER event_date');
        DB::statement('ALTER TABLE publications ADD COLUMN registration_deadline DATE NULL COMMENT "Fecha límite de inscripción" AFTER submission_deadline');
        DB::statement('ALTER TABLE publications ADD COLUMN external_url VARCHAR(500) NULL COMMENT "URL externa relacionada" AFTER registration_deadline');
        DB::statement('ALTER TABLE publications ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 COMMENT "Publicación destacada" AFTER external_url');
        DB::statement('ALTER TABLE publications ADD COLUMN keywords TEXT NULL COMMENT "Palabras clave separadas por comas" AFTER is_featured');
        
        echo "✅ Campos agregados a 'publications'\n";
    }
    
    // Crear índices si no existen
    $indexes = DB::select("SHOW INDEX FROM publications WHERE Key_name IN ('idx_publications_is_featured', 'idx_publications_publication_date')");
    
    if (count($indexes) < 2) {
        DB::statement('CREATE INDEX idx_publications_is_featured ON publications(is_featured)');
        DB::statement('CREATE INDEX idx_publications_publication_date ON publications(publication_date)');
        echo "✅ Índices creados en 'publications'\n";
    } else {
        echo "⚠️  Índices ya existen en 'publications'. Saltando...\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error en 'publications': " . $e->getMessage() . "\n";
    exit(1);
}

// ============================================
// 2. MIGRAR TABLA publication_types
// ============================================

echo "\n📊 Migrando tabla 'publication_types'...\n";

try {
    // Verificar si las columnas ya existen
    $hasFields = Schema::hasColumns('publication_types', [
        'allows_pdf', 'requires_pdf', 'has_event_dates',
        'icon', 'color', 'sort_order'
    ]);
    
    if ($hasFields) {
        echo "⚠️  Los campos ya existen en 'publication_types'. Saltando...\n";
    } else {
        DB::statement('ALTER TABLE publication_types ADD COLUMN allows_pdf TINYINT(1) NOT NULL DEFAULT 1 COMMENT "Permite adjuntar PDF" AFTER description');
        DB::statement('ALTER TABLE publication_types ADD COLUMN requires_pdf TINYINT(1) NOT NULL DEFAULT 0 COMMENT "Requiere PDF obligatorio" AFTER allows_pdf');
        DB::statement('ALTER TABLE publication_types ADD COLUMN has_event_dates TINYINT(1) NOT NULL DEFAULT 0 COMMENT "Tiene fechas de evento" AFTER requires_pdf');
        DB::statement('ALTER TABLE publication_types ADD COLUMN icon VARCHAR(255) NULL COMMENT "Ícono heroicon" AFTER has_event_dates');
        DB::statement('ALTER TABLE publication_types ADD COLUMN color VARCHAR(50) NULL COMMENT "Color en formato hex" AFTER icon');
        DB::statement('ALTER TABLE publication_types ADD COLUMN sort_order INT NOT NULL DEFAULT 0 COMMENT "Orden de visualización" AFTER color');
        
        echo "✅ Campos agregados a 'publication_types'\n";
    }
    
    // Crear índice si no existe
    $indexes = DB::select("SHOW INDEX FROM publication_types WHERE Key_name = 'idx_publication_types_sort_order'");
    
    if (count($indexes) === 0) {
        DB::statement('CREATE INDEX idx_publication_types_sort_order ON publication_types(sort_order)');
        echo "✅ Índice creado en 'publication_types'\n";
    } else {
        echo "⚠️  Índice ya existe en 'publication_types'. Saltando...\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error en 'publication_types': " . $e->getMessage() . "\n";
    exit(1);
}

// ============================================
// 3. VERIFICAR RESULTADOS
// ============================================

echo "\n🔍 Verificando resultados...\n\n";

// Verificar publications
$pubColumns = DB::select("
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'publications'
      AND COLUMN_NAME IN (
        'pdf_url', 'pdf_file_id', 'pdf_original_name', 'pdf_size',
        'event_date', 'submission_deadline', 'registration_deadline',
        'external_url', 'is_featured', 'keywords'
    )
");

echo "Columnas en 'publications':\n";
foreach ($pubColumns as $col) {
    echo "  - {$col->COLUMN_NAME} ({$col->DATA_TYPE}) - Null: {$col->IS_NULLABLE}\n";
}

// Verificar publication_types
$typeColumns = DB::select("
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'publication_types'
      AND COLUMN_NAME IN (
        'allows_pdf', 'requires_pdf', 'has_event_dates',
        'icon', 'color', 'sort_order'
    )
");

echo "\nColumnas en 'publication_types':\n";
foreach ($typeColumns as $col) {
    echo "  - {$col->COLUMN_NAME} ({$col->DATA_TYPE}) - Null: {$col->IS_NULLABLE}\n";
}

// Verificar índices
$pubIndexes = DB::select("SHOW INDEX FROM publications WHERE Key_name IN ('idx_publications_is_featured', 'idx_publications_publication_date')");
echo "\nÍndices en 'publications': " . count($pubIndexes) . " encontrados\n";

$typeIndexes = DB::select("SHOW INDEX FROM publication_types WHERE Key_name = 'idx_publication_types_sort_order'");
echo "Índices en 'publication_types': " . count($typeIndexes) . " encontrados\n";

// ============================================
// 4. RESUMEN
// ============================================

echo "\n✅ ¡Migración completada exitosamente!\n\n";
echo "📝 Próximos pasos:\n";
echo "  1. Actualizar modelos (Publication.php, PublicationType.php)\n";
echo "  2. Actualizar recursos de Filament\n";
echo "  3. Probar creación/edición de publicaciones\n";
echo "  4. Coordinar con frontend para pruebas integradas\n\n";
echo "📚 Consulta BACKEND_MIGRATION_GUIDE.md para más detalles\n\n";
