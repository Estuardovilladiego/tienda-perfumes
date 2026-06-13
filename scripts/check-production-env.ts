#!/usr/bin/env tsx
/**
 * Revisa la config antes de desplegar a Vercel.
 * Uso: npm run check:prod
 * Carga .env.local o .env si existen.
 */
import "dotenv/config";

import { collectProductionEnvIssues } from "../lib/production-env";

process.env.VERCEL = "1";

const issues = collectProductionEnvIssues();

if (!issues.length) {
  console.log("✅ Configuración lista para Vercel.\n");
  console.log(`   SITE: ${process.env.NEXT_PUBLIC_SITE_URL}`);
  console.log(`   BD:   ${process.env.DATABASE_URL?.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ?? "(falta)"}`);
  process.exit(0);
}

console.log("❌ Faltan ajustes antes del deploy:\n");
for (const issue of issues) {
  console.log(`  • ${issue.variable}`);
  console.log(`    ${issue.message}\n`);
}
process.exit(1);
