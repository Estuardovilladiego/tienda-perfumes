import type { Metadata } from "next";

import LegalPageShell from "@/app/components/legal/LegalPageShell";
import { lineasCuentasPago, metodosPago, titularPago } from "@/lib/metodos-pago";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Métodos de pago",
  description: "Formas de pago aceptadas en Essenza Perfumería: Nequi, Daviplata, Bancolombia y más.",
};

export default function MetodosPagoPage() {
  const cuentas = lineasCuentasPago();

  return (
    <LegalPageShell
      titulo="Métodos de pago"
      descripcion="Al finalizar tu compra eliges cómo pagar. Luego envías el comprobante por WhatsApp con tu número de pedido."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-base font-semibold text-foreground">Opciones disponibles</h2>
          <ul className="mt-4 space-y-3">
            {metodosPago.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm"
              >
                <span className="font-medium">{m.label}</span>
                <span className="mt-0.5 block text-muted">{m.descripcion}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">Cuentas para transferir</h2>
          <p className="mt-2 text-sm text-muted">
            Titular: <strong className="text-foreground">{titularPago.nombre}</strong>
            {titularPago.cedula ? ` · Cédula ${titularPago.cedula}` : null}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {cuentas.map((c) => (
              <li key={c.label} className="flex flex-wrap gap-x-2 rounded-lg bg-cream/40 px-3 py-2">
                <span className="font-medium text-foreground">{c.label}:</span>
                <span className="text-muted">{c.valor}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gold/30 bg-gold/5 p-5">
          <h2 className="text-base font-semibold text-foreground">¿Necesitas ayuda?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Escríbenos por WhatsApp al {site.whatsappDisplay} y te guiamos con el pago de tu pedido.
          </p>
          <a
            href={whatsappUrl("Hola, tengo una duda sobre métodos de pago en Essenza.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex text-sm"
          >
            Contactar por WhatsApp
          </a>
        </section>
      </div>
    </LegalPageShell>
  );
}
