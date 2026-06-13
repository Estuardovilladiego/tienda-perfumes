import { RECARGO_FINANCIACION_PORCENTAJE } from "@/lib/recargo-financiacion";
import { formatPrecioCOP } from "@/lib/format-precio";

type Props = {
  subtotal: number;
  recargoFinanciacion: number;
  total: number;
  /** Resaltar el total final (paso de pago / confirmación). */
  destacarTotal?: boolean;
};

export default function CheckoutResumenTotales({
  subtotal,
  recargoFinanciacion,
  total,
  destacarTotal = false,
}: Props) {
  return (
    <div className="checkout-totales space-y-2">
      <div className="checkout-total-row">
        <span className="checkout-total-label">Subtotal</span>
        <span className="checkout-total-value tabular-nums">$ {formatPrecioCOP(subtotal)}</span>
      </div>
      {recargoFinanciacion > 0 ? (
        <div className="checkout-total-row checkout-total-row-recargo">
          <span className="checkout-total-label">
            Recargo financiación ({RECARGO_FINANCIACION_PORCENTAJE}%)
          </span>
          <span className="checkout-total-value tabular-nums">
            $ {formatPrecioCOP(recargoFinanciacion)}
          </span>
        </div>
      ) : null}
      <div
        className={`checkout-total-row checkout-total-row-final ${destacarTotal ? "is-highlight" : ""}`}
      >
        <span className="checkout-total-label">Total final</span>
        <span className="checkout-total-value checkout-total-value-final tabular-nums">
          $ {formatPrecioCOP(total)}
        </span>
      </div>
    </div>
  );
}
