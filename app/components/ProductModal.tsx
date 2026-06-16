"use client";

import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";

import AcordesPrincipales from "@/app/components/producto/AcordesPrincipales";
import DecantVolumenPicker from "@/app/components/producto/DecantVolumenPicker";
import StockIndicator from "@/app/components/producto/StockIndicator";
import type { Producto } from "@/app/types/producto";
import { formatPrecioCOP } from "@/lib/format-precio";
import {
  productoEnCategoriaDecants,
  resolverPrecioVenta,
  resolverVolumenVenta,
  type VolumenDecantML,
} from "@/lib/decants";
import { IMAGEN_PLACEHOLDER, urlImagenProducto } from "@/lib/product-imagen";
import { maxCantidadCompra, stockDisponible } from "@/lib/stock-display";

type Props = {
  abierto: boolean;
  cerrar: () => void;
  producto: Producto | null;
  agregarAlCarrito: (producto: Producto, cantidad?: number) => Promise<boolean>;
  comprarAhora: (producto: Producto, cantidad?: number) => Promise<boolean>;
  urlProducto?: string;
};

function notaValida(value?: string | null) {
  const v = value?.trim();
  return v && v !== "—" ? v : null;
}

function descripcionBreve(producto: Producto): string | null {
  const cats = producto.categorias.map((c) => c.nombre).join(" · ");
  if (cats) return `Fragancia ${cats.toLowerCase()}.`;
  if (producto.descripcion && producto.descripcion !== producto.marca) {
    return producto.descripcion;
  }
  return null;
}

function composicionOlfativa(producto: Producto) {
  const items: { titulo: string; notas: string }[] = [];
  const familia = notaValida(producto.familia);
  const salida = notaValida(producto.notasSalida);
  const corazon = notaValida(producto.notasCorazon);
  const fondo = notaValida(producto.notasFondo);

  if (familia) items.push({ titulo: "Familia olfativa", notas: familia });
  if (salida) items.push({ titulo: "Salida", notas: salida });
  if (corazon) items.push({ titulo: "Corazón", notas: corazon });
  if (fondo) items.push({ titulo: "Fondo", notas: fondo });

  return items.length ? items : null;
}

type PanelProps = {
  producto: Producto;
  cerrar: () => void;
  abierto: boolean;
  agregarAlCarrito: (producto: Producto, cantidad?: number) => Promise<boolean>;
  comprarAhora: (producto: Producto, cantidad?: number) => Promise<boolean>;
};

function ProductModalPanel({
  producto: productoInicial,
  cerrar,
  abierto,
  agregarAlCarrito,
  comprarAhora,
}: PanelProps) {
  const [presentacionMl, setPresentacionMl] = useState<VolumenDecantML>(30);
  const [cantidad, setCantidad] = useState(1);
  const [imagenFallback, setImagenFallback] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const enDecants = productoEnCategoriaDecants(productoInicial);
  const precioMostrar = resolverPrecioVenta(productoInicial, enDecants ? presentacionMl : null);
  const volumenMostrar = resolverVolumenVenta(productoInicial, enDecants ? presentacionMl : null);

  useEffect(() => {
    setPresentacionMl(30);
    setCantidad(1);
    setImagenFallback(false);
  }, [productoInicial]);

  const productoParaCarrito: Producto = {
    ...productoInicial,
    precio: precioMostrar,
    volumen: volumenMostrar,
    presentacionMl: enDecants ? presentacionMl : null,
    cantidad,
  };

  const stock = stockDisponible(productoInicial.stock);
  const maxCantidad = maxCantidadCompra(stock);
  const agotado = stock === 0;
  const imagenSrc = imagenFallback ? IMAGEN_PLACEHOLDER : urlImagenProducto(productoInicial.imagen);
  const marca = productoInicial.marca ?? productoInicial.descripcion;
  const breve = descripcionBreve(productoInicial);
  const composicion = composicionOlfativa(productoInicial);

  const descuento =
    !enDecants &&
    productoInicial.precioAnterior &&
    productoInicial.precioAnterior > productoInicial.precio
      ? Math.round(
          ((productoInicial.precioAnterior - productoInicial.precio) /
            productoInicial.precioAnterior) *
            100
        )
      : null;

  const handleAgregar = async () => {
    if (agotado) return;
    setProcesando(true);
    const ok = await agregarAlCarrito(productoParaCarrito, cantidad);
    setProcesando(false);
    if (ok) cerrar();
  };

  const handleComprar = async () => {
    if (agotado) return;
    setProcesando(true);
    await comprarAhora(productoParaCarrito, cantidad);
    setProcesando(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={(e) => e.stopPropagation()}
      className={`product-modal-shell relative ${abierto ? "is-open" : ""}`}
    >
      <button
        type="button"
        onClick={cerrar}
        aria-label="Cerrar"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-white/90 text-zinc-500 transition hover:border-gold/40 hover:text-foreground md:right-4 md:top-4"
      >
        <X size={16} strokeWidth={1.5} />
      </button>

      <div className="product-modal-image-wrap relative flex min-h-[200px] items-center justify-center p-6 md:min-h-0 md:p-8">
        {descuento !== null && (
          <span className="absolute left-4 top-4 rounded-full bg-gold px-2 py-0.5 text-[9px] font-semibold tracking-wider text-white">
            −{descuento}%
          </span>
        )}
        <img
          src={imagenSrc}
          alt={productoInicial.nombre}
          onError={() => setImagenFallback(true)}
          className="product-modal-image max-h-[180px] w-full object-contain md:max-h-[min(340px,58vh)]"
        />
      </div>

      <div className="product-modal-content flex flex-col border-t border-border/60 md:border-l md:border-t-0">
        <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 md:gap-3.5 md:px-7 md:py-6">
          <div className="pr-8">
            <p className="text-[9px] font-medium uppercase tracking-[0.38em] text-gold">{marca}</p>
            <h2
              id="modal-titulo"
              className="mt-1.5 text-[1.35rem] font-medium leading-tight tracking-tight text-foreground md:text-[1.5rem]"
            >
              {productoInicial.nombre}
            </h2>
            <p className="mt-0.5 text-[11px] tracking-wide text-muted">
              {enDecants ? `Decant · ${volumenMostrar}` : productoInicial.volumen}
            </p>
          </div>

          <div className="product-modal-divider" />

          {enDecants ? (
            <DecantVolumenPicker
              seleccionadoMl={presentacionMl}
              onSeleccionar={setPresentacionMl}
            />
          ) : null}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-xl font-semibold tracking-tight md:text-2xl">
              $ {formatPrecioCOP(precioMostrar)}
            </p>
            {productoInicial.precioAnterior != null &&
              productoInicial.precioAnterior > precioMostrar &&
              !enDecants && (
              <p className="text-sm text-muted line-through">
                $ {formatPrecioCOP(productoInicial.precioAnterior)}
              </p>
            )}
            <StockIndicator stock={stock} compact />
          </div>

          {breve ? (
            <p className="line-clamp-2 text-[12px] leading-relaxed text-muted">{breve}</p>
          ) : null}

          {enDecants && productoInicial.acordesPrincipales?.length ? (
            <AcordesPrincipales acordes={productoInicial.acordesPrincipales} />
          ) : null}

          {composicion ? (
            <div className="rounded-lg border border-border/70 bg-cream/50 px-3 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">
                Notas olfativas
              </p>
              <ul className="mt-2 space-y-2.5">
                {composicion.map(({ titulo, notas }) => (
                  <li key={titulo}>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {titulo}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-foreground/80">{notas}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {!agotado ? (
            <div className="flex items-center gap-3 pt-0.5">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted">
                Cant.
              </span>
              <div className="inline-flex items-center rounded-full border border-border bg-white">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  aria-label="Disminuir cantidad"
                  disabled={cantidad <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-l-full text-muted transition hover:text-foreground disabled:opacity-35"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
                  {cantidad}
                </span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                  aria-label="Aumentar cantidad"
                  disabled={cantidad >= maxCantidad}
                  className="flex h-8 w-8 items-center justify-center rounded-r-full text-muted transition hover:text-foreground disabled:opacity-35"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-1 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleAgregar}
              disabled={procesando || agotado}
              className="btn-primary flex-1 gap-2 py-2.5 text-[10px] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ShoppingCart size={15} strokeWidth={1.5} />
              Añadir al carrito
            </button>
            <button
              type="button"
              onClick={handleComprar}
              disabled={procesando || agotado}
              className="btn-outline flex-1 border-gold/50 py-2.5 text-[10px] text-foreground transition hover:border-gold hover:bg-cream/60 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {procesando ? "Validando…" : "Comprar ahora"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({
  abierto,
  cerrar,
  producto,
  agregarAlCarrito,
  comprarAhora,
}: Props) {
  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, cerrar]);

  if (!producto) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        abierto ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!abierto}
    >
      <div
        className={`product-modal-backdrop absolute inset-0 ${
          abierto ? "opacity-100" : "opacity-0"
        }`}
        onClick={cerrar}
        aria-hidden
      />

      <div
        className="absolute inset-0 flex items-end justify-center p-0 md:items-center md:p-5"
        onClick={cerrar}
      >
        <ProductModalPanel
          key={producto.id}
          producto={producto}
          cerrar={cerrar}
          abierto={abierto}
          agregarAlCarrito={agregarAlCarrito}
          comprarAhora={comprarAhora}
        />
      </div>
    </div>
  );
}
