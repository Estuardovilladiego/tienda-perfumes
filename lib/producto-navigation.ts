import type { ProductoCatalogo } from "@/app/types/producto";

/** Destino contextual al salir de un producto (categoría principal o catálogo). */
export function destinoVolverProducto(producto: ProductoCatalogo): {
  href: string;
  label: string;
} {
  const categoria = producto.categorias[0];
  if (categoria?.slug) {
    return {
      href: `/categorias/${categoria.slug}`,
      label: categoria.nombre,
    };
  }
  return { href: "/catalogo", label: "Catálogo" };
}
