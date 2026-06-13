import { jsonError, jsonOk } from "@/lib/api/http";
import { parseMarcaSlug, parseOrdenCatalogo } from "@/lib/catalogo-filtros";
import { getProductosPaginados } from "@/lib/productos";

/** GET /api/productos?pagina=1&q=dior&categoria=hombre */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);
    const q = searchParams.get("q") ?? "";
    const categoria = searchParams.get("categoria") ?? undefined;
    const orden = searchParams.get("orden") ?? undefined;
    const marca = searchParams.get("marca") ?? undefined;

    const data = await getProductosPaginados(pagina, undefined, {
      busqueda: q,
      categoriaSlug: categoria,
      orden: parseOrdenCatalogo(orden),
      marcaSlug: parseMarcaSlug(marca),
    });
    return jsonOk(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al listar productos";
    return jsonError(message, 500);
  }
}
