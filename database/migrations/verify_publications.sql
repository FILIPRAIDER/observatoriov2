SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bdtujwocl3dksijcgfzf' 
  AND TABLE_NAME = 'publications'
  AND COLUMN_NAME IN (
    'pdf_url', 'pdf_file_id', 'pdf_original_name', 'pdf_size',
    'event_date', 'submission_deadline', 'registration_deadline',
    'external_url', 'is_featured', 'keywords'
)
ORDER BY ORDINAL_POSITION;
