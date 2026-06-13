import type { Metadata } from "next";

import LegalPageShell from "@/app/components/legal/LegalPageShell";
import { faqItems } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas sobre pedidos, envíos, pagos y perfumes 1.1 en Essenza Perfumería.",
};

export default function PreguntasFrecuentesPage() {
  return (
    <LegalPageShell
      titulo="Preguntas frecuentes"
      descripcion="Resolvemos las dudas más comunes sobre compras, pagos y entregas."
    >
      <dl className="space-y-6">
        {faqItems.map((item) => (
          <div key={item.pregunta} className="rounded-2xl border border-border bg-cream/30 p-5">
            <dt className="text-sm font-semibold text-foreground">{item.pregunta}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted">{item.respuesta}</dd>
          </div>
        ))}
      </dl>
    </LegalPageShell>
  );
}
