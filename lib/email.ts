import "server-only";

import nodemailer from "nodemailer";

import {
  advertenciasEntregaCorreo,
  encabezadosCorreoTransaccional,
  opcionesTransporteSmtp,
  remitenteCorreo,
  replyToCorreo,
} from "@/lib/email-deliverability";
import { adjuntosLogoEmail } from "@/lib/email-logo";
import { htmlPedidoEmail, textoPedidoEmail, type PedidoEmailData } from "@/lib/email-pedido-template";
import { formatPrecioCOP } from "@/lib/format-precio";
import { site } from "@/lib/site";

export type { PedidoEmailData };

function smtpConfigurado() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

function crearTransport() {
  const opciones = opcionesTransporteSmtp();
  if (!opciones.auth.pass) return null;

  return nodemailer.createTransport(opciones);
}

function logAvisosEntrega() {
  if (process.env.NODE_ENV === "production") {
    for (const aviso of advertenciasEntregaCorreo()) {
      console.warn(`[email] Entrega: ${aviso}`);
    }
  }
}

type OpcionesEnvio = {
  to: string;
  subject: string;
  text: string;
  html: string;
  messageIdPrefix?: string;
};

async function enviarCorreoTransaccional(opciones: OpcionesEnvio) {
  const transport = crearTransport();
  if (!transport) return { enviado: false as const, motivo: "smtp_no_configurado" };

  logAvisosEntrega();

  const from = remitenteCorreo();
  const replyTo = replyToCorreo();
  const user = process.env.SMTP_USER?.trim() || site.email;

  await transport.sendMail({
    from,
    to: opciones.to,
    replyTo,
    envelope: {
      from: user,
      to: opciones.to,
    },
    subject: opciones.subject,
    text: opciones.text,
    html: opciones.html,
    attachments: adjuntosLogoEmail(),
    headers: encabezadosCorreoTransaccional(opciones.messageIdPrefix ?? "pedido"),
  });

  return { enviado: true as const };
}

/** Envía confirmación al cliente. No lanza error si SMTP no está configurado. */
export async function enviarConfirmacionPedido(pedido: PedidoEmailData) {
  if (!pedido.email?.trim()) return { enviado: false, motivo: "sin_email" };
  if (!smtpConfigurado()) return { enviado: false, motivo: "smtp_no_configurado" };

  return enviarCorreoTransaccional({
    to: pedido.email.trim(),
    subject: `Confirmación de pedido ${pedido.numero} — ${site.nombre}`,
    text: textoPedidoEmail(pedido),
    html: htmlPedidoEmail(pedido, "cliente"),
    messageIdPrefix: `pedido-${pedido.numero}`,
  });
}

/** Aviso interno al correo de la tienda (opcional). */
export async function enviarAvisoPedidoAdmin(pedido: PedidoEmailData) {
  if (!smtpConfigurado()) return { enviado: false };

  const destino = process.env.SMTP_USER?.trim() || site.email;

  return enviarCorreoTransaccional({
    to: destino,
    subject: `Nuevo pedido ${pedido.numero} — $${formatPrecioCOP(pedido.total)}`,
    text: textoPedidoEmail(pedido),
    html: htmlPedidoEmail(pedido, "admin"),
    messageIdPrefix: `admin-${pedido.numero}`,
  });
}
