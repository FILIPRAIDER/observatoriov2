// src/lib/dates.ts

/** Convierte un Date/ISO/DATE (MySQL) a 'YYYY-MM-DD' en UTC */
export function toYMD(d: Date | string): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

/** 'YYYY-MM-DD' -> 'dd/mm/yyyy' */
export function ymdToDMY(ymd: string): string {
  const [y, m, d] = ymd.split("-");
  return `${d}/${m}/${y}`;
}

/** Formatea un ISO en dd/mm/yyyy usando siempre UTC */
export function formatISOShortUTC(iso: string, locale = "es-CO"): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Formatea un ISO en "d de mes de aaaa" (o similar) en UTC */
export function formatISOLongUTC(iso: string, locale = "es-CO"): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
