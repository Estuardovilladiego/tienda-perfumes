import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import {
  CATEGORIA_DECANTS_NOMBRE,
  CATEGORIA_DECANTS_SLUG,
  esProductoDecantDuplicado,
} from "../lib/decants";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Define DATABASE_URL en .env");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(url),
});

async function main() {
  const categoriaDecants = await prisma.categoria.upsert({
    where: { slug: CATEGORIA_DECANTS_SLUG },
    update: { nombre: CATEGORIA_DECANTS_NOMBRE, orden: 5 },
    create: {
      nombre: CATEGORIA_DECANTS_NOMBRE,
      slug: CATEGORIA_DECANTS_SLUG,
      imagen: "/imagenes/erba-pura.jpg",
      orden: 5,
    },
  });

  const todos = await prisma.producto.findMany({
    select: { id: true, nombre: true, activo: true },
  });

  const duplicados = todos.filter((p) => esProductoDecantDuplicado(p.nombre));
  let eliminados = 0;
  let desactivados = 0;

  for (const dup of duplicados) {
    const pedidos = await prisma.pedidoItem.count({ where: { productoId: dup.id } });
    await prisma.productoCategoria.deleteMany({ where: { productoId: dup.id } });

    if (pedidos > 0) {
      await prisma.producto.update({
        where: { id: dup.id },
        data: { activo: false },
      });
      desactivados++;
    } else {
      await prisma.producto.delete({ where: { id: dup.id } });
      eliminados++;
    }
  }

  const origenes = await prisma.producto.findMany({
    where: { activo: true },
    select: { id: true, nombre: true },
  });

  const productosValidos = origenes.filter((p) => !esProductoDecantDuplicado(p.nombre));
  let asignados = 0;

  for (const producto of productosValidos) {
    await prisma.productoCategoria.upsert({
      where: {
        productoId_categoriaId: {
          productoId: producto.id,
          categoriaId: categoriaDecants.id,
        },
      },
      update: {},
      create: {
        productoId: producto.id,
        categoriaId: categoriaDecants.id,
      },
    });
    asignados++;
  }

  console.log(`Decants: ${asignados} perfumes en categoría (1 registro por fragancia).`);
  if (duplicados.length) {
    console.log(`  Duplicados eliminados: ${eliminados}, desactivados: ${desactivados}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
