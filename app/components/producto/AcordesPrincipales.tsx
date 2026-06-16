import type { AcordePrincipal } from "@/lib/acordes-perfumes-default";

type Props = {
  acordes: AcordePrincipal[];
};

export default function AcordesPrincipales({ acordes }: Props) {
  if (!acordes.length) return null;

  const max = Math.max(...acordes.map((a) => a.valor), 1);

  return (
    <div className="rounded-lg border border-border/70 bg-white px-3 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">
        Acordes principales
      </p>
      <ul className="mt-3 space-y-1.5" aria-label="Acordes principales">
        {acordes.map((acorde) => {
          const ancho = Math.max(12, Math.round((acorde.valor / max) * 100));
          return (
            <li key={acorde.nombre}>
              <div
                className="relative flex h-7 min-w-0 items-center overflow-hidden rounded-md"
                style={{ width: `${ancho}%`, backgroundColor: acorde.color }}
                title={`${acorde.nombre} — ${acorde.valor}`}
              >
                <span className="truncate px-2 text-[10px] font-medium capitalize text-white drop-shadow-sm">
                  {acorde.nombre}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
