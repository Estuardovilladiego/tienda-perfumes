import { validarCarrito } from "@/lib/api/carrito";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/http";
import type { CarritoItemInput } from "@/lib/api/types";

type Body = { items: CarritoItemInput[] };

/** POST /api/carrito/validar */
export async function POST(request: Request) {
  try {
    const body = parseJsonBody<Body>(await request.json());
    if (!body?.items || !Array.isArray(body.items)) {
      return jsonError('Se requiere un arreglo "items" con { id, cantidad }', 400);
    }

    const resultado = await validarCarrito(body.items);
    return jsonOk(resultado, resultado.valido ? 200 : 422);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al validar carrito";
    return jsonError(message, 500);
  }
}
