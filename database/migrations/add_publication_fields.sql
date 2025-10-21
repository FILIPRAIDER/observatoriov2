-- ============================================
-- MIGRACIÓN: Agregar Campos a Publicaciones
-- Fecha: 2025-10-21
-- Versión: 2.0.0
-- Base de datos: MySQL (Clever Cloud)
-- ============================================

-- IMPORTANTE: Esta migración es SEGURA y NO elimina ningún dato existente
-- Solo agrega campos nuevos opcionales (nullable)

USE bdtujwocl3dksijcgfzf;

-- ============================================
-- 1. AGREGAR CAMPOS A TABLA publications
-- ============================================

-- Campos para PDFs
ALTER TABLE publications 
ADD COLUMN pdf_url VARCHAR(500) NULL COMMENT 'URL del PDF en ImageKit' AFTER content;

ALTER TABLE publications 
ADD COLUMN pdf_file_id VARCHAR(255) NULL COMMENT 'ID del archivo en ImageKit' AFTER pdf_url;

ALTER TABLE publications 
ADD COLUMN pdf_original_name VARCHAR(255) NULL COMMENT 'Nombre original del archivo PDF' AFTER pdf_file_id;

ALTER TABLE publications 
ADD COLUMN pdf_size BIGINT UNSIGNED NULL COMMENT 'Tamaño del PDF en bytes' AFTER pdf_original_name;

-- Campos para fechas adicionales (eventos/convocatorias)
ALTER TABLE publications 
ADD COLUMN event_date DATE NULL COMMENT 'Fecha del evento' AFTER pdf_size;

ALTER TABLE publications 
ADD COLUMN submission_deadline DATE NULL COMMENT 'Fecha límite de envío' AFTER event_date;

ALTER TABLE publications 
ADD COLUMN registration_deadline DATE NULL COMMENT 'Fecha límite de inscripción' AFTER submission_deadline;

-- Campos adicionales
ALTER TABLE publications 
ADD COLUMN external_url VARCHAR(500) NULL COMMENT 'URL externa relacionada' AFTER registration_deadline;

ALTER TABLE publications 
ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Publicación destacada' AFTER external_url;

ALTER TABLE publications 
ADD COLUMN keywords TEXT NULL COMMENT 'Palabras clave separadas por comas' AFTER is_featured;

-- Agregar índices para optimización
CREATE INDEX idx_publications_is_featured ON publications(is_featured);
CREATE INDEX idx_publications_publication_date ON publications(publication_date);

-- ============================================
-- 2. AGREGAR CAMPOS A TABLA publication_types
-- ============================================

-- Configuración de tipos
ALTER TABLE publication_types 
ADD COLUMN allows_pdf TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Permite adjuntar PDF' AFTER description;

ALTER TABLE publication_types 
ADD COLUMN requires_pdf TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Requiere PDF obligatorio' AFTER allows_pdf;

ALTER TABLE publication_types 
ADD COLUMN has_event_dates TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Tiene fechas de evento' AFTER requires_pdf;

-- Visualización
ALTER TABLE publication_types 
ADD COLUMN icon VARCHAR(255) NULL COMMENT 'Ícono heroicon' AFTER has_event_dates;

ALTER TABLE publication_types 
ADD COLUMN color VARCHAR(50) NULL COMMENT 'Color en formato hex' AFTER icon;

ALTER TABLE publication_types 
ADD COLUMN sort_order INT NOT NULL DEFAULT 0 COMMENT 'Orden de visualización' AFTER color;

-- Agregar índice para ordenamiento
CREATE INDEX idx_publication_types_sort_order ON publication_types(sort_order);

-- ============================================
-- 3. VERIFICAR QUE LAS MIGRACIONES FUNCIONARON
-- ============================================

-- Verificar columnas en publications
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bdtujwocl3dksijcgfzf' 
  AND TABLE_NAME = 'publications'
  AND COLUMN_NAME IN (
    'pdf_url', 'pdf_file_id', 'pdf_original_name', 'pdf_size',
    'event_date', 'submission_deadline', 'registration_deadline',
    'external_url', 'is_featured', 'keywords'
);

-- Verificar columnas en publication_types
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bdtujwocl3dksijcgfzf' 
  AND TABLE_NAME = 'publication_types'
  AND COLUMN_NAME IN (
    'allows_pdf', 'requires_pdf', 'has_event_dates',
    'icon', 'color', 'sort_order'
);

-- Verificar índices creados
SHOW INDEX FROM publications WHERE Key_name IN ('idx_publications_is_featured', 'idx_publications_publication_date');
SHOW INDEX FROM publication_types WHERE Key_name = 'idx_publication_types_sort_order';

-- ============================================
-- 4. DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Actualizar tipos de publicación con colores e íconos predefinidos
-- Solo si los tipos ya existen con estos IDs

-- UPDATE publication_types SET 
--     color = '#3b82f6', 
--     icon = 'heroicon-o-clipboard-document-list',
--     allows_pdf = 1,
--     requires_pdf = 1,
--     sort_order = 1
-- WHERE id = 1 AND name = 'Informe de Investigación';

-- UPDATE publication_types SET 
--     color = '#8b5cf6', 
--     icon = 'heroicon-o-academic-cap',
--     allows_pdf = 1,
--     requires_pdf = 1,
--     sort_order = 2
-- WHERE id = 2 AND name = 'Artículo Académico';

-- UPDATE publication_types SET 
--     color = '#10b981', 
--     icon = 'heroicon-o-newspaper',
--     allows_pdf = 0,
--     requires_pdf = 0,
--     sort_order = 3
-- WHERE id = 3 AND name = 'Boletín Informativo';

-- UPDATE publication_types SET 
--     color = '#f59e0b', 
--     icon = 'heroicon-o-megaphone',
--     allows_pdf = 0,
--     requires_pdf = 0,
--     has_event_dates = 1,
--     sort_order = 4
-- WHERE id = 4 AND name = 'Convocatoria';

-- UPDATE publication_types SET 
--     color = '#ef4444', 
--     icon = 'heroicon-o-calendar',
--     allows_pdf = 0,
--     requires_pdf = 0,
--     has_event_dates = 1,
--     sort_order = 5
-- WHERE id = 5 AND name = 'Evento Académico';

-- ============================================
-- ROLLBACK (Solo si es necesario deshacer)
-- ============================================
-- NO EJECUTAR A MENOS QUE SEA ABSOLUTAMENTE NECESARIO

/*
-- Eliminar índices
DROP INDEX idx_publications_is_featured ON publications;
DROP INDEX idx_publications_publication_date ON publications;
DROP INDEX idx_publication_types_sort_order ON publication_types;

-- Eliminar columnas de publications
ALTER TABLE publications DROP COLUMN keywords;
ALTER TABLE publications DROP COLUMN is_featured;
ALTER TABLE publications DROP COLUMN external_url;
ALTER TABLE publications DROP COLUMN registration_deadline;
ALTER TABLE publications DROP COLUMN submission_deadline;
ALTER TABLE publications DROP COLUMN event_date;
ALTER TABLE publications DROP COLUMN pdf_size;
ALTER TABLE publications DROP COLUMN pdf_original_name;
ALTER TABLE publications DROP COLUMN pdf_file_id;
ALTER TABLE publications DROP COLUMN pdf_url;

-- Eliminar columnas de publication_types
ALTER TABLE publication_types DROP COLUMN sort_order;
ALTER TABLE publication_types DROP COLUMN color;
ALTER TABLE publication_types DROP COLUMN icon;
ALTER TABLE publication_types DROP COLUMN has_event_dates;
ALTER TABLE publication_types DROP COLUMN requires_pdf;
ALTER TABLE publication_types DROP COLUMN allows_pdf;
*/
