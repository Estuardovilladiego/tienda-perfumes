import { Suspense } from "react";

import CatalogoFiltros from "./CatalogoFiltros";
import PageBackLink from "@/app/components/navigation/PageBackLink";
import PageBreadcrumbs, { type BreadcrumbItem } from "@/app/components/navigation/PageBreadcrumbs";
import SearchBar from "./SearchBar";

import type { MarcaCatalogo, OrdenCatalogo } from "@/lib/catalogo-filtros";

type Props = {
  title: string;
  subtitle?: string;
  busqueda: string;
  orden: OrdenCatalogo;
  marca: string;
  marcas: MarcaCatalogo[];
  categoriaSlug?: string;
  backLink?: { href: string; label: string };
  breadcrumbs?: BreadcrumbItem[];
};

export default function CatalogPageHeader({
  title,
  subtitle,
  busqueda,
  orden,
  marca,
  marcas,
  categoriaSlug,
  backLink,
  breadcrumbs,
}: Props) {
  return (
    <header className="catalog-header">
      <div className="section-container catalog-header-inner">
        <div className="catalog-header-nav">
          {backLink ? <PageBackLink href={backLink.href} label={backLink.label} /> : null}
          {breadcrumbs?.length ? <PageBreadcrumbs items={breadcrumbs} /> : null}
        </div>

        <div className="catalog-header-main">
          <div className="catalog-header-title-block">
            <h1 className="catalog-header-title">{title}</h1>
            {subtitle ? <p className="catalog-header-subtitle">{subtitle}</p> : null}
          </div>

          <div className="catalog-header-search">
            <Suspense
              fallback={<div className="catalog-search-skeleton" aria-hidden />}
            >
              <SearchBar
                modoCatalogo={!categoriaSlug}
                modoCategoria={categoriaSlug}
                valorInicial={busqueda}
                className="catalog-search"
              />
            </Suspense>
          </div>
        </div>

        <div className="catalog-header-toolbar">
          <Suspense fallback={null}>
            <CatalogoFiltros
              marcas={marcas}
              orden={orden}
              marca={marca}
              categoriaSlug={categoriaSlug}
              busqueda={busqueda}
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
