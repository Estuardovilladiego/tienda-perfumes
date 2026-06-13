"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";

import StockIndicator from "@/app/components/producto/StockIndicator";
import type { Producto, ProductoCatalogo } from "../types/producto";
import { IMAGEN_PLACEHOLDER, urlImagenProducto } from "@/lib/product-imagen";
import { formatPrecioCOP } from "@/lib/format-precio";

type Props = ProductoCatalogo & {
  agregarAlCarrito: (producto: Producto) => void;
  abrirModal: (producto: Producto) => void;
};

export default function ProductCard({
  id,
  slug,
  nombre,
  descripcion,
  precio,
  precioAnterior,
  imagen,
  volumen,
  destacado,
  esNuevo,
  enOferta,
  marca,
  categorias,
  familia,
  notasSalida,
  notasCorazon,
  notasFondo,
  stock,
  agregarAlCarrito,
  abrirModal,
}: Props) {
  const producto: Producto = {
    id,
    slug,
    nombre,
    descripcion,
    precio,
    precioAnterior,
    imagen,
    volumen,
    cantidad: 1,
    destacado,
    esNuevo,
    enOferta,
    marca,
    categorias,
    familia,
    notasSalida,
    notasCorazon,
    notasFondo,
    stock,
  };

  const [imgSrc, setImgSrc] = useState(urlImagenProducto(imagen));

  const descuento =
    precioAnterior && precioAnterior > precio
      ? Math.round(((precioAnterior - precio) / precioAnterior) * 100)
      : null;

  const mostrarFuego = destacado || esNuevo;
  const sinStock = (stock ?? 0) <= 0;

  const iconBtn =
    "text-zinc-400 transition hover:text-[#ea580c] focus-visible:text-[#ea580c] outline-none";

  const verProducto = () => abrirModal(producto);

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition duration-300 hover:shadow-[0_6px_22px_rgba(0,0,0,0.12)] sm:p-4">
      <div className="relative">
        {descuento !== null && (
          <span className="absolute left-0 top-0 z-10 rounded-full bg-[#d97706] px-2 py-0.5 text-[10px] font-bold text-white">
            -{descuento}%
          </span>
        )}

        {mostrarFuego && (
          <span className="absolute right-0 top-0 z-10 text-base" aria-hidden>
            🔥
          </span>
        )}

        <button type="button" onClick={verProducto} className="block w-full cursor-pointer">
          <img
            src={imgSrc}
            alt={nombre}
            onError={() => setImgSrc(IMAGEN_PLACEHOLDER)}
            className="mx-auto h-[100px] w-full max-w-[100px] object-contain transition duration-500 group-hover:scale-[1.03] min-[380px]:h-[110px] min-[380px]:max-w-[110px] sm:h-[130px] sm:max-w-[130px]"
          />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1 sm:gap-4">
        <button
          type="button"
          onClick={() => agregarAlCarrito(producto)}
          aria-label="Agregar al carrito"
          disabled={sinStock}
          className={`tap-target flex items-center justify-center ${iconBtn} disabled:cursor-not-allowed disabled:opacity-30`}
        >
          <ShoppingCart size={20} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={verProducto}
          className={`tap-target flex items-center justify-center px-2 text-xs font-medium uppercase tracking-wider ${iconBtn}`}
        >
          Ver
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col text-center">
        <h3 className="line-clamp-2 min-h-[2.25rem] text-xs font-semibold leading-tight sm:min-h-[2.5rem] sm:text-sm">
          <button
            type="button"
            onClick={verProducto}
            className="cursor-pointer text-zinc-700 transition hover:text-[#ea580c]"
          >
            {nombre}
          </button>
        </h3>
        {(marca || descripcion) && (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-zinc-500 sm:text-xs">
            {marca ?? descripcion}
          </p>
        )}
        <p className="mt-0.5 text-xs font-medium text-zinc-600">{volumen}</p>

        <div className="mt-2 flex justify-center">
          <StockIndicator stock={stock} compact />
        </div>

        <div className="mt-2 flex flex-col items-center justify-center gap-0.5">
          {precioAnterior != null && precioAnterior > precio && (
            <span className="text-[10px] text-zinc-400 line-through sm:text-xs">
              $ {formatPrecioCOP(precioAnterior)}
            </span>
          )}
          <p className="text-base font-bold leading-none text-black min-[380px]:text-lg sm:text-xl">
            $ {formatPrecioCOP(precio)}
          </p>
        </div>
      </div>
    </article>
  );
}
