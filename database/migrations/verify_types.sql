SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'bdtujwocl3dksijcgfzf' 
  AND TABLE_NAME = 'publication_types'
  AND COLUMN_NAME IN (
    'allows_pdf', 'requires_pdf', 'has_event_dates',
    'icon', 'color', 'sort_order'
)
ORDER BY ORDINAL_POSITION;
