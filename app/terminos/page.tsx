import type { Metadata } from "next";

import LegalPageShell from "@/app/components/legal/LegalPageShell";
import { terminosSections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso y compra en la tienda en línea de Essenza Perfumería.",
};

export default function TerminosPage() {
  return (
    <LegalPageShell
      titulo="Términos y condiciones"
      descripcion="Al comprar en Essenza aceptas las condiciones descritas a continuación."
    >
      <div className="space-y-8">
        {terminosSections.map((section) => (
          <section key={section.titulo}>
            <h2 className="text-base font-semibold text-foreground">{section.titulo}</h2>
            {section.parrafos.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </LegalPageShell>
  );
}
