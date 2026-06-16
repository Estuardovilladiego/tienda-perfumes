import { crearPedido, mensajeErrorCrearPedido, notificarPedidoPorEmail } from "@/lib/api/pedidos";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api/http";
import type { CrearPedidoInput } from "@/lib/api/types";

/** SMTP puede tardar varios segundos; esperamos el envío antes de responder. */
export const maxDuration = 30;

/** POST /api/pedidos — crear pedido (requiere MySQL) */
export async function POST(request: Request) {
  try {
    const body = parseJsonBody<CrearPedidoInput>(await request.json());
    if (!body) {
      return jsonError("Cuerpo JSON inválido", 400);
    }

    const pedido = await crearPedido(body);
    const correos = await notificarPedidoPorEmail(pedido);

    return jsonOk(
      {
        id: pedido.id,
        numero: pedido.numero,
        estado: pedido.estado,
        subtotal: pedido.subtotal,
        recargoFinanciacion: pedido.recargoFinanciacion,
        total: pedido.total,
        items: pedido.items,
        ciudad: pedido.ciudad,
        direccion: pedido.direccion,
        metodoPago: pedido.metodoPago,
        createdAt: pedido.createdAt,
        correoEnviado: correos?.cliente.enviado === true,
      },
      201
    );
  } catch (e) {
    const { message, status } = mensajeErrorCrearPedido(e);
    return jsonError(message, status);
  }
}
