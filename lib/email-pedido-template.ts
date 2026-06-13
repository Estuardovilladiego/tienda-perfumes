import "server-only";

import { logoEmailHtml } from "@/lib/email-logo";
import {
  itemsEmailAWhatsApp,
  mensajeComprobanteWhatsApp,
  mensajeEssenzaACliente,
  whatsappLinkCliente,
} from "@/lib/format-pedido-whatsapp";
import { formatPrecioCOP } from "@/lib/format-precio";
import { RECARGO_FINANCIACION_PORCENTAJE } from "@/lib/recargo-financiacion";
import { cuentaMetodoPago, idMetodoPagoDesdeLabel } from "@/lib/metodos-pago";
import { site, whatsappUrl } from "@/lib/site";

export type PedidoEmailData = {
  numero: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  metodoPago: string;
  subtotal?: number;
  recargoFinanciacion?: number;
  total: number;
  fecha?: Date | string;
  items: {
    nombre: string;
    volumen: string | null;
    cantidad: number;
    precioUnitario: number;
  }[];
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function filasTotalesEmail(pedido: PedidoEmailData) {
  const subtotal = pedido.subtotal ?? pedido.total;
  const recargo = pedido.recargoFinanciacion ?? 0;

  const filas = [
    `
        <tr>
          <td style="padding:10px 12px;font-size:13px;color:#666;font-family:Arial,sans-serif;">Subtotal</td>
          <td align="right" style="padding:10px 12px;font-size:14px;font-weight:600;color:#1a1a1a;font-family:Arial,sans-serif;">$${formatPrecioCOP(subtotal)}</td>
        </tr>`,
  ];

  if (recargo > 0) {
    filas.push(`
        <tr>
          <td style="padding:10px 12px;font-size:13px;color:#666;font-family:Arial,sans-serif;">Recargo financiación (${RECARGO_FINANCIACION_PORCENTAJE}%)</td>
          <td align="right" style="padding:10px 12px;font-size:14px;font-weight:600;color:#1a1a1a;font-family:Arial,sans-serif;">$${formatPrecioCOP(recargo)}</td>
        </tr>`);
  }

  filas.push(`
        <tr>
          <td style="padding:12px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7355;font-family:Arial,sans-serif;font-weight:700;">Total final</td>
          <td align="right" style="padding:12px;font-size:22px;font-weight:700;color:#1a1a1a;font-family:Arial,sans-serif;">$${formatPrecioCOP(pedido.total)}</td>
        </tr>`);

  return filas.join("");
}

function filasProductos(pedido: PedidoEmailData) {
  return pedido.items
    .map(
      (item, index) => `
        <tr>
          <td style="padding:14px 12px;border-bottom:1px solid #efe6d8;${index % 2 === 1 ? "background:#faf6ef;" : "background:#ffffff;"}">
            <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a;">${esc(item.nombre)}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#8b7355;">${item.volumen ? esc(item.volumen) : "—"} · Cant. ${item.cantidad}</p>
          </td>
          <td style="padding:14px 12px;border-bottom:1px solid #efe6d8;text-align:right;white-space:nowrap;${index % 2 === 1 ? "background:#faf6ef;" : "background:#ffffff;"}">
            <span style="font-size:14px;font-weight:600;color:#1a1a1a;">$${formatPrecioCOP(item.precioUnitario * item.cantidad)}</span>
          </td>
        </tr>`
    )
    .join("");
}

type Variante = "cliente" | "admin";

function infoWhatsAppDesdePedido(pedido: PedidoEmailData) {
  return {
    numero: pedido.numero,
    nombre: pedido.nombre,
    telefono: pedido.telefono,
    email: pedido.email,
    ciudad: pedido.ciudad,
    direccion: pedido.direccion,
    metodoPago: pedido.metodoPago,
    subtotal: pedido.subtotal ?? pedido.total,
    recargoFinanciacion: pedido.recargoFinanciacion ?? 0,
    total: pedido.total,
    fecha: pedido.fecha,
    items: itemsEmailAWhatsApp(pedido.items),
  };
}

function bloqueDatosPagoEmail(pedido: PedidoEmailData) {
  const metodoId = idMetodoPagoDesdeLabel(pedido.metodoPago);
  if (!metodoId) return "";

  const lineas = cuentaMetodoPago(metodoId);
  if (!lineas.length) return "";

  const filas = lineas
    .map(
      (linea) => `
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#666;font-family:Arial,sans-serif;">${esc(linea.label)}</td>
                  <td align="right" style="padding:8px 0;font-size:14px;font-weight:700;color:#1a1a1a;font-family:Consolas,Monaco,monospace;">${esc(linea.valor)}</td>
                </tr>`
    )
    .join("");

  return `
          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ef;border:1px solid #d4bc94;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;font-family:Arial,sans-serif;">
                    <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8b6914;">Datos para pagar · ${esc(pedido.metodoPago)}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filas}</table>
                    <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:#666;">Referencia: <strong style="color:#1a1a1a;">Pedido ${esc(pedido.numero)}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

function bloqueWhatsApp(pedido: PedidoEmailData, esAdmin: boolean) {
  const info = infoWhatsAppDesdePedido(pedido);

  if (esAdmin) {
    const link = whatsappLinkCliente(
      pedido.telefono,
      mensajeEssenzaACliente(info)
    );
    return `
          <tr>
            <td style="padding:28px 32px;text-align:center;">
              <p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:#666;font-family:Arial,sans-serif;">
                Contacta al cliente para confirmar el pago o coordinar la entrega.
              </p>
              <a href="${link}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 28px;border-radius:999px;">
                Escribir al cliente por WhatsApp
              </a>
              <p style="margin:14px 0 0;font-size:12px;color:#888;font-family:Arial,sans-serif;">
                ${esc(pedido.telefono)} · ${esc(pedido.nombre)}
              </p>
            </td>
          </tr>`;
  }

  const link = whatsappUrl(mensajeComprobanteWhatsApp(info));
  return `
          <tr>
            <td style="padding:28px 32px;text-align:center;">
              <p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:#666;font-family:Arial,sans-serif;">
                Después de pagar, toca el botón para abrir WhatsApp con el mensaje listo.
                Solo adjunta la captura o foto de tu comprobante y envía.
              </p>
              <a href="${link}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 28px;border-radius:999px;">
                Enviar comprobante por WhatsApp
              </a>
              <p style="margin:14px 0 0;font-size:12px;color:#888;font-family:Arial,sans-serif;">
                ${site.whatsappDisplay} · ${site.email}
              </p>
            </td>
          </tr>`;
}

export function htmlPedidoEmail(pedido: PedidoEmailData, variante: Variante = "cliente") {
  const logoHtml = logoEmailHtml();
  const esAdmin = variante === "admin";
  const titulo = esAdmin ? "Nuevo pedido recibido" : "¡Gracias por tu pedido!";
  const intro = esAdmin
    ? `Se registró un pedido en la tienda. Revisa los detalles y confirma el pago con el cliente.`
    : `Hola <strong style="color:#1a1a1a;">${esc(pedido.nombre)}</strong>, recibimos tu pedido. Te contactaremos por WhatsApp para confirmar el pago.`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${esc(pedido.numero)} — ${site.nombreCompleto}</title>
</head>
<body style="margin:0;padding:0;background:#f3ede3;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3ede3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8dfd3;box-shadow:0 8px 32px rgba(26,26,26,0.08);">
          <tr>
            <td style="background:#0a0a0a;padding:28px 32px;text-align:center;">
              ${logoHtml}
              <p style="margin:0;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#d4bc94;font-family:Arial,sans-serif;">${site.nombreCompleto}</p>
              <p style="margin:8px 0 0;font-size:13px;color:#a3a3a3;font-family:Arial,sans-serif;">${site.tagline} · ${site.ciudad}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 0;text-align:center;">
              <span style="display:inline-block;padding:8px 16px;border-radius:999px;background:#faf6ef;border:1px solid #d4bc94;color:#8b6914;font-size:12px;font-weight:700;letter-spacing:0.08em;font-family:Arial,sans-serif;">
                PEDIDO ${esc(pedido.numero)}
              </span>
              <h1 style="margin:20px 0 12px;font-size:26px;font-weight:400;color:#1a1a1a;line-height:1.3;">${titulo}</h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#555;font-family:Arial,sans-serif;">${intro}</p>
            </td>
          </tr>
          ${
            esAdmin
              ? `<tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ef;border-radius:12px;border:1px solid #efe6d8;">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial,sans-serif;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8956c;">Cliente</p>
                    <p style="margin:0;font-size:14px;color:#1a1a1a;"><strong>${esc(pedido.nombre)}</strong></p>
                    <p style="margin:6px 0 0;font-size:13px;color:#555;">${esc(pedido.email)} · ${esc(pedido.telefono)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8956c;font-family:Arial,sans-serif;">Resumen del pedido</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efe6d8;border-radius:12px;overflow:hidden;">
                <thead>
                  <tr style="background:#faf6ef;">
                    <th align="left" style="padding:12px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7355;font-family:Arial,sans-serif;">Producto</th>
                    <th align="right" style="padding:12px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7355;font-family:Arial,sans-serif;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>${filasProductos(pedido)}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #efe6d8;border-radius:12px;overflow:hidden;">
                <tbody>${filasTotalesEmail(pedido)}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;font-family:Arial,sans-serif;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#a3a3a3;">Método de pago</p>
                    <p style="margin:6px 0 0;font-size:14px;font-weight:600;color:#ffffff;">${esc(pedido.metodoPago)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${bloqueDatosPagoEmail(pedido)}
          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:8px;vertical-align:top;">
                    <div style="background:#faf6ef;border:1px solid #efe6d8;border-radius:12px;padding:16px;height:100%;">
                      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8956c;font-family:Arial,sans-serif;">Entrega</p>
                      <p style="margin:0;font-size:13px;line-height:1.5;color:#444;font-family:Arial,sans-serif;">${esc(pedido.direccion)}<br />${esc(pedido.ciudad)}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px;vertical-align:top;">
                    <div style="background:#faf6ef;border:1px solid #efe6d8;border-radius:12px;padding:16px;height:100%;">
                      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b8956c;font-family:Arial,sans-serif;">Contacto</p>
                      <p style="margin:0;font-size:13px;line-height:1.5;color:#444;font-family:Arial,sans-serif;">${esc(pedido.telefono)}<br />${esc(pedido.email)}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${bloqueWhatsApp(pedido, esAdmin)}
          <tr>
            <td style="background:#faf6ef;padding:20px 32px;text-align:center;border-top:1px solid #efe6d8;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:#8b7355;font-family:Arial,sans-serif;">
                ${site.nombreCompleto} · ${esc(site.ciudad)}<br />
                <a href="mailto:${esc(site.email)}" style="color:#b8956c;text-decoration:none;">${esc(site.email)}</a>
                · ${esc(site.whatsappDisplay)}<br />
                ${site.envioGratis}<br />
                <a href="${site.instagram}" style="color:#b8956c;text-decoration:none;">${site.instagramHandle}</a>
              </p>
              <p style="margin:12px 0 0;font-size:10px;line-height:1.5;color:#a89880;font-family:Arial,sans-serif;">
                Recibiste este correo porque registraste un pedido en nuestra tienda. Si no fuiste tú, escríbenos a ${esc(site.email)}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function textoPedidoEmail(pedido: PedidoEmailData) {
  const items = pedido.items
    .map(
      (i) =>
        `• ${i.nombre}${i.volumen ? ` (${i.volumen})` : ""} × ${i.cantidad} — $${formatPrecioCOP(i.precioUnitario * i.cantidad)}`
    )
    .join("\n");

  const metodoId = idMetodoPagoDesdeLabel(pedido.metodoPago);
  const cuentas = metodoId
    ? cuentaMetodoPago(metodoId)
        .map((c) => `${c.label}: ${c.valor}`)
        .join("\n")
    : "";

  const subtotal = pedido.subtotal ?? pedido.total;
  const recargo = pedido.recargoFinanciacion ?? 0;

  return [
    `Hola ${pedido.nombre},`,
    ``,
    `Recibimos tu pedido ${pedido.numero} en ${site.nombreCompleto}.`,
    ``,
    items,
    ``,
    `Subtotal: $${formatPrecioCOP(subtotal)}`,
    ...(recargo > 0
      ? [`Recargo financiación (${RECARGO_FINANCIACION_PORCENTAJE}%): $${formatPrecioCOP(recargo)}`]
      : []),
    `Total final: $${formatPrecioCOP(pedido.total)}`,
    `Método de pago: ${pedido.metodoPago}`,
    ...(cuentas ? ["", "Datos para pagar:", cuentas, `Referencia: Pedido ${pedido.numero}`] : []),
    `Entrega: ${pedido.direccion}, ${pedido.ciudad}`,
    `Teléfono: ${pedido.telefono}`,
    ``,
    `Envía tu comprobante por WhatsApp al ${site.whatsappDisplay}.`,
    ``,
    site.nombreCompleto,
    site.email,
  ].join("\n");
}
