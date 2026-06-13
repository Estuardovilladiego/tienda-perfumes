/**
 * Prueba SMTP local. Uso: npx tsx scripts/test-smtp.mts tu@correo.com
 */
import "dotenv/config";

import nodemailer from "nodemailer";

import { adjuntosLogoEmail } from "../lib/email-logo";
import { htmlPedidoEmail, type PedidoEmailData } from "../lib/email-pedido-template";
import { site } from "../lib/site";

const destino = process.argv[2]?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = process.env.SMTP_PASS?.trim();

if (!user || !pass) {
  console.error("Falta SMTP_USER o SMTP_PASS en .env");
  process.exit(1);
}

if (!destino) {
  console.error("Uso: npx tsx scripts/test-smtp.mts tu@correo.com");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user, pass },
});

const demo: PedidoEmailData = {
  numero: "ESS-TEST-001",
  nombre: "Cliente prueba",
  email: destino,
  telefono: "3001234567",
  ciudad: "Barranquilla",
  direccion: "Calle 72 #45-10",
  metodoPago: "Nequi",
  total: 230000,
  items: [
    { nombre: "Asad", volumen: "100 ML", cantidad: 1, precioUnitario: 120000 },
    { nombre: "Yara", volumen: "100 ML", cantidad: 1, precioUnitario: 110000 },
  ],
};

try {
  await transport.verify();
  console.log("Conexión SMTP OK");

  await transport.sendMail({
    from: process.env.SMTP_FROM?.trim() || `Essenza <${user}>`,
    to: destino,
    subject: `Prueba logo — ${site.nombreCompleto}`,
    text: "Prueba de confirmación con logo en el encabezado.",
    html: htmlPedidoEmail(demo, "cliente"),
    attachments: adjuntosLogoEmail(),
  });

  console.log(`Correo de prueba enviado a ${destino}`);
} catch (e) {
  console.error("Error SMTP:", e instanceof Error ? e.message : e);
  process.exit(1);
}
