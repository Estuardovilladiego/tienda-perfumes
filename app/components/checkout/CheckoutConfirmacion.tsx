"use client";

import PaymentCuentaBox from "@/app/components/checkout/PaymentCuentaBox";
import CheckoutResumenTotales from "@/app/components/checkout/CheckoutResumenTotales";
import type { MetodoPagoId } from "@/lib/metodos-pago";
import { instruccionesPago, labelMetodoPago, numeroPedidoVisible } from "@/lib/metodos-pago";

type Props = {
  pedidoId: number;
  numeroPedido: string;
  subtotal: number;
  recargoFinanciacion: number;
  total: number;
  metodoPago: MetodoPagoId;
  email?: string;
  onWhatsApp: () => void;
  onCerrar: () => void;
};

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CheckoutConfirmacion({
  pedidoId,
  numeroPedido,
  subtotal,
  recargoFinanciacion,
  total,
  metodoPago,
  email,
  onWhatsApp,
  onCerrar,
}: Props) {
  const numeroVisible = numeroPedidoVisible(numeroPedido, pedidoId);

  return (
    <div className="checkout-gracias -mx-1 px-1 pb-2">
      <div className="checkout-gracias-card">
        <h2 className="checkout-gracias-title">
          Pedido registrado con éxito
        </h2>

        <p className="checkout-gracias-text">
          Envíanos por WhatsApp tu{" "}
          <strong>número de pedido: {numeroVisible}</strong> y el comprobante de pago.
          {email ? (
            <>
              {" "}
              Resumen enviado a <strong>{email}</strong>.
            </>
          ) : null}
        </p>

        <div className="checkout-gracias-total">
          <CheckoutResumenTotales
            subtotal={subtotal}
            recargoFinanciacion={recargoFinanciacion}
            total={total}
            destacarTotal
          />
          <span className="mt-2 block text-xs font-normal text-[#8b7355]">
            {labelMetodoPago(metodoPago)}
          </span>
        </div>

        <PaymentCuentaBox metodoId={metodoPago} />

        <ul className="mt-4 space-y-1.5 rounded-xl border border-border/70 bg-white/80 p-3.5 text-left text-[11px] leading-relaxed text-muted">
          {instruccionesPago(metodoPago, total, numeroPedido).map((linea) => (
            <li key={linea}>• {linea}</li>
          ))}
        </ul>

        <button type="button" onClick={onWhatsApp} className="checkout-gracias-whatsapp">
          <IconWhatsApp />
          Enviar mensaje por WhatsApp
        </button>
      </div>

      <button
        type="button"
        onClick={onCerrar}
        className="cart-back-link mx-auto mt-4 block"
      >
        Cerrar
      </button>
    </div>
  );
}
