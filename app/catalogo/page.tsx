import type { Metadata } from "next";

import CatalogoClient from "@/app/components/CatalogoClient";
import { parseMarcaSlug, parseOrdenCatalogo } from "@/lib/catalogo-filtros";
import { esModoDemoEstatico } from "@/lib/config";
import { getProductosPaginados } from "@/lib/productos";
import { metadataOpenGraph } from "@/lib/seo";

export const metadata: Metadata = metadataOpenGraph({
  title: "Catálogo de perfumes",
  description:
    "Explora fragancias 1.1 para hombre, mujer, unisex y árabes. Precios en pesos colombianos y envío en Barranquilla.",
  path: "/catalogo",
});

type Props = {
  searchParams: Promise<{ pagina?: string; q?: string; orden?: string; marca?: string }>;
};

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const busqueda = params.q?.trim() ?? "";

  const data = await getProductosPaginados(pagina, undefined, {
    busqueda,
    orden: parseOrdenCatalogo(params.orden),
    marcaSlug: parseMarcaSlug(params.marca),
  });

  return (
    <CatalogoClient {...data} mostrarAvisoDemo={esModoDemoEstatico()} />
  );
}
