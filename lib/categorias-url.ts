export type CategoriaQuery = {
  slug: string;
  pagina?: number;
  busqueda?: string;
  orden?: string;
  marca?: string;
};

export function buildCategoriaUrl(options: CategoriaQuery): string {
  const params = new URLSearchParams();
  if (options.busqueda?.trim()) {
    params.set("q", options.busqueda.trim());
  }
  if (options.orden && options.orden !== "nombre") {
    params.set("orden", options.orden);
  }
  if (options.marca?.trim()) {
    params.set("marca", options.marca.trim());
  }
  if (options.pagina && options.pagina > 1) {
    params.set("pagina", String(options.pagina));
  }
  const query = params.toString();
  const base = `/categorias/${options.slug}`;
  return query ? `${base}?${query}` : base;
}
