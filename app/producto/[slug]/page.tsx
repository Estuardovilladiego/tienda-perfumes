import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductoDetalle from "@/app/components/producto/ProductoDetalle";
import JsonLd from "@/app/components/seo/JsonLd";
import { urlProductoAbsoluta } from "@/lib/producto-slug";
import { jsonLdProduct, metadataOpenGraph } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { getProductoPorSlug } from "@/lib/productos";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) {
    return { title: "Producto no encontrado" };
  }

  const titulo = `${producto.nombre}${producto.marca ? ` — ${producto.marca}` : ""}`;
  const descripcion = `Compra ${producto.nombre}${producto.marca ? ` de ${producto.marca}` : ""} (${producto.volumen}) en Essenza Perfumería. Perfume 1.1 con envío en Barranquilla y Colombia.`;

  return metadataOpenGraph({
    title: titulo,
    description: descripcion,
    path: `/producto/${producto.slug}`,
    images: [producto.imagen],
  });
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) notFound();

  const urlProducto = urlProductoAbsoluta(producto.slug, getSiteUrl());

  return (
    <>
      <JsonLd data={jsonLdProduct(producto)} />
      <ProductoDetalle producto={producto} urlProducto={urlProducto} />
    </>
  );
}
