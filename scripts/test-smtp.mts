/**
 * Prueba SMTP local. Uso: npx tsx scripts/test-smtp.mts tu@correo.com
 */
import "dotenv/config";

import nodemailer from "nodemailer";

import { opcionesTransporteSmtp, remitenteCorreo } from "../lib/email-deliverability";
import { adjuntosLogoEmail, logoEmailHtml } from "../lib/email-logo";
import { site } from "../lib/site";

const destino = process.argv[2]?.trim();
const opciones = opcionesTransporteSmtp();

if (!opciones.auth.user || !opciones.auth.pass) {
  console.error("Falta SMTP_USER o SMTP_PASS en .env");
  process.exit(1);
}

if (!destino) {
  console.error("Uso: npx tsx scripts/test-smtp.mts tu@correo.com");
  process.exit(1);
}

const transport = nodemailer.createTransport(opciones);

try {
  await transport.verify();
  console.log("Conexión SMTP OK");

  await transport.sendMail({
    from: remitenteCorreo(),
    to: destino,
    subject: `Prueba — ${site.nombreCompleto}`,
    text: "Prueba de correo transaccional Essenza.",
    html: `<div style="text-align:center;font-family:Arial,sans-serif;">${logoEmailHtml()}<p>Si ves el logo, el correo funciona correctamente.</p></div>`,
    attachments: adjuntosLogoEmail(),
  });

  console.log(`Correo de prueba enviado a ${destino}`);
} catch (e) {
  console.error("Error SMTP:", e instanceof Error ? e.message : e);
  process.exit(1);
}
