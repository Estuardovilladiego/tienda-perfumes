import type { Metadata } from "next";

import CategoriasIndexClient from "@/app/components/CategoriasIndexClient";
import { getCategoriasPublicas } from "@/lib/categorias-publicas";
import { metadataOpenGraph } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataOpenGraph({
  title: "Categorías de perfumes",
  description:
    "Hombre, mujer, unisex y árabes. Encuentra tu fragancia por categoría en Essenza Perfumería.",
  path: "/categorias",
});

export default async function CategoriasPage() {  const categorias = await getCategoriasPublicas();
  return <CategoriasIndexClient categorias={categorias} />;
}
