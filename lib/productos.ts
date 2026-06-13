import type { ProductoCatalogo } from "@/app/types/producto";
import {
  type MarcaCatalogo,
  type OrdenCatalogo,
  extraerMarcas,
  filtrarPorMarcaSlug,
  ordenarProductos,
  parseMarcaSlug,
  parseOrdenCatalogo,
} from "@/lib/catalogo-filtros";
import {
  contarPorCategoriaSlug,
  filtrarProductosPorCategoriaSlug,
  mapCategoriasFromPrisma,
} from "@/lib/categoria-producto";
import {
  PRODUCTOS_POR_PAGINA,
  catalogoEssenza,
} from "@/lib/catalogo-data";
import { resolverNotas } from "@/lib/notas-perfumes-default";
import { slugProducto } from "@/lib/producto-slug";
import { productosEstaticos } from "@/lib/productos-estaticos";

export type FuenteProductos = "mysql" | "estatico";

export type FiltrosProductos = {
  busqueda?: string;
  categoriaSlug?: string;
  orden?: OrdenCatalogo;
  marcaSlug?: string;
};

export type ProductosResult = {
  productos: ProductoCatalogo[];
  fuente: FuenteProductos;
};

export type ProductosPaginados = ProductosResult & {
  total: number;
  pagina: number;
  totalPaginas: number;
  porPagina: number;
  busqueda: string;
  orden: OrdenCatalogo;
  marca: string;
  marcas: MarcaCatalogo[];
};

const includeProducto = {
  marca: true,
  familia: true,
  categorias: {
    include: { categoria: true },
    orderBy: { categoria: { orden: "asc" as const } },
  },
};

function usarDatosEstaticos(): boolean {
  return process.env.USE_STATIC_PRODUCTS === "true";
}

function mapProducto(p: {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior: number | null;
  imagen: string;
  volumen: string;
  stock: number;
  esNuevo: boolean;
  enOferta: boolean;
  destacado: boolean;
  notasSalida?: string | null;
  notasCorazon?: string | null;
  notasFondo?: string | null;
  categorias: { categoria: { nombre: string; slug: string } }[];
  marca: { nombre: string } | null;
  familia: { nombre: string } | null;
}): ProductoCatalogo {
  const slug = slugProducto(p.nombre);
  const notas = resolverNotas(slug, p);

  return {
    id: p.id,
    slug,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    precioAnterior: p.precioAnterior,
    imagen: p.imagen,
    volumen: p.volumen,
    stock: p.stock,
    esNuevo: p.esNuevo,
    enOferta: p.enOferta,
    destacado: p.destacado,
    categorias: mapCategoriasFromPrisma(p.categorias),
    marca: p.marca?.nombre ?? null,
    familia: p.familia?.nombre ?? null,
    notasSalida: notas?.salida ?? null,
    notasCorazon: notas?.corazon ?? null,
    notasFondo: notas?.fondo ?? null,
  };
}

function normalizarBusqueda(q?: string): string {
  return q?.trim() ?? "";
}

function filtrarPorBusqueda(
  lista: ProductoCatalogo[],
  busqueda: string
): ProductoCatalogo[] {
  if (!busqueda) return lista;

  const term = busqueda.toLowerCase();
  return lista.filter(
    (p) =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      (p.marca?.toLowerCase().includes(term) ?? false) ||
      p.categorias.some((c) => c.nombre.toLowerCase().includes(term)) ||
      (p.familia?.toLowerCase().includes(term) ?? false) ||
      p.volumen.toLowerCase().includes(term)
  );
}

function paginarLista<T>(lista: T[], pagina: number, porPagina: number) {
  const total = lista.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const paginaSegura = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaSegura - 1) * porPagina;
  return {
    items: lista.slice(inicio, inicio + porPagina),
    total,
    pagina: paginaSegura,
    totalPaginas,
    porPagina,
  };
}

function whereCategoriaSlug(slug: string) {
  return {
    categorias: {
      some: {
        categoria: { slug },
      },
    },
  };
}

function whereBusqueda(busqueda: string) {
  return {
    OR: [
      { nombre: { contains: busqueda } },
      { descripcion: { contains: busqueda } },
      { volumen: { contains: busqueda } },
      { marca: { nombre: { contains: busqueda } } },
      {
        categorias: {
          some: { categoria: { nombre: { contains: busqueda } } },
        },
      },
      { familia: { nombre: { contains: busqueda } } },
    ],
  };
}

export async function getProductos(): Promise<ProductosResult> {
  if (usarDatosEstaticos()) {
    return { productos: productosEstaticos, fuente: "estatico" };
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.producto.findMany({
      where: { activo: true },
      include: includeProducto,
      orderBy: { nombre: "asc" },
    });
    return {
      productos: rows.map(mapProducto),
      fuente: "mysql",
    };
  } catch {
    return { productos: productosEstaticos, fuente: "estatico" };
  }
}

function whereMarcaSlug(marcaSlug: string) {
  return {
    marca: { slug: marcaSlug },
  };
}

function prismaOrderBy(orden: OrdenCatalogo) {
  switch (orden) {
    case "precio-asc":
      return { precio: "asc" as const };
    case "precio-desc":
      return { precio: "desc" as const };
    case "nuevo":
      return [{ esNuevo: "desc" as const }, { nombre: "asc" as const }];
    default:
      return { nombre: "asc" as const };
  }
}

function aplicarFiltrosLista(
  lista: ProductoCatalogo[],
  filtros: FiltrosProductos,
  categoriaBase?: ProductoCatalogo[]
) {
  let result = categoriaBase ?? lista;
  result = filtrarProductosPorCategoriaSlug(result, filtros.categoriaSlug);
  result = filtrarPorBusqueda(result, normalizarBusqueda(filtros.busqueda));
  result = filtrarPorMarcaSlug(result, parseMarcaSlug(filtros.marcaSlug));
  return ordenarProductos(result, parseOrdenCatalogo(filtros.orden));
}

function paginadoDesdeLista(
  lista: ProductoCatalogo[],
  pagina: number,
  porPagina: number,
  filtros: FiltrosProductos,
  fuente: FuenteProductos
): ProductosPaginados {
  const marcas = extraerMarcas(lista);
  const { items, total, pagina: p, totalPaginas } = paginarLista(lista, pagina, porPagina);

  return {
    productos: items,
    fuente,
    total,
    pagina: p,
    totalPaginas,
    porPagina,
    busqueda: normalizarBusqueda(filtros.busqueda),
    orden: parseOrdenCatalogo(filtros.orden),
    marca: parseMarcaSlug(filtros.marcaSlug),
    marcas,
  };
}

export async function getProductosPaginados(
  pagina: number,
  porPagina = PRODUCTOS_POR_PAGINA,
  filtros: FiltrosProductos = {}
): Promise<ProductosPaginados> {
  const busqueda = normalizarBusqueda(filtros.busqueda);
  const categoriaSlug = filtros.categoriaSlug?.trim() || undefined;
  const orden = parseOrdenCatalogo(filtros.orden);
  const marcaSlug = parseMarcaSlug(filtros.marcaSlug);

  if (usarDatosEstaticos()) {
    const filtrados = aplicarFiltrosLista(productosEstaticos, {
      ...filtros,
      busqueda,
      categoriaSlug,
      orden,
      marcaSlug,
    });
    return paginadoDesdeLista(filtrados, pagina, porPagina, {
      ...filtros,
      busqueda,
      categoriaSlug,
      orden,
      marcaSlug,
    }, "estatico");
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const where = {
      activo: true,
      ...(busqueda ? whereBusqueda(busqueda) : {}),
      ...(categoriaSlug ? whereCategoriaSlug(categoriaSlug) : {}),
      ...(marcaSlug ? whereMarcaSlug(marcaSlug) : {}),
    };

    const [total, rows, todosParaMarcas] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({
        where,
        include: includeProducto,
        orderBy: prismaOrderBy(orden),
        skip: (Math.max(1, pagina) - 1) * porPagina,
        take: porPagina,
      }),
      prisma.producto.findMany({
        where: {
          activo: true,
          ...(categoriaSlug ? whereCategoriaSlug(categoriaSlug) : {}),
        },
        include: { marca: true },
        orderBy: { nombre: "asc" },
      }),
    ]);

    const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
    const marcas = extraerMarcas(
      todosParaMarcas.map((p) => ({ marca: p.marca?.nombre ?? null }))
    );

    return {
      productos: rows.map(mapProducto),
      fuente: "mysql",
      total,
      pagina: Math.min(Math.max(1, pagina), totalPaginas),
      totalPaginas,
      porPagina,
      busqueda,
      orden,
      marca: marcaSlug,
      marcas,
    };
  } catch {
    const filtrados = aplicarFiltrosLista(productosEstaticos, {
      ...filtros,
      busqueda,
      categoriaSlug,
      orden,
      marcaSlug,
    });
    return paginadoDesdeLista(filtrados, pagina, porPagina, {
      ...filtros,
      busqueda,
      categoriaSlug,
      orden,
      marcaSlug,
    }, "estatico");
  }
}

export async function getConteosPorCategoria(): Promise<
  Record<string, number>
> {
  const { productos } = await getProductos();
  return contarPorCategoriaSlug(productos);
}

export async function getProductoPorSlug(
  slug: string
): Promise<ProductoCatalogo | null> {
  const normalizado = slug.trim().toLowerCase();
  if (!normalizado) return null;

  const { productos } = await getProductos();
  return productos.find((p) => p.slug === normalizado) ?? null;
}

export async function getProductosRelacionados(
  producto: ProductoCatalogo,
  limite = 4
): Promise<ProductoCatalogo[]> {
  const { productos } = await getProductos();
  const slugsCat = new Set(producto.categorias.map((c) => c.slug));

  return productos
    .filter(
      (p) =>
        p.id !== producto.id &&
        p.categorias.some((c) => slugsCat.has(c.slug))
    )
    .slice(0, limite);
}

export async function getProductoPorId(
  id: number
): Promise<ProductoCatalogo | null> {
  if (!Number.isFinite(id) || id < 1) return null;

  if (usarDatosEstaticos()) {
    return productosEstaticos.find((p) => p.id === id) ?? null;
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.producto.findFirst({
      where: { id, activo: true },
      include: includeProducto,
    });
    return row ? mapProducto(row) : null;
  } catch {
    return productosEstaticos.find((p) => p.id === id) ?? null;
  }
}

export async function getDestacados(limite = 4): Promise<ProductosResult> {
  const { productos, fuente } = await getProductos();
  const destacados = productos.filter((p) => p.destacado || p.esNuevo);
  const lista =
    destacados.length >= limite
      ? destacados.slice(0, limite)
      : productos.slice(0, limite);
  return { productos: lista, fuente };
}

export { PRODUCTOS_POR_PAGINA, catalogoEssenza };
