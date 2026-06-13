import type { CategoriaRef, ProductoCatalogo } from "@/app/types/producto";

/** ¿El producto pertenece a esta categoría (por slug)? */
export function productoTieneCategoria(
  producto: ProductoCatalogo,
  categoriaSlug: string
): boolean {
  return producto.categorias.some((c) => c.slug === categoriaSlug);
}

/** Texto para UI: "Hombre, Árabes" */
export function formatearCategorias(producto: ProductoCatalogo): string {
  if (!producto.categorias.length) return "—";
  return producto.categorias.map((c) => c.nombre).join(", ");
}

/** Género principal (primera categoría que no sea Árabes), para badges opcionales. */
export function categoriaGeneroPrincipal(
  producto: ProductoCatalogo
): CategoriaRef | null {
  return (
    producto.categorias.find((c) => c.slug !== "arabes") ??
    producto.categorias[0] ??
    null
  );
}

/** Filtra productos que tengan al menos la categoría indicada. */
export function filtrarProductosPorCategoriaSlug(
  lista: ProductoCatalogo[],
  categoriaSlug?: string
): ProductoCatalogo[] {
  if (!categoriaSlug) return lista;
  return lista.filter((p) => productoTieneCategoria(p, categoriaSlug));
}

/** Cuenta productos por slug (un perfume puede sumar en varias categorías). */
export function contarPorCategoriaSlug(
  productos: ProductoCatalogo[]
): Record<string, number> {
  const conteos: Record<string, number> = {};
  for (const p of productos) {
    for (const c of p.categorias) {
      conteos[c.slug] = (conteos[c.slug] ?? 0) + 1;
    }
  }
  return conteos;
}

export function mapCategoriasFromPrisma(
  rows: { categoria: { nombre: string; slug: string } }[]
): CategoriaRef[] {
  return rows.map((r) => ({
    nombre: r.categoria.nombre,
    slug: r.categoria.slug,
  }));
}
