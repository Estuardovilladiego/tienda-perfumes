import type { Metadata } from "next";

import LegalPageShell from "@/app/components/legal/LegalPageShell";
import { privacidadSections } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo Essenza Perfumería trata y protege tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <LegalPageShell
      titulo="Política de privacidad"
      descripcion="Última actualización: junio 2026."
    >
      <div className="space-y-8">
        {privacidadSections.map((section) => (
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
