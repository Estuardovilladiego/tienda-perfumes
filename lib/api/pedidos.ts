import type { CrearPedidoInput } from "@/lib/api/types";
import { validarCarrito } from "@/lib/api/carrito";
import { esModoDemoEstatico } from "@/lib/config";
import { esMetodoPagoValido, labelMetodoPago } from "@/lib/metodos-pago";
import { generarNumeroPedido } from "@/lib/pedido-numero";
import {
  calcularTotalesPedido,
  validarTotalesPedidoCliente,
} from "@/lib/recargo-financiacion";
import { esEmailValido, normalizarEmail } from "@/lib/validate-email";

export async function requiereBaseDeDatos(): Promise<boolean> {
  return !esModoDemoEstatico();
}

export async function crearPedido(input: CrearPedidoInput) {
  if (esModoDemoEstatico()) {
    throw new Error(
      "Los pedidos requieren MySQL. Configura DATABASE_URL y desactiva USE_STATIC_PRODUCTS."
    );
  }

  const nombre = input.nombre?.trim();
  const telefono = input.telefono?.trim();
  const email = normalizarEmail(input.email ?? "");
  const ciudad = input.ciudad?.trim();
  const direccion = input.direccion?.trim();

  if (!nombre || !telefono) {
    throw new Error("Nombre y telefono son obligatorios");
  }
  if (!email || !esEmailValido(email)) {
    throw new Error("Ingresa un correo electrónico válido");
  }
  if (!ciudad || !direccion) {
    throw new Error("Ciudad y direccion son obligatorias");
  }
  if (!input.items?.length) {
    throw new Error("El pedido debe incluir al menos un producto");
  }

  const metodoPago = input.metodoPago?.trim();
  if (!metodoPago || !esMetodoPagoValido(metodoPago)) {
    throw new Error("Selecciona un método de pago válido");
  }

  const notasPartes = [
    input.notas?.trim(),
    input.referenciaPago?.trim()
      ? `Referencia de pago: ${input.referenciaPago.trim()}`
      : null,
  ].filter(Boolean);

  const validacion = await validarCarrito(input.items);
  if (!validacion.valido) {
    throw new Error(validacion.errores.join(". ") || "Carrito inválido");
  }

  const totales = calcularTotalesPedido(validacion.total, metodoPago);
  const errorTotales = validarTotalesPedidoCliente(input, totales);
  if (errorTotales) {
    throw new Error(errorTotales);
  }

  const { prisma } = await import("@/lib/prisma");
  const numeroPedido = generarNumeroPedido();

  const creado = await prisma.pedido.create({
    data: {
      numero: numeroPedido,
      nombre,
      telefono,
      email,
      ciudad,
      direccion,
      metodoPago: labelMetodoPago(metodoPago),
      notas: notasPartes.length ? notasPartes.join("\n") : null,
      subtotal: totales.subtotal,
      recargoFinanciacion: totales.recargoFinanciacion,
      total: totales.total,
      items: {
        create: validacion.items.map((item) => ({
          productoId: item.id,
          nombre: item.nombre,
          imagen: item.imagen,
          volumen: item.volumen,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
      },
    },
    include: { items: true },
  });

  const stockAplicado: { productoId: number; cantidad: number }[] = [];

  try {
    for (const item of validacion.items) {
      const producto = await prisma.producto.findFirst({
        where: { id: item.id, activo: true },
        select: { stock: true },
      });

      if (!producto) {
        throw new Error(`${item.nombre} no está disponible`);
      }

      const stockAnterior = producto.stock;
      const actualizado = await prisma.producto.updateMany({
        where: { id: item.id, stock: { gte: item.cantidad } },
        data: { stock: { decrement: item.cantidad } },
      });

      if (actualizado.count === 0) {
        throw new Error(
          `${item.nombre}: solo hay ${stockAnterior} unidad(es) disponible(s)`
        );
      }

      stockAplicado.push({ productoId: item.id, cantidad: item.cantidad });

      await prisma.inventarioMovimiento.create({
        data: {
          productoId: item.id,
          tipo: "pedido",
          cantidad: item.cantidad,
          stockAnterior,
          stockNuevo: stockAnterior - item.cantidad,
          motivo: `Pedido ${numeroPedido}`,
        },
      });
    }
  } catch (error) {
    for (const mov of stockAplicado.reverse()) {
      await prisma.producto.update({
        where: { id: mov.productoId },
        data: { stock: { increment: mov.cantidad } },
      });
    }

    await prisma.pedidoItem.deleteMany({ where: { pedidoId: creado.id } });
    await prisma.pedido.delete({ where: { id: creado.id } });

    throw error;
  }

  return creado;
}

/** Envía confirmación al cliente y aviso al admin. */
export async function notificarPedidoPorEmail(
  pedido: {
    numero: string;
    nombre: string;
    email: string | null;
    telefono: string;
    ciudad: string;
    direccion: string;
    metodoPago: string;
    subtotal: number;
    recargoFinanciacion: number;
    total: number;
    createdAt: Date;
    items: {
      nombre: string;
      volumen: string | null;
      cantidad: number;
      precioUnitario: number;
    }[];
  }
) {
  if (!pedido.email?.trim()) {
    return {
      cliente: { enviado: false as const, motivo: "sin_email" },
      admin: { enviado: false as const, motivo: "sin_email" },
    };
  }

  const { enviarConfirmacionPedido, enviarAvisoPedidoAdmin } = await import("@/lib/email");

  const payload = {
    numero: pedido.numero,
    nombre: pedido.nombre,
    email: pedido.email,
    telefono: pedido.telefono,
    ciudad: pedido.ciudad,
    direccion: pedido.direccion,
    metodoPago: pedido.metodoPago,
    subtotal: pedido.subtotal,
    recargoFinanciacion: pedido.recargoFinanciacion,
    total: pedido.total,
    fecha: pedido.createdAt,
    items: pedido.items.map((i) => ({
      nombre: i.nombre,
      volumen: i.volumen,
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario,
    })),
  };

  try {
    const cliente = await enviarConfirmacionPedido(payload);
    const admin = await enviarAvisoPedidoAdmin(payload);
    if (!cliente.enviado || !admin.enviado) {
      console.warn("[email] Resultado envío pedido", pedido.numero, {
        cliente,
        admin,
      });
    }
    return { cliente, admin };
  } catch (e) {
    console.error("[email] No se pudo enviar confirmación de pedido:", e);
    return {
      cliente: { enviado: false as const, motivo: "error" },
      admin: { enviado: false as const, motivo: "error" },
    };
  }
}

export async function listarPedidos(limite = 20) {
  if (esModoDemoEstatico()) {
    throw new Error("Listar pedidos requiere MySQL");
  }

  const { prisma } = await import("@/lib/prisma");
  return prisma.pedido.findMany({
    take: limite,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

function esErrorConexionDb(message: string) {
  return (
    message.includes("pool timeout") ||
    message.includes("Transaction API error") ||
    message.includes("ECONNREFUSED") ||
    message.includes("connect ETIMEDOUT") ||
    message.includes("Can't connect")
  );
}

export function mensajeErrorCrearPedido(error: unknown): { message: string; status: number } {
  const message = error instanceof Error ? error.message : "Error al crear pedido";

  if (message.includes("requieren MySQL")) {
    return { message, status: 503 };
  }

  if (esErrorConexionDb(message)) {
    return {
      message:
        "No pudimos conectar con la base de datos. Verifica que MySQL esté activo y reinicia el servidor.",
      status: 503,
    };
  }

  return { message, status: 400 };
}
