import { jsonError, jsonOk } from "@/lib/api/http";
import { getCategoriasPublicas } from "@/lib/categorias-publicas";

export const dynamic = "force-dynamic";

/** GET /api/categorias */
export async function GET() {
  try {
    const categorias = await getCategoriasPublicas();
    return jsonOk({ categorias });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al listar categorias";
    return jsonError(message, 500);
  }
}
