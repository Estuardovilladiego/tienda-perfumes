import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { catalogoEssenza, slugify } from "../lib/catalogo-data";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("Define DATABASE_URL en .env antes de ejecutar el seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(url),
});

async function main() {
  const slugsCategoria = ["hombre", "mujer", "unisex", "arabes"] as const;
  const nombresCategoria = ["Hombre", "Mujer", "Unisex", "Árabes"] as const;

  const imagenesCategoria: Record<(typeof slugsCategoria)[number], string> = {
    hombre: "/imagenes/bleu-de-chanel.jpg",
    mujer: "/imagenes/good-girl.jpg",
    unisex: "/imagenes/erba-pura.jpg",
    arabes: "/imagenes/khamrah.jpg",
  };

  for (let i = 0; i < slugsCategoria.length; i++) {
    await prisma.categoria.upsert({
      where: { slug: slugsCategoria[i] },
      update: { imagen: imagenesCategoria[slugsCategoria[i]] },
      create: {
        nombre: nombresCategoria[i],
        slug: slugsCategoria[i],
        orden: i + 1,
        imagen: imagenesCategoria[slugsCategoria[i]],
      },
    });
  }

  const categorias = await prisma.categoria.findMany();
  const categoriaPorNombre = new Map(
    categorias.map((c) => [c.nombre, c.id])
  );

  const marcasUnicas = [...new Set(catalogoEssenza.map((p) => p.marca))];
  const marcaPorNombre = new Map<string, number>();

  for (const nombre of marcasUnicas) {
    const slug = slugify(nombre);
    const marca = await prisma.marca.upsert({
      where: { slug },
      update: { nombre },
      create: { nombre, slug },
    });
    marcaPorNombre.set(nombre, marca.id);
  }

  await prisma.producto.updateMany({
    data: { activo: false },
  });

  for (const item of catalogoEssenza) {
    const marcaId = marcaPorNombre.get(item.marca);
    if (!marcaId) {
      throw new Error(`Marca no encontrada: ${item.nombre}`);
    }

    const categoriaIds = item.categorias.map((nombre) => {
      const id = categoriaPorNombre.get(nombre);
      if (!id) throw new Error(`Categoría no encontrada: ${nombre}`);
      return id;
    });

    const dataBase = {
      nombre: item.nombre,
      descripcion: item.marca,
      precio: item.precio,
      precioAnterior: null,
      imagen: item.imagen,
      volumen: `${item.volumenML} ML`,
      stock: item.stock,
      destacado: item.destacado ?? false,
      esNuevo: item.esNuevo ?? false,
      enOferta: false,
      activo: true,
      marcaId,
    };

    const existente = await prisma.producto.findFirst({
      where: { nombre: item.nombre },
    });

    let productoId: number;

    if (existente) {
      await prisma.producto.update({
        where: { id: existente.id },
        data: dataBase,
      });
      productoId = existente.id;
    } else {
      const creado = await prisma.producto.create({ data: dataBase });
      productoId = creado.id;
    }

    await prisma.productoCategoria.deleteMany({
      where: { productoId },
    });

    await prisma.productoCategoria.createMany({
      data: categoriaIds.map((categoriaId) => ({
        productoId,
        categoriaId,
      })),
      skipDuplicates: true,
    });
  }

  console.log(
    `Seed completado: ${catalogoEssenza.length} perfumes (categorías múltiples).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
