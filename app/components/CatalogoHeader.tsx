import CatalogPageHeader from "@/app/components/CatalogPageHeader";

import type { MarcaCatalogo, OrdenCatalogo } from "@/lib/catalogo-filtros";

type Props = {
  busqueda: string;
  orden: OrdenCatalogo;
  marca: string;
  marcas: MarcaCatalogo[];
};

export default function CatalogoHeader({ busqueda, orden, marca, marcas }: Props) {
  return (
    <CatalogPageHeader
      title="Catálogo"
      busqueda={busqueda}
      orden={orden}
      marca={marca}
      marcas={marcas}
      backLink={{ href: "/", label: "Inicio" }}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Catálogo" },
      ]}
    />
  );
}
