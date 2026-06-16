import type { Producto } from "@/app/types/producto";
import { esLineaDecant } from "@/lib/decants";
import { formatPrecioCOP } from "@/lib/format-precio";
import {
  type MetodoPagoId,
  cuentaMetodoPago,
  esMetodoPagoValido,
  idMetodoPagoDesdeLabel,
  instruccionesPago,
  labelMetodoPago,
  numeroPedidoVisible,
} from "@/lib/metodos-pago";
import { RECARGO_FINANCIACION_PORCENTAJE, esPagoGuiadoWhatsApp } from "@/lib/recargo-financiacion";
import { site } from "@/lib/site";

export type ItemWhatsAppPedido = {
  nombre: string;
  volumen?: string | null;
  cantidad: number;
  /** Precio unitario del producto */
  precio: number;
};

export type PedidoWhatsAppInfo = {
  pedidoId?: number;
  numero?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  ciudad?: string;
  direccion?: string;
  metodoPago?: string;
  referenciaPago?: string;
  subtotal?: number;
  recargoFinanciacion?: number;
  total?: number;
  fecha?: Date | string;
  items?: ItemWhatsAppPedido[];
};

function esMetodoPagoId(value: string): value is MetodoPagoId {
  return esMetodoPagoValido(value);
}

function metodoPagoIdDesdeInfo(metodoPago?: string): MetodoPagoId | undefined {
  if (!metodoPago) return undefined;
  if (esMetodoPagoId(metodoPago)) return metodoPago;
  return idMetodoPagoDesdeLabel(metodoPago);
}

function labelMetodoPagoInfo(metodoPago?: string) {
  if (!metodoPago) return "—";
  return esMetodoPagoId(metodoPago) ? labelMetodoPago(metodoPago) : metodoPago;
}

function lineasCuentaWhatsApp(metodoPago?: string) {
  const metodoId = metodoPagoIdDesdeInfo(metodoPago);
  if (!metodoId) return [];
  return cuentaMetodoPago(metodoId).map((c) => `• ${c.label}: *${c.valor}*`);
}

/** Fecha estable para WhatsApp (sin toLocaleString). */
export function formatFechaPedidoWhatsApp(fecha: Date | string = new Date()) {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  if (Number.isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const hours12 = hours24 % 12 || 12;
  const suffix = hours24 >= 12 ? "p. m." : "a. m.";

  return `${day}/${month}/${year}, ${hours12}:${minutes} ${suffix}`;
}

function lineasProductos(items: ItemWhatsAppPedido[]) {
  return items.map((item) => {
    const esDecant = esLineaDecant(item.volumen);
    const vol = item.volumen?.trim() ?? "";
    const volumen = esDecant
      ? `Decant · ${vol.replace(/^Decant · /i, "")}`
      : vol
        ? vol
        : "";
    const detalle = volumen ? ` (${volumen})` : "";
    const subtotal = formatPrecioCOP(item.precio * item.cantidad);
    return `• ${item.nombre}${detalle} × ${item.cantidad} — $${subtotal}`;
  });
}

function lineasTotalesPedido(info: PedidoWhatsAppInfo & { total: number }) {
  const subtotal = info.subtotal ?? info.total;
  const recargo = info.recargoFinanciacion ?? 0;
  const lineas = [`💵 *Subtotal:* $${formatPrecioCOP(subtotal)}`];

  if (recargo > 0) {
    lineas.push(
      `📈 *Recargo financiación (${RECARGO_FINANCIACION_PORCENTAJE}%):* $${formatPrecioCOP(recargo)}`
    );
  }

  lineas.push(`💰 *Total final:* $${formatPrecioCOP(info.total)}`);
  return lineas;
}

function numeroVisible(info: PedidoWhatsAppInfo) {
  return info.numero?.trim() || numeroPedidoVisible("", info.pedidoId);
}

/** Essenza escribe al cliente (desde correo admin o seguimiento). */
export function mensajeEssenzaACliente(info: PedidoWhatsAppInfo & { total: number }) {
  const numero = numeroVisible(info);
  const fecha = formatFechaPedidoWhatsApp(info.fecha ?? new Date());
  const lineas: string[] = [
    `Hola *${info.nombre ?? "cliente"}*,`,
    "",
    `Te escribimos de *${site.nombreCompleto}* sobre tu pedido:`,
    "",
    `📋 *Pedido:* ${numero}`,
    `📅 *Fecha:* ${fecha}`,
  ];

  if (info.items?.length) {
    lineas.push("", "*Productos:*", ...lineasProductos(info.items));
  }

  lineas.push(
    "",
    ...lineasTotalesPedido(info),
    `💳 *Método de pago:* ${labelMetodoPagoInfo(info.metodoPago)}`
  );

  const cuentas = lineasCuentaWhatsApp(info.metodoPago);
  if (cuentas.length) lineas.push("", "*Datos para pagar:*", ...cuentas);

  const entrega = [info.direccion, info.ciudad].filter(Boolean).join(", ");
  if (entrega) lineas.push(`📍 *Entrega:* ${entrega}`);
  if (info.email) lineas.push(`📧 *Email:* ${info.email}`);

  lineas.push(
    "",
    "¿Confirmas el pago o nos envías el comprobante, por favor?",
    "",
    site.nombreCompleto,
    site.whatsappDisplay
  );

  return lineas.join("\n");
}

/** Cliente envía comprobante a Essenza (checkout o correo al cliente). */
export function mensajeComprobanteWhatsApp(info: PedidoWhatsAppInfo & { total: number }) {
  const numero = numeroVisible(info);
  const fecha = formatFechaPedidoWhatsApp(info.fecha ?? new Date());
  const metodoId = metodoPagoIdDesdeInfo(info.metodoPago);
  const guiadoWhatsApp = metodoId ? esPagoGuiadoWhatsApp(metodoId) : false;

  const lineas: string[] = [
    `Hola *${site.nombreCompleto}*,`,
    "",
    guiadoWhatsApp
      ? `Registré mi pedido y quiero que me guíen por WhatsApp para pagar con *${labelMetodoPagoInfo(info.metodoPago)}*:`
      : `Realicé mi pedido y adjunto comprobante de pago:`,
    "",
    `📋 *Pedido:* ${numero}`,
    `📅 *Fecha:* ${fecha}`,
  ];

  if (info.items?.length) {
    lineas.push("", "*Productos:*", ...lineasProductos(info.items));
  }

  lineas.push("", ...lineasTotalesPedido(info));

  if (info.metodoPago) {
    lineas.push(`💳 *Método de pago:* ${labelMetodoPagoInfo(info.metodoPago)}`);
  }

  const cuentas = lineasCuentaWhatsApp(info.metodoPago);
  if (cuentas.length) lineas.push("", "*Datos para pagar:*", ...cuentas);

  if (info.nombre) lineas.push(`👤 *Cliente:* ${info.nombre}`);
  if (info.telefono) lineas.push(`📱 *Teléfono:* ${info.telefono}`);
  if (info.email) lineas.push(`📧 *Email:* ${info.email}`);

  const entrega = [info.direccion, info.ciudad].filter(Boolean).join(", ");
  if (entrega) lineas.push(`📍 *Entrega:* ${entrega}`);

  if (info.metodoPago && esMetodoPagoId(info.metodoPago)) {
    const pasos = instruccionesPago(info.metodoPago, info.total, numero);
    lineas.push("", "*Pasos:*", ...pasos.map((p) => `• ${p}`));
  }

  if (info.referenciaPago) {
    lineas.push("", `🔖 *Referencia:* ${info.referenciaPago}`);
  }

  lineas.push(
    "",
    guiadoWhatsApp
      ? "Quedo atento/a para que me guíen con el pago por WhatsApp. Gracias."
      : "Adjunto comprobante de pago."
  );
  return lineas.join("\n");
}

export function mensajePedidoWhatsApp(
  items: Producto[],
  total: number,
  info: PedidoWhatsAppInfo = {}
) {
  const whatsappItems: ItemWhatsAppPedido[] = items.map((i) => ({
    nombre: i.nombre,
    volumen: i.volumen,
    cantidad: i.cantidad,
    precio: i.precio,
  }));

  return mensajeComprobanteWhatsApp({
    ...info,
    total,
    items: whatsappItems,
  });
}

/** Convierte ítems del correo/API al formato WhatsApp. */
export function itemsEmailAWhatsApp(
  items: {
    nombre: string;
    volumen: string | null;
    cantidad: number;
    precioUnitario: number;
  }[]
): ItemWhatsAppPedido[] {
  return items.map((i) => ({
    nombre: i.nombre,
    volumen: i.volumen,
    cantidad: i.cantidad,
    precio: i.precioUnitario,
  }));
}

export function whatsappLinkCliente(telefono: string, texto: string) {
  const digits = telefono.replace(/\D/g, "");
  const celular = digits.startsWith("57") ? digits : `57${digits}`;
  return `https://wa.me/${celular}?text=${encodeURIComponent(texto)}`;
}
