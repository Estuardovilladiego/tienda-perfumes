import type {
  CarritoItemInput,
  CarritoItemValidado,
  ValidarCarritoResponse,
} from "@/lib/api/types";
import { catalogoEssenza } from "@/lib/catalogo-data";
import { esModoDemoEstatico } from "@/lib/config";
import {
  esPresentacionDecantValida,
  productoEnCategoriaDecants,
  resolverPrecioVenta,
  resolverVolumenVenta,
  stockParaVenta,
} from "@/lib/decants";
import { getProductoPorId } from "@/lib/productos";

function stockEstatico(productoId: number): number {
  const item = catalogoEssenza[productoId - 1];
  return item?.stock ?? 0;
}

async function stockProducto(productoId: number): Promise<number> {
  if (esModoDemoEstatico()) return stockEstatico(productoId);

  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.producto.findFirst({
      where: { id: productoId, activo: true },
      select: { stock: true },
    });
    return row?.stock ?? 0;
  } catch {
    return stockEstatico(productoId);
  }
}

export async function validarCarrito(
  items: CarritoItemInput[]
): Promise<ValidarCarritoResponse> {
  const errores: string[] = [];
  const validados: CarritoItemValidado[] = [];

  if (!items.length) {
    return {
      valido: false,
      items: [],
      total: 0,
      errores: ["El carrito está vacío"],
    };
  }

  for (const item of items) {
    const cantidad = Math.max(0, Math.floor(item.cantidad));
    if (cantidad < 1) continue;

    const producto = await getProductoPorId(item.id);
    if (!producto) {
      errores.push(`Producto #${item.id} no existe o no está disponible`);
      continue;
    }

    const rawPresentacion = item.presentacionMl;
    /** Venta decant solo si el cliente eligió 30/50/100 ml; catálogo general = frasco. */
    const compraDecant = rawPresentacion != null;

    if (compraDecant) {
      if (!productoEnCategoriaDecants(producto)) {
        errores.push(`${producto.nombre}: presentación decant no aplica`);
        continue;
      }
      if (!esPresentacionDecantValida(rawPresentacion)) {
        errores.push(`${producto.nombre}: selecciona presentación 30, 50 o 100 ml`);
        continue;
      }
    }

    const presentacionMl = compraDecant ? rawPresentacion : undefined;

    const precio = resolverPrecioVenta(producto, presentacionMl);
    const volumen = resolverVolumenVenta(producto, presentacionMl);

    const stockDb = await stockProducto(item.id);
    const stock = stockParaVenta(
      { stock: stockDb, categorias: producto.categorias },
      presentacionMl,
      compraDecant
    );
    const disponible = stock >= cantidad;
    if (!disponible) {
      errores.push(
        `${producto.nombre}: solo hay ${stock} unidad(es) disponible(s)`
      );
    }

    validados.push({
      id: producto.id,
      nombre: producto.nombre,
      precio,
      cantidad,
      stock,
      disponible,
      subtotal: precio * cantidad,
      imagen: producto.imagen,
      volumen,
      esDecant: compraDecant,
    });
  }

  const total = validados.reduce((acc, i) => acc + i.subtotal, 0);

  return {
    valido: errores.length === 0 && validados.length > 0,
    items: validados,
    total,
    errores,
  };
}
