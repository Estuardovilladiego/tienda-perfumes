const WEAK_PASSWORDS = new Set(["admin123", "password", "12345678", "essenza123"]);

export type ProductionEnvIssue = {
  variable: string;
  message: string;
};

function isProductionRuntime() {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV === "production";
}

function isLocalDatabase(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function isLocalSiteUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Comprueba variables críticas antes del go-live en Vercel. */
export function collectProductionEnvIssues(): ProductionEnvIssue[] {
  if (!isProductionRuntime()) return [];

  const issues: ProductionEnvIssue[] = [];

  const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!databaseUrl) {
    issues.push({ variable: "DATABASE_URL", message: "Es obligatoria en producción." });
  } else if (isLocalDatabase(databaseUrl)) {
    issues.push({
      variable: "DATABASE_URL",
      message: "Apunta a localhost. Usa MySQL remoto (Railway, PlanetScale, etc.).",
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!siteUrl) {
    issues.push({
      variable: "NEXT_PUBLIC_SITE_URL",
      message: "Define la URL pública (ej. https://tienda-perfumes.vercel.app).",
    });
  } else if (isLocalSiteUrl(siteUrl)) {
    issues.push({
      variable: "NEXT_PUBLIC_SITE_URL",
      message: "No puede ser localhost en producción.",
    });
  } else if (!siteUrl.startsWith("https://")) {
    issues.push({
      variable: "NEXT_PUBLIC_SITE_URL",
      message: "Debe empezar con https:// para SEO y correos.",
    });
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
  if (sessionSecret.length < 32) {
    issues.push({
      variable: "ADMIN_SESSION_SECRET",
      message: "Debe tener al menos 32 caracteres aleatorios.",
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!adminPassword) {
    issues.push({ variable: "ADMIN_PASSWORD", message: "Es obligatoria en producción." });
  } else if (WEAK_PASSWORDS.has(adminPassword.toLowerCase())) {
    issues.push({
      variable: "ADMIN_PASSWORD",
      message: "Contraseña demasiado débil. Elige una distinta a admin123.",
    });
  }

  if (sessionSecret && adminPassword && sessionSecret === adminPassword) {
    issues.push({
      variable: "ADMIN_SESSION_SECRET",
      message: "No puede ser igual a ADMIN_PASSWORD.",
    });
  }

  if (!process.env.SMTP_USER?.trim() || !process.env.SMTP_PASS?.trim()) {
    issues.push({
      variable: "SMTP_USER / SMTP_PASS",
      message: "Configura SMTP para enviar confirmaciones de pedido.",
    });
  }

  const cloudinaryOk =
    Boolean(process.env.CLOUDINARY_CLOUD_NAME?.trim()) &&
    Boolean(process.env.CLOUDINARY_UPLOAD_PRESET?.trim());

  if (!cloudinaryOk) {
    issues.push({
      variable: "CLOUDINARY_CLOUD_NAME / CLOUDINARY_UPLOAD_PRESET",
      message: "Obligatorio en Vercel para subir imágenes del admin.",
    });
  }

  return issues;
}

export function assertProductionEnv() {
  const issues = collectProductionEnvIssues();
  if (!issues.length) return;

  const detail = issues.map((i) => `  • ${i.variable}: ${i.message}`).join("\n");
  throw new Error(`Configuración de producción incompleta:\n${detail}`);
}
