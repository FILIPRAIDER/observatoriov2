// src/lib/formatBytes.ts

/**
 * Formatea bytes a una representación legible (KB, MB, GB)
 * @param bytes - Número de bytes a formatear
 * @returns String formateado (ej: "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  const value = bytes / Math.pow(k, i);
  const rounded = Math.round(value * 100) / 100;
  
  return `${rounded} ${sizes[i]}`;
}
