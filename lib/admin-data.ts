import "server-only";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { mensajeSkuDuplicado } from "@/lib/admin-api-error";
import {
  type CategoriaAdminInput,
  type EstadoPedidoInput,
  type ProductoAdminInput,
  slugify,
} from "@/lib/admin-validation";

const productoInclude = {
  marca: true,
  familia: true,
  categorias: { include: { categoria: true }, orderBy: { categoria: { orden: "asc" as const } } },
};

export { generarNumeroPedido } from "@/lib/pedido-numero";

function imagenesFromJson(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function mapProductoAdmin(producto: any) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    marca: producto.marca?.nombre ?? "",
    marcaId: producto.marcaId,
    descripcion: producto.descripcion,
    precio: producto.precio,
    precioAnterior: producto.precioAnterior,
    sku: producto.sku,
    volumen: producto.volumen,
    stock: producto.stock,
    imagen: producto.imagen,
    imagenes: imagenesFromJson(producto.imagenes),
    destacado: producto.destacado,
    esNuevo: producto.esNuevo,
    enOferta: producto.enOferta,
    activo: producto.activo,
    familiaOlfativa: producto.familia?.nombre ?? "",
    familiaId: producto.familiaId,
    notasSalida: producto.notasSalida ?? "",
    notasCorazon: producto.notasCorazon ?? "",
    notasFondo: producto.notasFondo ?? "",
    categorias: producto.categorias.map((pc: any) => pc.categoria),
    createdAt: producto.createdAt,
    updatedAt: producto.updatedAt,
  };
}

async function getMarcaId(nombre: string) {
  const trimmed = nombre.trim();
  const slug = slugify(trimmed);
  const marca = await prisma.marca.upsert({
    where: { slug },
    create: { nombre: trimmed, slug },
    update: { nombre: trimmed },
  });
  return marca.id;
}

async function getFamiliaId(nombre: string | null) {
  const trimmed = nombre?.trim();
  if (!trimmed) return null;

  const slug = slugify(trimmed);
  if (!slug) return null;

  const familia = await prisma.familiaOlfativa.upsert({
    where: { slug },
    create: { nombre: trimmed, slug },
    update: { nombre: trimmed },
  });
  return familia.id;
}

export async function getDashboardAdmin() {
  const [totalProductos, totalCategorias, totalPedidos, pocoStock, agotados, ultimosPedidos] =
    await Promise.all([
      prisma.producto.count({ where: { activo: true } }),
      prisma.categoria.count(),
      prisma.pedido.count(),
      prisma.producto.count({ where: { activo: true, stock: { gt: 0, lt: 5 } } }),
      prisma.producto.count({ where: { activo: true, stock: 0 } }),
      prisma.pedido.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } }),
    ]);

  return { totalProductos, totalCategorias, totalPedidos, pocoStock, agotados, ultimosPedidos };
}

export async function listarProductosAdmin() {
  const productos = await prisma.producto.findMany({
    include: productoInclude,
    orderBy: { updatedAt: "desc" },
  });
  return productos.map(mapProductoAdmin);
}

export async function obtenerProductoAdmin(id: number) {
  const producto = await prisma.producto.findUnique({ where: { id }, include: productoInclude });
  return producto ? mapProductoAdmin(producto) : null;
}

async function assertSkuDisponible(sku: string | null, productoId?: number) {
  const codigo = sku?.trim();
  if (!codigo) return;

  if (productoId) {
    const actual = await prisma.producto.findUnique({
      where: { id: productoId },
      select: { sku: true },
    });
    if (actual?.sku?.trim() === codigo) return;
  }

  const otro = await prisma.producto.findFirst({
    where: {
      sku: codigo,
      ...(productoId ? { id: { not: productoId } } : {}),
    },
    select: { nombre: true },
  });

  if (otro) {
    throw new Error(mensajeSkuDuplicado(codigo, otro.nombre));
  }
}

export async function guardarProductoAdmin(input: ProductoAdminInput, id?: number) {
  await assertSkuDisponible(input.sku, id);
  const marcaId = await getMarcaId(input.marca);
  const familiaId = await getFamiliaId(input.familiaOlfativa);
  const data = {
    nombre: input.nombre,
    descripcion: input.descripcion,
    precio: input.precio,
    precioAnterior: input.precioAnterior,
    sku: input.sku,
    volumen: input.volumen,
    stock: input.stock,
    imagen: input.imagen,
    imagenes: input.imagenes,
    destacado: input.destacado,
    esNuevo: input.esNuevo,
    enOferta: input.enOferta,
    activo: input.activo,
    marcaId,
    familiaId,
    notasSalida: input.notasSalida,
    notasCorazon: input.notasCorazon,
    notasFondo: input.notasFondo,
  };

  const productoId = id
    ? (await prisma.producto.update({ where: { id }, data, select: { id: true } })).id
    : (await prisma.producto.create({ data, select: { id: true } })).id;

  await prisma.productoCategoria.deleteMany({ where: { productoId } });
  if (input.categorias.length) {
    await prisma.productoCategoria.createMany({
      data: input.categorias.map((categoriaId) => ({ productoId, categoriaId })),
      skipDuplicates: true,
    });
  }

  const producto = await prisma.producto.findUniqueOrThrow({
    where: { id: productoId },
    include: productoInclude,
  });

  return mapProductoAdmin(producto);
}

export async function eliminarProductoAdmin(id: number) {
  await prisma.producto.update({ where: { id }, data: { activo: false } });
}

export async function listarCategoriasAdmin() {
  return prisma.categoria.findMany({
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    include: { productos: { include: { producto: { include: { marca: true } } } } },
  });
}

export async function guardarCategoriaAdmin(input: CategoriaAdminInput, id?: number) {
  return id
    ? prisma.categoria.update({ where: { id }, data: input })
    : prisma.categoria.create({ data: input });
}

export async function eliminarCategoriaAdmin(id: number) {
  await prisma.categoria.delete({ where: { id } });
}

export async function listarInventarioAdmin() {
  const [productos, movimientos] = await Promise.all([
    prisma.producto.findMany({
      where: { activo: true },
      include: { marca: true },
      orderBy: [{ stock: "asc" }, { nombre: "asc" }],
    }),
    prisma.inventarioMovimiento.findMany({
      take: 40,
      orderBy: { createdAt: "desc" },
      include: { producto: { include: { marca: true } } },
    }),
  ]);
  return { productos, movimientos };
}

export async function ajustarInventarioAdmin(
  productoId: number,
  modo: "ajustar" | "incrementar" | "reducir",
  cantidad: number,
  motivo?: string
) {
  return prisma.$transaction(async (tx) => {
    const producto = await tx.producto.findUniqueOrThrow({ where: { id: productoId } });
    const stockAnterior = producto.stock;
    const stockNuevo =
      modo === "ajustar"
        ? cantidad
        : modo === "incrementar"
          ? stockAnterior + cantidad
          : stockAnterior - cantidad;

    if (!Number.isInteger(cantidad) || cantidad < 0 || stockNuevo < 0) {
      throw new Error("Movimiento de inventario inválido");
    }

    const actualizado = await tx.producto.update({
      where: { id: productoId },
      data: { stock: stockNuevo },
    });

    await tx.inventarioMovimiento.create({
      data: {
        productoId,
        tipo: modo,
        cantidad,
        stockAnterior,
        stockNuevo,
        motivo: motivo?.trim() || null,
      },
    });

    return actualizado;
  });
}

export async function listarPedidosAdmin() {
  return prisma.pedido.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function cambiarEstadoPedidoAdmin(id: number, estado: EstadoPedidoInput) {
  return prisma.pedido.update({ where: { id }, data: { estado } });
}

export async function eliminarPedidoAdmin(id: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    select: { id: true, estado: true },
  });

  if (!pedido) throw new Error("Pedido no encontrado");

  if (pedido.estado !== "entregado") {
    throw new Error("Solo se pueden eliminar pedidos con estado «entregado»");
  }

  await prisma.pedido.delete({ where: { id } });
}

/** Estados válidos para estadísticas: confirmados en adelante (excluye pendiente y cancelado). */
const ESTADOS_VENTAS_STATS = ["confirmado", "preparando", "enviado", "entregado"] as const;

export type MonthlyStatsAdmin = Awaited<ReturnType<typeof getMonthlyStatsAdmin>>;

export async function getMonthlyStatsAdmin(month: number, year: number) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0, 0);

  const pedidos = await prisma.pedido.findMany({
    where: {
      createdAt: { gte: start, lt: end },
      estado: { in: [...ESTADOS_VENTAS_STATS] },
    },
    select: {
      total: true,
      createdAt: true,
      items: {
        select: {
          productoId: true,
          nombre: true,
          cantidad: true,
          precioUnitario: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const totalSales = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
  const totalOrders = pedidos.length;
  const averageTicket = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  const productMap = new Map<number, { name: string; units: number; revenue: number }>();

  for (const pedido of pedidos) {
    for (const item of pedido.items) {
      const existing = productMap.get(item.productoId) ?? {
        name: item.nombre,
        units: 0,
        revenue: 0,
      };
      existing.units += item.cantidad;
      existing.revenue += item.precioUnitario * item.cantidad;
      productMap.set(item.productoId, existing);
    }
  }

  const topProducts = [...productMap.values()]
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue)
    .slice(0, 5)
    .map((product) => ({
      name: product.name,
      units: product.units,
      revenue: product.revenue,
    }));

  const bestSeller = topProducts[0]
    ? { name: topProducts[0].name, units: topProducts[0].units }
    : { name: "—", units: 0 };

  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyMap = new Map<number, number>();
  for (let day = 1; day <= daysInMonth; day += 1) {
    dailyMap.set(day, 0);
  }

  for (const pedido of pedidos) {
    const day = pedido.createdAt.getDate();
    if (day >= 1 && day <= daysInMonth) {
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + pedido.total);
    }
  }

  const dailySales = Array.from(dailyMap.entries()).map(([day, sales]) => ({
    day,
    label: String(day),
    sales,
  }));

  return {
    month,
    year,
    totalSales,
    totalOrders,
    averageTicket,
    bestSeller,
    dailySales,
    topProducts,
  };
}
