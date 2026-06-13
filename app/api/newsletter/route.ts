import { suscribirNewsletter } from "@/lib/api/newsletter";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/http";
import type { NewsletterInput } from "@/lib/api/types";

/** POST /api/newsletter — suscripción (requiere MySQL) */
export async function POST(request: Request) {
  try {
    const body = parseJsonBody<NewsletterInput>(await request.json());
    if (!body?.email) {
      return jsonError('Se requiere el campo "email"', 400);
    }

    const resultado = await suscribirNewsletter(body.email);
    return jsonOk(
      {
        email: resultado.email,
        mensaje: resultado.yaRegistrado
          ? "Ya estabas suscrito"
          : "Suscripción exitosa",
      },
      resultado.yaRegistrado ? 200 : 201
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error en newsletter";
    const status = message.includes("requiere MySQL") ? 503 : 400;
    return jsonError(message, status);
  }
}
