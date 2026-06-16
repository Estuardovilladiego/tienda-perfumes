"use client";

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
    <div className="pm-presentacion">
      <p className="pm-section-label">Presentación</p>
      <div className="pm-presentacion-grid" role="radiogroup" aria-label="Elegir presentación">
        {opciones.map((opcion) => {
          const activo = opcion.ml === seleccionadoMl;
          return (
            <button
              key={opcion.ml}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onSeleccionar(opcion.ml)}
              className={`pm-presentacion-card ${activo ? "is-active" : ""}`}
            >
              <span className="pm-presentacion-ml">{opcion.ml} ml</span>
              <span className="pm-presentacion-precio">$ {formatPrecioCOP(opcion.precio)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
