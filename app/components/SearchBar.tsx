"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { parseOrdenCatalogo } from "@/lib/catalogo-filtros";
import { buildCatalogoUrl } from "@/lib/catalogo-url";
import { buildCategoriaUrl } from "@/lib/categorias-url";

type Props = {
  valorInicial?: string;
  modoCatalogo?: boolean;
  modoCategoria?: string;
  className?: string;
};

export default function SearchBar({
  valorInicial = "",
  modoCatalogo = false,
  modoCategoria,
  className = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(valorInicial);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esPrimeraCarga = useRef(true);

  useEffect(() => {
    queueMicrotask(() => setValor(valorInicial));
  }, [valorInicial]);

  const filtrosUrl = () => ({
    orden: parseOrdenCatalogo(searchParams.get("orden")),
    marca: searchParams.get("marca") ?? "",
  });

  const navegar = (texto: string) => {
    const { orden, marca } = filtrosUrl();
    if (modoCategoria) {
      router.push(
        buildCategoriaUrl({
          slug: modoCategoria,
          busqueda: texto,
          orden,
          marca,
        })
      );
      return;
    }
    if (modoCatalogo) {
      router.push(buildCatalogoUrl({ busqueda: texto, orden, marca }));
    }
  };

  const aplicarBusqueda = (texto: string, inmediato = false) => {
    if (!modoCatalogo && !modoCategoria) return;

    const ejecutar = () => navegar(texto);

    if (inmediato) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      ejecutar();
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(ejecutar, 450);
  };

  useEffect(() => {
    if (!modoCatalogo && !modoCategoria) return;
    if (esPrimeraCarga.current) {
      esPrimeraCarga.current = false;
      return;
    }
    aplicarBusqueda(valor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  const limpiar = () => {
    setValor("");
    const { orden, marca } = filtrosUrl();
    if (modoCategoria) {
      router.push(buildCategoriaUrl({ slug: modoCategoria, orden, marca }));
    } else if (modoCatalogo) {
      router.push(buildCatalogoUrl({ orden, marca }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    aplicarBusqueda(valor, true);
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`catalog-search-form ${className}`}
    >
      <div className="catalog-search-field">
        <Search
          size={17}
          className="catalog-search-icon"
          strokeWidth={1.5}
          aria-hidden
        />

        <input
          type="search"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Buscar perfumes..."
          aria-label="Buscar perfumes"
          className="catalog-search-input"
        />

        <div className="catalog-search-actions">
          {valor.length > 0 && (
            <button
              type="button"
              onClick={limpiar}
              aria-label="Limpiar búsqueda"
              className="catalog-search-clear"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
          <button type="submit" className="catalog-search-submit">
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}
