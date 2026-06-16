import type { AcordePrincipal } from "@/lib/acordes-perfumes-default";

type Props = {
  acordes: AcordePrincipal[];
};

export default function AcordesPrincipales({ acordes }: Props) {
  if (!acordes.length) return null;

  return (
    <div className="pm-acordes">
      <p className="pm-section-label">Acordes</p>
      <div className="pm-acordes-chips" aria-label="Acordes principales">
        {acordes.map((acorde) => (
          <span key={acorde.nombre} className="pm-acorde-chip">
            {acorde.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}
