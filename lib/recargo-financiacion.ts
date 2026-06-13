import {
  esMetodoPagoValido,
  idMetodoPagoDesdeLabel,
  type MetodoPagoId,
} from "@/lib/metodos-pago";

/** Porcentaje aplicado sobre el subtotal con Sistecredito o Addi. */
export const RECARGO_FINANCIACION_PORCENTAJE = 20;

export const METODOS_RECARGO_FINANCIACION = ["sistecredito", "addi"] as const satisfies readonly MetodoPagoId[];

export type TotalesPedido = {
  subtotal: number;
  recargoFinanciacion: number;
  total: number;
};

export function metodoPagoIdNormalizado(metodoPago: string): MetodoPagoId | null {
  const valor = metodoPago.trim();
  if (esMetodoPagoValido(valor)) return valor as MetodoPagoId;
  return idMetodoPagoDesdeLabel(valor) ?? null;
}

export function aplicaRecargoFinanciacion(metodoPago: string): boolean {
  const id = metodoPagoIdNormalizado(metodoPago);
  return id !== null && (METODOS_RECARGO_FINANCIACION as readonly string[]).includes(id);
}

export function calcularRecargoFinanciacion(subtotal: number): number {
  const base = Math.max(0, Math.round(subtotal));
  return Math.round((base * RECARGO_FINANCIACION_PORCENTAJE) / 100);
}

/** Calcula subtotal, recargo (si aplica) y total final. Fuente única para frontend y backend. */
export function calcularTotalesPedido(subtotal: number, metodoPago: string): TotalesPedido {
  const sub = Math.max(0, Math.round(subtotal));
  const recargoFinanciacion = aplicaRecargoFinanciacion(metodoPago)
    ? calcularRecargoFinanciacion(sub)
    : 0;

  return {
    subtotal: sub,
    recargoFinanciacion,
    total: sub + recargoFinanciacion,
  };
}

export function validarTotalesPedidoCliente(
  input: { subtotal?: number; recargoFinanciacion?: number; total?: number },
  esperado: TotalesPedido
): string | null {
  if (input.subtotal !== undefined && input.subtotal !== esperado.subtotal) {
    return "El subtotal del pedido no coincide. Actualiza la página e intenta de nuevo.";
  }
  if (
    input.recargoFinanciacion !== undefined &&
    input.recargoFinanciacion !== esperado.recargoFinanciacion
  ) {
    return "El recargo de financiación no coincide. Actualiza la página e intenta de nuevo.";
  }
  if (input.total !== undefined && input.total !== esperado.total) {
    return "El total del pedido no coincide. Actualiza la página e intenta de nuevo.";
  }
  return null;
}
