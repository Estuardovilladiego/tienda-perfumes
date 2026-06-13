import type {
  CarritoItemInput,
  CrearPedidoInput,
  ValidarCarritoResponse,
} from "@/lib/api/types";

type ApiSuccess<T> = { ok: true; data: T };
type ApiError = { ok: false; error: string };

async function parseApi<T>(res: Response): Promise<ApiSuccess<T> | ApiError> {
  const json = (await res.json()) as ApiSuccess<T> | ApiError;
  return json;
}

export async function validarCarritoCliente(items: CarritoItemInput[]) {
  const res = await fetch("/api/carrito/validar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return parseApi<ValidarCarritoResponse>(res);
}

export async function crearPedidoCliente(input: CrearPedidoInput) {
  const res = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApi<{
    id: number;
    numero: string;
    estado: string;
    subtotal: number;
    recargoFinanciacion: number;
    total: number;
    ciudad: string;
    direccion: string;
    metodoPago: string;
  }>(res);
}

export async function suscribirNewsletterCliente(email: string) {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseApi<{ email: string; mensaje: string }>(res);
}
