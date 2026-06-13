/** Imagen por defecto mientras no se suban fotos reales de productos */
export const IMAGEN_PLACEHOLDER = "/imagenes/placeholder.svg";

export function urlImagenProducto(imagen?: string | null): string {
  const url = imagen?.trim();
  return url || IMAGEN_PLACEHOLDER;
}
