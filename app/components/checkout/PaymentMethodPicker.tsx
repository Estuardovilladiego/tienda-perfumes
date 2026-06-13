"use client";

import PaymentCuentaBox from "@/app/components/checkout/PaymentCuentaBox";
import type { MetodoPago, MetodoPagoId } from "@/lib/metodos-pago";
import { instruccionesPago, metodosPago } from "@/lib/metodos-pago";
import { RECARGO_FINANCIACION_PORCENTAJE, aplicaRecargoFinanciacion } from "@/lib/recargo-financiacion";

type Props = {
  seleccionado: MetodoPagoId;
  onSelect: (id: MetodoPagoId) => void;
  total: number;
};

export default function PaymentMethodPicker({ seleccionado, onSelect, total }: Props) {
  const metodo = metodosPago.find((m) => m.id === seleccionado);

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {metodosPago.map((m) => (
          <PaymentOption
            key={m.id}
            metodo={m}
            activo={seleccionado === m.id}
            onSelect={() => onSelect(m.id)}
          />
        ))}
      </div>

      {metodo ? (
        <div className="rounded-xl border border-border/80 bg-cream/30 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            {metodo.label}
          </p>
          {aplicaRecargoFinanciacion(metodo.id) ? (
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              Este método incluye un recargo del {RECARGO_FINANCIACION_PORCENTAJE}% sobre el
              subtotal.
            </p>
          ) : null}
          <PaymentCuentaBox metodoId={metodo.id} compact />
          <ul className="mt-2.5 space-y-1 text-[11px] leading-relaxed text-muted">
            {instruccionesPago(metodo.id, total, "—").map((linea) => (
              <li key={linea} className="flex gap-2">
                <span className="text-gold/70">·</span>
                <span>{linea}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function PaymentOption({
  metodo,
  activo,
  onSelect,
}: {
  metodo: MetodoPago;
  activo: boolean;
  onSelect: () => void;
}) {
  const conRecargo = aplicaRecargoFinanciacion(metodo.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition min-[400px]:py-2.5 ${
        activo
          ? "border-gold/50 bg-white shadow-[0_2px_12px_rgba(184,149,108,0.12)]"
          : "border-border bg-white hover:border-gold/30"
      }`}
    >
      <div className="min-w-0 pr-3">
        <span className="text-[13px] font-medium">{metodo.label}</span>
        <p className="mt-0.5 truncate text-[10px] text-muted">
          {metodo.descripcion}
          {conRecargo ? ` · +${RECARGO_FINANCIACION_PORCENTAJE}% recargo` : ""}
        </p>
      </div>
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
          activo ? "border-gold bg-gold" : "border-border bg-white"
        }`}
        aria-hidden
      >
        {activo ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
      </span>
    </button>
  );
}
