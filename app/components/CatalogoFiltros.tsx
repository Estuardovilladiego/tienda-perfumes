"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ORDENES_CATALOGO,
  type MarcaCatalogo,
  type OrdenCatalogo,
} from "@/lib/catalogo-filtros";
import { buildCatalogoUrl } from "@/lib/catalogo-url";
import { buildCategoriaUrl } from "@/lib/categorias-url";

type Props = {
  marcas: MarcaCatalogo[];
  orden: OrdenCatalogo;
  marca: string;
  categoriaSlug?: string;
  busqueda?: string;
};

export default function CatalogoFiltros({
  marcas,
  orden,
  marca,
  categoriaSlug,
  busqueda = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navegar(partial: { orden?: string; marca?: string }) {
    const q = searchParams.get("q") ?? busqueda;
    const nextOrden = partial.orden ?? orden;
    const nextMarca = partial.marca ?? marca;

    const url = categoriaSlug
      ? buildCategoriaUrl({
          slug: categoriaSlug,
          busqueda: q,
          orden: nextOrden,
          marca: nextMarca,
        })
      : buildCatalogoUrl({
          busqueda: q,
          orden: nextOrden,
          marca: nextMarca,
        });

    router.push(url);
  }

  return (
    <div className="catalog-filters">
      <label className="catalog-filter">
        <span className="catalog-filter-label">Ordenar</span>
        <span className="catalog-filter-select-wrap">
          <select
            value={orden}
            onChange={(e) => navegar({ orden: e.target.value })}
            className="catalog-filter-select"
            aria-label="Ordenar productos"
          >
            {ORDENES_CATALOGO.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="catalog-filter-chevron" aria-hidden />
        </span>
      </label>

      <span className="catalog-filter-divider" aria-hidden />

      <label className="catalog-filter">
        <span className="catalog-filter-label">Marca</span>
        <span className="catalog-filter-select-wrap">
          <select
            value={marca}
            onChange={(e) => navegar({ marca: e.target.value })}
            className="catalog-filter-select"
            aria-label="Filtrar por marca"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.nombre}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="catalog-filter-chevron" aria-hidden />
        </span>
      </label>
    </div>
  );
}
