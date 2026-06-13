import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CategoriaClient from "@/app/components/CategoriaClient";
import { parseMarcaSlug, parseOrdenCatalogo } from "@/lib/catalogo-filtros";
import { getCategoriaPublicaPorSlug } from "@/lib/categorias-publicas";
import { esModoDemoEstatico } from "@/lib/config";
import { getProductosPaginados } from "@/lib/productos";
import { metadataOpenGraph } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pagina?: string; q?: string; orden?: string; marca?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoriaPublicaPorSlug(slug);
  if (!categoria) return { title: "Categoría no encontrada" };

  return metadataOpenGraph({
    title: `Perfumes ${categoria.nombre}`,
    description: `Fragancias ${categoria.nombre.toLowerCase()} 1.1 en Essenza Perfumería, Barranquilla. ${categoria.cantidad} productos disponibles.`,
    path: `/categorias/${slug}`,
    images: [categoria.imagen],
  });
}

export default async function CategoriaSlugPage({ params, searchParams }: Props) {  const { slug } = await params;
  const categoria = await getCategoriaPublicaPorSlug(slug);
  if (!categoria) notFound();

  const query = await searchParams;
  const pagina = Math.max(1, Number(query.pagina) || 1);
  const busqueda = query.q?.trim() ?? "";

  const data = await getProductosPaginados(pagina, undefined, {
    busqueda,
    categoriaSlug: slug,
    orden: parseOrdenCatalogo(query.orden),
    marcaSlug: parseMarcaSlug(query.marca),
  });

  return (
    <CategoriaClient
      {...data}
      categoriaNombre={categoria.nombre}
      categoriaSlug={slug}
      mostrarAvisoDemo={esModoDemoEstatico()}
    />
  );
}
