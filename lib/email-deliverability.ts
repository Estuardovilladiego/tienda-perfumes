import { site } from "@/lib/site";

function smtpUser() {
  return process.env.SMTP_USER?.trim() || site.email;
}

function dominioCorreo(email: string) {
  return email.split("@")[1]?.toLowerCase() || "gmail.com";
}

/** El remitente debe usar el mismo correo autenticado en SMTP (evita spam con Gmail). */
export function remitenteCorreo() {
  const user = smtpUser();
  const fromCustom = process.env.SMTP_FROM?.trim();
  let displayName: string = site.nombreCompleto;

  if (fromCustom) {
    const conNombre = fromCustom.match(/^(.+?)\s*<([^>]+)>$/);
    if (conNombre) {
      displayName = conNombre[1].trim().replace(/^["']|["']$/g, "");
    } else if (!fromCustom.includes("@")) {
      displayName = fromCustom;
    }
  }

  return `"${displayName}" <${user}>`;
}

export function replyToCorreo() {
  return process.env.SMTP_REPLY_TO?.trim() || site.email;
}

export function messageIdCorreo(prefijo = "pedido") {
  const domain = dominioCorreo(smtpUser());
  const token = `${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;
  return `<${prefijo}-${token}@${domain}>`;
}

/** Encabezados que ayudan a clasificar el correo como transaccional (confirmación de pedido). */
export function encabezadosCorreoTransaccional(prefijoMessageId = "pedido") {
  return {
    "Message-ID": messageIdCorreo(prefijoMessageId),
    "Reply-To": replyToCorreo(),
    "X-Entity-Ref-ID": prefijoMessageId,
    "X-Auto-Response-Suppress": "All",
  };
}

export function advertenciasEntregaCorreo(): string[] {
  const avisos: string[] = [];
  const user = smtpUser();
  const from = process.env.SMTP_FROM?.trim();

  if (from) {
    const emailEnFrom = from.match(/<([^>]+)>/)?.[1] ?? (from.includes("@") ? from : null);
    if (emailEnFrom && emailEnFrom.toLowerCase() !== user.toLowerCase()) {
      avisos.push(
        `SMTP_FROM (${emailEnFrom}) no coincide con SMTP_USER (${user}). Gmail puede marcar los correos como spam.`
      );
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!siteUrl || /localhost|127\.0\.0\.1/i.test(siteUrl)) {
    avisos.push(
      "NEXT_PUBLIC_SITE_URL debe ser tu dominio público (https://...) para que el logo del correo cargue bien."
    );
  }

  if (dominioCorreo(user) === "gmail.com") {
    avisos.push(
      "Con Gmail personal, pide a los clientes agregar essenzaperfumeria312@gmail.com a contactos. Para mejor entrega usa Google Workspace o un dominio verificado (Resend/SendGrid)."
    );
  }

  return avisos;
}

function smtpPass() {
  // Gmail: la contraseña de aplicación debe ir sin espacios (16 caracteres).
  return process.env.SMTP_PASS?.trim().replace(/\s+/g, "") ?? "";
}

export function opcionesTransporteSmtp() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true";

  return {
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: {
      user: smtpUser(),
      pass: smtpPass(),
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: "TLSv1.2" as const,
    },
  };
}

export function smtpEstaConfigurado() {
  return Boolean(smtpUser() && smtpPass());
}
