import type { MetodoPagoId } from "@/lib/metodos-pago";
import { cuentaMetodoPago } from "@/lib/metodos-pago";

type Props = {
  metodoId: MetodoPagoId;
  compact?: boolean;
};

export default function PaymentCuentaBox({ metodoId, compact = false }: Props) {
  const lineas = cuentaMetodoPago(metodoId);
  if (!lineas.length) return null;

  return (
    <div
      className={
        compact
          ? "mt-3 rounded-lg border border-gold/30 bg-black/5 p-3"
          : "rounded-xl border border-gold/40 bg-[#faf6ef] p-4"
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8b6914]">
        Datos para pagar
      </p>
      <dl className={`${compact ? "mt-2" : "mt-3"} space-y-2.5`}>
        {lineas.map((linea) => (
          <div
            key={linea.label}
            className="flex min-w-0 flex-col gap-0.5 min-[360px]:flex-row min-[360px]:items-baseline min-[360px]:justify-between min-[360px]:gap-4"
          >
            <dt className="shrink-0 text-xs text-muted">{linea.label}</dt>
            <dd className="min-w-0 break-all text-left font-mono text-sm font-semibold text-foreground min-[360px]:text-right">
              {linea.valor}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
