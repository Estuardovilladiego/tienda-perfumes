import type { ProductoCatalogo } from "@/app/types/producto";
import { catalogoEssenza, slugCategoria, slugify } from "@/lib/catalogo-data";
import { resolverNotas } from "@/lib/notas-perfumes-default";

let id = 1;
export const productosEstaticos: ProductoCatalogo[] = catalogoEssenza.map((p) => {
  const slug = slugify(p.nombre);
  const notas = resolverNotas(slug, {});
  return {
    id: id++,
    slug,
    nombre: p.nombre,
    descripcion: p.marca,
    precio: p.precio,
    imagen: p.imagen,
    volumen: `${p.volumenML} ML`,
    stock: p.stock,
    esNuevo: p.esNuevo ?? false,
    destacado: p.destacado ?? false,
    marca: p.marca,
    categorias: p.categorias.map((nombre) => ({
      nombre,
      slug: slugCategoria(nombre),
    })),
    notasSalida: notas?.salida ?? null,
    notasCorazon: notas?.corazon ?? null,
    notasFondo: notas?.fondo ?? null,
  };
});