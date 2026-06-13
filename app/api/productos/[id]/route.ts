import { jsonError, jsonOk } from "@/lib/api/http";
import { getProductoPorId } from "@/lib/productos";

type Params = { params: Promise<{ id: string }> };

/** GET /api/productos/1 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) {
      return jsonError("ID de producto inválido", 400);
    }

    const producto = await getProductoPorId(id);
    if (!producto) {
      return jsonError("Producto no encontrado", 404);
    }

    return jsonOk(producto);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al obtener producto";
    return jsonError(message, 500);
  }
}
