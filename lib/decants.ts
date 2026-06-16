import type { CategoriaRef, ProductoCatalogo } from "@/app/types/producto";

export const CATEGORIA_DECANTS_SLUG = "decants";
export const CATEGORIA_DECANTS_NOMBRE = "Decants";

export const VOLUMENES_DECANT_ML = [30, 50, 100] as const;
export type VolumenDecantML = (typeof VOLUMENES_DECANT_ML)[number];

export const PRECIOS_DECANT_COP: Record<VolumenDecantML, number> = {
  30: 25_000,
  50: 35_000,
  100: 45_000,
};

export type OpcionPresentacion = {
  ml: VolumenDecantML;
  volumen: string;
  precio: number;
};

const SUFIJO_DECANT_DUPLICADO = / — Decant \d+ ML$/i;

/** Productos duplicados creados por error (no deben existir). */
export function esProductoDecantDuplicado(nombre: string) {
  return SUFIJO_DECANT_DUPLICADO.test(nombre.trim());
}

export function productoEnCategoriaDecants(producto: {
  categorias?: CategoriaRef[];
}) {
  return producto.categorias?.some((c) => c.slug === CATEGORIA_DECANTS_SLUG) ?? false;
}

/** Vista activa de la categoría Decants (precios y presentaciones decant). */
export function esVistaDecants(categoriaSlug?: string | null) {
  return categoriaSlug === CATEGORIA_DECANTS_SLUG;
}

export function opcionesPresentacionDecant(): OpcionPresentacion[] {
  return VOLUMENES_DECANT_ML.map((ml) => ({
    ml,
    volumen: `${ml} ML`,
    precio: PRECIOS_DECANT_COP[ml],
  }));
}

export function esPresentacionDecantValida(ml: number): ml is VolumenDecantML {
  return ml === 30 || ml === 50 || ml === 100;
}

export function precioPresentacionDecant(ml: number): number | null {
  if (!esPresentacionDecantValida(ml)) return null;
  return PRECIOS_DECANT_COP[ml];
}

/** Precio efectivo: decant si tiene presentación; si no, precio del frasco en catálogo. */
export function resolverPrecioVenta(
  producto: Pick<ProductoCatalogo, "precio" | "categorias">,
  presentacionMl?: number | null
) {
  if (
    productoEnCategoriaDecants(producto) &&
    presentacionMl &&
    esPresentacionDecantValida(presentacionMl)
  ) {
    return PRECIOS_DECANT_COP[presentacionMl];
  }
  return producto.precio;
}

export function resolverVolumenVenta(
  producto: Pick<ProductoCatalogo, "volumen" | "categorias">,
  presentacionMl?: number | null
) {
  if (
    productoEnCategoriaDecants(producto) &&
    presentacionMl &&
    esPresentacionDecantValida(presentacionMl)
  ) {
    return etiquetaVolumenDecant(presentacionMl);
  }
  return producto.volumen;
}

/** Etiqueta unificada para carrito, pedidos, correo y WhatsApp. */
export function etiquetaVolumenDecant(ml: number) {
  return `Decant · ${ml} ML`;
}

export function esLineaDecant(volumen: string | null | undefined) {
  return !!volumen && /^Decant · /i.test(volumen.trim());
}

export function detalleLineaPedido(volumen: string | null | undefined, cantidad: number) {
  const vol = volumen?.trim();
  if (!vol) return `Cant. ${cantidad}`;
  return `${vol} · Cant. ${cantidad}`;
}

export function precioDesdeDecant(_producto: ProductoCatalogo) {
  return PRECIOS_DECANT_COP[30];
}

/** Stock decant: solo aplica en vista Decants o al comprar con presentación. */
export function stockParaVenta(
  producto: { stock?: number | null; categorias?: CategoriaRef[] },
  presentacionMl?: number | null,
  vistaDecants = false
): number {
  const base = Math.max(0, producto.stock ?? 0);
  const enDecants = productoEnCategoriaDecants(producto);
  const modoDecant =
    vistaDecants || (presentacionMl != null && esPresentacionDecantValida(presentacionMl));
  if (!enDecants || !modoDecant) return base;
  if (presentacionMl != null && !esPresentacionDecantValida(presentacionMl)) return base;
  return Math.max(base, 99);
}

export function puedeVenderDecant(producto: { categorias?: CategoriaRef[] }) {
  return productoEnCategoriaDecants(producto);
}

/** Clave única de línea en carrito (mismo id + distinta presentación = líneas distintas). */
export function lineaCarritoKey(item: { id: number; presentacionMl?: number | null }) {
  return item.presentacionMl ? `${item.id}-d${item.presentacionMl}` : String(item.id);
}

export function mismasLineaCarrito(
  a: { id: number; presentacionMl?: number | null },
  b: { id: number; presentacionMl?: number | null }
) {
  return lineaCarritoKey(a) === lineaCarritoKey(b);
}
