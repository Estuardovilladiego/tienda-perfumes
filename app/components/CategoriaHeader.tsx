import CatalogPageHeader from "@/app/components/CatalogPageHeader";

import type { MarcaCatalogo, OrdenCatalogo } from "@/lib/catalogo-filtros";

type Props = {
  nombre: string;
  slug: string;
  busqueda: string;
  total: number;
  orden: OrdenCatalogo;
  marca: string;
  marcas: MarcaCatalogo[];
};

export default function CategoriaHeader({
  nombre,
  slug,
  busqueda,
  total,
  orden,
  marca,
  marcas,
}: Props) {
  return (
    <CatalogPageHeader
      title={nombre}
      subtitle={`${total} perfume${total !== 1 ? "s" : ""}`}
      busqueda={busqueda}
      orden={orden}
      marca={marca}
      marcas={marcas}
      categoriaSlug={slug}
      backLink={{ href: "/categorias", label: "Categorías" }}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Categorías", href: "/categorias" },
        { label: nombre },
      ]}
    />
  );
}
