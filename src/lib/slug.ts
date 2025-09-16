export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD") // quita tildes
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // solo letras/números/espacios/-
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function deslugify(slug: string) {
  // aproximación para consulta: reemplaza "-" por espacio
  return slug.replace(/-/g, " ").trim();
}
