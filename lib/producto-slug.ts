import { slugify } from "@/lib/catalogo-data";

/** Slug URL estable a partir del nombre del perfume (ej. "Dior Sauvage" → dior-sauvage). */
export function slugProducto(nombre: string): string {
  return slugify(nombre);
}

export function rutaProducto(slug: string): string {
  return `/producto/${slug}`;
}

export function urlProductoAbsoluta(slug: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}${rutaProducto(slug)}`;
}
