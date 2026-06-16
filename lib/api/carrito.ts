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

    const enDecants = productoEnCategoriaDecants(producto);
    const presentacionMl = item.presentacionMl;

    if (enDecants) {
      if (!presentacionMl || !esPresentacionDecantValida(presentacionMl)) {
        errores.push(`${producto.nombre}: selecciona presentación 30, 50 o 100 ml`);
        continue;
      }
    } else if (presentacionMl) {
      errores.push(`${producto.nombre}: presentación decant no aplica`);
      continue;
    }

    const precio = resolverPrecioVenta(producto, presentacionMl);
    const volumen = resolverVolumenVenta(producto, presentacionMl);

    const stockDb = await stockProducto(item.id);
    const stock = stockParaVenta(
      { stock: stockDb, categorias: producto.categorias },
      presentacionMl,
      !!presentacionMl
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
      esDecant: enDecants && !!presentacionMl,
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
