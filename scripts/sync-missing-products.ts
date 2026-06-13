/**
 * Copia productos de XAMPP (local) a Railway los que aún no existen en remoto.
 * No sobrescribe productos que ya están en Railway (mismo nombre).
 *
 * Uso:
 *   1. Enciende XAMPP MySQL
 *   2. En .env deja DATABASE_URL = Railway y añade:
 *      LOCAL_DATABASE_URL="mysql://root:@localhost:3306/essenza_perfumes"
 *   3. npm run sync:products
 */
import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { parseDatabaseUrl } from "../lib/parse-database-url";
import { slugify } from "../lib/admin-validation";

function createClient(url: string) {
  const { host, port, user, password, database } = parseDatabaseUrl(url);
  const isRemote = !/localhost|127\.0\.0\.1/i.test(host);

  return new PrismaClient({
    adapter: new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
      connectTimeout: 30_000,
      acquireTimeout: 30_000,
      allowPublicKeyRetrieval: true,
      ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
    }),
  });
}

const productoInclude = {
  marca: true,
  familia: true,
  categorias: { include: { categoria: true } },
} as const;

async function upsertMarca(prisma: PrismaClient, nombre: string) {
  const trimmed = nombre.trim();
  const slug = slugify(trimmed);
  return prisma.marca.upsert({
    where: { slug },
    create: { nombre: trimmed, slug },
    update: { nombre: trimmed },
  });
}

async function upsertFamilia(prisma: PrismaClient, nombre: string | null) {
  const trimmed = nombre?.trim();
  if (!trimmed) return null;
  const slug = slugify(trimmed);
  if (!slug) return null;
  return prisma.familiaOlfativa.upsert({
    where: { slug },
    create: { nombre: trimmed, slug },
    update: { nombre: trimmed },
  });
}

async function main() {
  const localUrl = process.env.LOCAL_DATABASE_URL?.trim();
  const remoteUrl = process.env.DATABASE_URL?.trim();

  if (!localUrl) {
    throw new Error('Define LOCAL_DATABASE_URL en .env (XAMPP), ej. mysql://root:@localhost:3306/essenza_perfumes');
  }
  if (!remoteUrl || /localhost|127\.0\.0\.1/i.test(remoteUrl)) {
    throw new Error("DATABASE_URL debe apuntar a Railway (remoto), no a localhost.");
  }

  const local = createClient(localUrl);
  const remote = createClient(remoteUrl);

  try {
    const [localProductos, remoteProductos, remoteCategorias] = await Promise.all([
      local.producto.findMany({
        where: { activo: true },
        include: productoInclude,
        orderBy: { id: "asc" },
      }),
      remote.producto.findMany({ select: { id: true, nombre: true } }),
      remote.categoria.findMany(),
    ]);

    const remotePorNombre = new Map(
      remoteProductos.map((p) => [p.nombre.trim().toLowerCase(), p.id])
    );
    const categoriaRemotaPorSlug = new Map(remoteCategorias.map((c) => [c.slug, c.id]));

    const faltantes = localProductos.filter(
      (p) => !remotePorNombre.has(p.nombre.trim().toLowerCase())
    );

    if (!faltantes.length) {
      console.log("✅ Railway ya tiene todos los productos activos del local.");
      console.log(`   Local: ${localProductos.length} | Railway: ${remoteProductos.length}`);
      return;
    }

    console.log(`\nSincronizando ${faltantes.length} producto(s) faltante(s)...\n`);

    for (const p of faltantes) {
      const marcaNombre = p.marca?.nombre?.trim();
      if (!marcaNombre) {
        console.log(`⚠️  Omitido (sin marca): ${p.nombre}`);
        continue;
      }

      const categoriaIds = p.categorias
        .map((pc) => categoriaRemotaPorSlug.get(pc.categoria.slug))
        .filter((id): id is number => typeof id === "number");

      if (!categoriaIds.length) {
        console.log(`⚠️  Omitido (sin categorías en Railway): ${p.nombre}`);
        continue;
      }

      const marca = await upsertMarca(remote, marcaNombre);
      const familia = await upsertFamilia(remote, p.familia?.nombre ?? null);

      const imagenes = Array.isArray(p.imagenes)
        ? p.imagenes.filter((x): x is string => typeof x === "string")
        : [];

      const creado = await remote.producto.create({
        data: {
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          precioAnterior: p.precioAnterior,
          sku: p.sku,
          volumen: p.volumen,
          stock: p.stock,
          imagen: p.imagen,
          imagenes,
          destacado: p.destacado,
          esNuevo: p.esNuevo,
          enOferta: p.enOferta,
          activo: true,
          marcaId: marca.id,
          familiaId: familia?.id ?? null,
          notasSalida: p.notasSalida,
          notasCorazon: p.notasCorazon,
          notasFondo: p.notasFondo,
          categorias: {
            create: categoriaIds.map((categoriaId) => ({ categoriaId })),
          },
        },
      });

      console.log(`✅ ${creado.nombre} (stock ${p.stock}, $${p.precio.toLocaleString("es-CO")})`);
    }

    const totalRemoto = await remote.producto.count({ where: { activo: true } });
    console.log(`\nListo. Productos activos en Railway: ${totalRemoto}\n`);
  } finally {
    await local.$disconnect();
    await remote.$disconnect();
  }
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
