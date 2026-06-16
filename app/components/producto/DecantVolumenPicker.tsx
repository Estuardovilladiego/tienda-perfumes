"use client";

import type { ProductoCatalogo } from "@/app/types/producto";
import { formatPrecioCOP } from "@/lib/format-precio";
import {
  opcionesPresentacionDecant,
  type VolumenDecantML,
} from "@/lib/decants";

type Props = {
  seleccionadoMl: VolumenDecantML;
  onSeleccionar: (ml: VolumenDecantML) => void;
};

export default function DecantVolumenPicker({ seleccionadoMl, onSeleccionar }: Props) {
  const opciones = opcionesPresentacionDecant();

  return (
    <div className="rounded-lg border border-border/70 bg-cream/40 px-3 py-2.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">
        Presentación
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {opciones.map((opcion) => {
          const activo = opcion.ml === seleccionadoMl;
          return (
            <button
              key={opcion.ml}
              type="button"
              onClick={() => onSeleccionar(opcion.ml)}
              className={`rounded-lg border px-2 py-2 text-center transition ${
                activo
                  ? "border-gold bg-white shadow-sm"
                  : "border-border/70 bg-white/70 hover:border-gold/40"
              }`}
            >
              <span className="block text-[11px] font-semibold text-foreground">
                {opcion.ml} ml
              </span>
              <span className="mt-0.5 block text-[10px] text-muted">
                $ {formatPrecioCOP(opcion.precio)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
