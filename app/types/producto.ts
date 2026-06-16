/** Categoría asignada a un producto (relación N:M). */
export type CategoriaRef = {
  nombre: string;
  slug: string;
};

export type ProductoCatalogo = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number | null;
  imagen: string;
  volumen: string;
  esNuevo?: boolean;
  enOferta?: boolean;
  destacado?: boolean;
  categorias: CategoriaRef[];
  marca?: string | null;
  familia?: string | null;
  notasSalida?: string | null;
  notasCorazon?: string | null;
  notasFondo?: string | null;
  stock?: number;
  /** Presentación decant elegida (30, 50 o 100 ml). Mismo producto, distinto precio. */
  presentacionMl?: number | null;
  acordesPrincipales?: { nombre: string; valor: number; color: string }[] | null;
};

export type Producto = ProductoCatalogo & {
  cantidad: number;
};

export type SeccionCategoria = {
  nombre: string;
  slug: string;
  productos: ProductoCatalogo[];
};
