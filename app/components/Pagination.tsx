import Link from "next/link";

import { buildCatalogoUrl } from "@/lib/catalogo-url";
import { buildCategoriaUrl } from "@/lib/categorias-url";

type Props = {
  pagina: number;
  totalPaginas: number;
  busqueda?: string;
  orden?: string;
  marca?: string;
  categoriaSlug?: string;
};

function paginasVisibles(actual: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const paginas: (number | "ellipsis")[] = [1];

  if (actual > 3) paginas.push("ellipsis");

  const inicio = Math.max(2, actual - 1);
  const fin = Math.min(total - 1, actual + 1);

  for (let n = inicio; n <= fin; n++) {
    paginas.push(n);
  }

  if (actual < total - 2) paginas.push("ellipsis");

  if (total > 1) paginas.push(total);

  return paginas;
}

export default function Pagination({
  pagina,
  totalPaginas,
  busqueda = "",
  orden,
  marca,
  categoriaSlug,
}: Props) {
  if (totalPaginas <= 1) return null;

  const query = {
    pagina: undefined as number | undefined,
    busqueda: busqueda || undefined,
    orden,
    marca,
  };
  const href = (n: number) =>
    categoriaSlug
      ? buildCategoriaUrl({ slug: categoriaSlug, ...query, pagina: n })
      : buildCatalogoUrl({ ...query, pagina: n });

  const visibles = paginasVisibles(pagina, totalPaginas);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:mt-12 sm:gap-2"
      aria-label="Paginación"
    >
      {pagina > 1 ? (
        <Link
          href={href(pagina - 1)}
          className="rounded-full border border-border px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider transition hover:border-foreground sm:px-4 sm:text-xs"
        >
          Anterior
        </Link>
      ) : (
        <span className="rounded-full border border-transparent px-3 py-2.5 text-[11px] text-muted sm:px-4 sm:text-xs">
          Anterior
        </span>
      )}

      {visibles.map((n, i) =>
        n === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-10 min-w-8 items-center justify-center text-sm text-muted"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            className={`flex h-10 min-w-10 items-center justify-center rounded-full text-sm font-medium transition ${
              n === pagina
                ? "bg-foreground text-white"
                : "border border-border hover:border-foreground"
            }`}
            aria-current={n === pagina ? "page" : undefined}
          >
            {n}
          </Link>
        )
      )}

      {pagina < totalPaginas ? (
        <Link
          href={href(pagina + 1)}
          className="rounded-full border border-border px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider transition hover:border-foreground sm:px-4 sm:text-xs"
        >
          Siguiente
        </Link>
      ) : (
        <span className="rounded-full border border-transparent px-3 py-2.5 text-[11px] text-muted sm:px-4 sm:text-xs">
          Siguiente
        </span>
      )}
    </nav>
  );
}
