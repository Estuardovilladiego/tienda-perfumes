import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "@/generated/prisma/client";
import { parseDatabaseUrl } from "@/lib/parse-database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion: string | undefined;
};

/** Cambia si el schema de Prisma cambia; fuerza nuevo cliente en dev tras migraciones. */
const PRISMA_SCHEMA_VERSION = "20260609120000_pedido_recargo_financiacion";

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL no está definida en .env");
  }

  const { host, port, user, password, database } = parseDatabaseUrl(url);
  const isRemote = !/localhost|127\.0\.0\.1/i.test(host);

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 15,
    connectTimeout: 30_000,
    acquireTimeout: 30_000,
    allowPublicKeyRetrieval: true,
    ...(isRemote
      ? {
          ssl: { rejectUnauthorized: false },
        }
      : {}),
  });

  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION
    ? (globalForPrisma.prisma ?? createPrismaClient())
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}
