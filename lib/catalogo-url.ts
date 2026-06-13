export type CatalogoQuery = {
  pagina?: number;
  busqueda?: string;
  orden?: string;
  marca?: string;
};

export function buildCatalogoUrl(options?: CatalogoQuery): string {
  const params = new URLSearchParams();
  if (options?.busqueda?.trim()) {
    params.set("q", options.busqueda.trim());
  }
  if (options?.orden && options.orden !== "nombre") {
    params.set("orden", options.orden);
  }
  if (options?.marca?.trim()) {
    params.set("marca", options.marca.trim());
  }
  if (options?.pagina && options.pagina > 1) {
    params.set("pagina", String(options.pagina));
  }
  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}
