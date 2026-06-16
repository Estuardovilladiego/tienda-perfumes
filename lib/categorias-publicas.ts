import "server-only";

import { CATEGORIAS, type CategoriaPublica } from "@/lib/categorias";
import { esModoDemoEstatico } from "@/lib/config";
import { prisma } from "@/lib/prisma";

const imagenFallback = "/imagenes/placeholder.svg";

async function getCategoriasFallback(): Promise<CategoriaPublica[]> {
  const { getConteosPorCategoria } = await import("@/lib/productos");
  const conteos = await getConteosPorCategoria();
  return CATEGORIAS.map((cat) => ({
    ...cat,
    cantidad: conteos[cat.slug] ?? 0,
  }));
}

export async function getCategoriasPublicas(): Promise<CategoriaPublica[]> {
  if (esModoDemoEstatico()) return getCategoriasFallback();

  try {
    const rows = await prisma.categoria.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: {
        productos: {
          where: { producto: { activo: true } },
          select: { productoId: true },
        },
      },
    });

    const { getConteosPorCategoria } = await import("@/lib/productos");
    const conteos = await getConteosPorCategoria();

    return rows.map((cat) => ({
      nombre: cat.nombre,
      slug: cat.slug,
      imagen: cat.imagen || imagenFallback,
      cantidad: conteos[cat.slug] ?? cat.productos.length,
    }));
  } catch {
    return getCategoriasFallback();
  }
}

export async function getCategoriaPublicaPorSlug(slug: string) {
  const categorias = await getCategoriasPublicas();
  return categorias.find((cat) => cat.slug === slug) ?? null;
}
