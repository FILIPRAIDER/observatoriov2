-- Agregar campo pdf_url
ALTER TABLE publications ADD COLUMN pdf_url VARCHAR(500) NULL COMMENT 'URL del PDF en ImageKit' AFTER content;
