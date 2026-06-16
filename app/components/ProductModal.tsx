"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AcordesPrincipales from "@/app/components/producto/AcordesPrincipales";
import DecantVolumenPicker from "@/app/components/producto/DecantVolumenPicker";
import type { Producto } from "@/app/types/producto";
import { formatPrecioCOP } from "@/lib/format-precio";
import {
  productoEnCategoriaDecants,
  resolverPrecioVenta,
  resolverVolumenVenta,
  stockParaVenta,
  type VolumenDecantML,
} from "@/lib/decants";
import { IMAGEN_PLACEHOLDER, urlImagenProducto } from "@/lib/product-imagen";
import { maxCantidadCompra } from "@/lib/stock-display";

type Props = {
  abierto: boolean;
  cerrar: () => void;
  producto: Producto | null;
  modoDecant?: boolean;
  agregarAlCarrito: (producto: Producto, cantidad?: number) => Promise<boolean>;
  comprarAhora: (producto: Producto, cantidad?: number) => Promise<boolean>;
  urlProducto?: string;
};

function notaValida(value?: string | null) {
  const v = value?.trim();
  return v && v !== "—" ? v : null;
}

function notasOlfativas(producto: Producto) {
  const items: { titulo: string; notas: string }[] = [];
  const salida = notaValida(producto.notasSalida);
  const corazon = notaValida(producto.notasCorazon);
  const fondo = notaValida(producto.notasFondo);

  if (salida) items.push({ titulo: "Salida", notas: salida });
  if (corazon) items.push({ titulo: "Corazón", notas: corazon });
  if (fondo) items.push({ titulo: "Fondo", notas: fondo });

  return items;
}

type PanelProps = {
  producto: Producto;
  cerrar: () => void;
  abierto: boolean;
  modoDecant: boolean;
  agregarAlCarrito: (producto: Producto, cantidad?: number) => Promise<boolean>;
  comprarAhora: (producto: Producto, cantidad?: number) => Promise<boolean>;
};

function ProductModalPanel({
  producto: productoInicial,
  cerrar,
  abierto,
  modoDecant,
  agregarAlCarrito,
  comprarAhora,
}: PanelProps) {
  const [presentacionMl, setPresentacionMl] = useState<VolumenDecantML>(30);
  const [cantidad, setCantidad] = useState(1);
  const [imagenFallback, setImagenFallback] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const enDecants = modoDecant && productoEnCategoriaDecants(productoInicial);
  const precioMostrar = resolverPrecioVenta(productoInicial, enDecants ? presentacionMl : null);
  const volumenMostrar = resolverVolumenVenta(productoInicial, enDecants ? presentacionMl : null);

  useEffect(() => {
    setPresentacionMl(30);
    setCantidad(1);
    setImagenFallback(false);
  }, [productoInicial]);

  const productoParaCarrito: Producto = useMemo(
    () => ({
      ...productoInicial,
      precio: precioMostrar,
      volumen: volumenMostrar,
      presentacionMl: enDecants ? presentacionMl : null,
      cantidad,
    }),
    [productoInicial, precioMostrar, volumenMostrar, enDecants, presentacionMl, cantidad]
  );

  const stock = stockParaVenta(
    productoInicial,
    enDecants ? presentacionMl : null,
    enDecants
  );
  const stockFrasco = Math.max(0, productoInicial.stock ?? 0);
  const maxCantidad = maxCantidadCompra(stock);
  const agotado = !enDecants && stock === 0;
  const imagenSrc = imagenFallback ? IMAGEN_PLACEHOLDER : urlImagenProducto(productoInicial.imagen);
  const marca = productoInicial.marca ?? productoInicial.descripcion;

  const notas = notasOlfativas(productoInicial);
  const familia = notaValida(productoInicial.familia);
  const acordes = enDecants ? productoInicial.acordesPrincipales : null;

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

  const descripcion =
    productoInicial.descripcion && productoInicial.descripcion !== marca
      ? productoInicial.descripcion
      : null;

  const handleAgregar = async () => {
    if (agotado || procesando) return;
    setProcesando(true);
    const ok = await agregarAlCarrito(productoParaCarrito, cantidad);
    setProcesando(false);
    if (ok) cerrar();
  };

  const handleComprar = async () => {
    if (agotado || procesando) return;
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
      className={`product-modal-shell ${abierto ? "is-open" : ""}`}
    >
      <button type="button" onClick={cerrar} aria-label="Cerrar" className="pm-close">
        <X size={18} strokeWidth={1.25} />
      </button>

      <div className="pm-gallery">
        {descuento !== null && <span className="pm-badge-descuento">−{descuento}%</span>}
        <div className="pm-gallery-inner">
          <img
            src={imagenSrc}
            alt={productoInicial.nombre}
            onError={() => setImagenFallback(true)}
            className="pm-gallery-image"
          />
        </div>
      </div>

      <div className="pm-body">
        <div className="pm-purchase">
          <header className="pm-header">
            <p className="pm-marca">{marca}</p>
            <h2 id="modal-titulo" className="pm-nombre">
              {productoInicial.nombre}
            </h2>
            {!enDecants && productoInicial.volumen ? (
              <p className="pm-volumen">{productoInicial.volumen}</p>
            ) : null}
          </header>

          <div className="pm-precio-block">
            <p className="pm-precio">$ {formatPrecioCOP(precioMostrar)}</p>
            {!enDecants &&
            productoInicial.precioAnterior != null &&
            productoInicial.precioAnterior > precioMostrar ? (
              <p className="pm-precio-anterior">
                $ {formatPrecioCOP(productoInicial.precioAnterior)}
              </p>
            ) : null}
            {agotado ? (
              <span className="pm-stock pm-stock--agotado">Agotado</span>
            ) : enDecants ? (
              <span className="pm-stock pm-stock--ok">
                {stockFrasco <= 0 ? "Decant disponible" : "Decant · frasco en stock"}
              </span>
            ) : stockFrasco <= 5 ? (
              <span className="pm-stock">Pocas unidades</span>
            ) : null}
          </div>

          {enDecants ? (
            <DecantVolumenPicker
              seleccionadoMl={presentacionMl}
              onSeleccionar={setPresentacionMl}
            />
          ) : null}

          {!agotado ? (
            <div className="pm-cantidad">
              <span className="pm-section-label">Cantidad</span>
              <div className="pm-cantidad-control">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  aria-label="Disminuir cantidad"
                  disabled={cantidad <= 1}
                  className="pm-cantidad-btn"
                >
                  <Minus size={14} />
                </button>
                <span className="pm-cantidad-valor">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                  aria-label="Aumentar cantidad"
                  disabled={cantidad >= maxCantidad}
                  className="pm-cantidad-btn"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : null}

          <footer className="pm-actions">
            <button
              type="button"
              onClick={handleAgregar}
              disabled={procesando || agotado}
              className="pm-btn pm-btn--primary"
            >
              <span className="pm-btn-icon" aria-hidden>
                <ShoppingBag size={17} strokeWidth={1.35} />
              </span>
              {procesando ? "Agregando…" : agotado ? "No disponible" : "Añadir al carrito"}
            </button>
            <button
              type="button"
              onClick={handleComprar}
              disabled={procesando || agotado}
              className="pm-btn pm-btn--secondary"
            >
              Comprar ahora
            </button>
          </footer>
        </div>

        <div className="pm-scroll">
          {notas.length > 0 ? (
            <section className="pm-notas">
              <p className="pm-section-label">Notas olfativas</p>
              <ul className="pm-notas-list">
                {notas.map(({ titulo, notas: texto }) => (
                  <li key={titulo}>
                    <span className="pm-nota-titulo">{titulo}</span>
                    <span className="pm-nota-texto">{texto}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {familia ? (
            <section className="pm-meta">
              <p className="pm-section-label">Familia olfativa</p>
              <p className="pm-meta-texto">{familia}</p>
            </section>
          ) : null}

          {descripcion ? (
            <section className="pm-meta">
              <p className="pm-section-label">Descripción</p>
              <p className="pm-meta-texto">{descripcion}</p>
            </section>
          ) : null}

          {acordes?.length ? <AcordesPrincipales acordes={acordes} /> : null}
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({
  abierto,
  cerrar,
  producto,
  modoDecant = false,
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
      className={`fixed inset-0 z-[100] ${abierto ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!abierto}
    >
      <div
        className={`product-modal-backdrop absolute inset-0 ${abierto ? "opacity-100" : "opacity-0"}`}
        onClick={cerrar}
        aria-hidden
      />

      <div
        className="absolute inset-0 flex items-end justify-center p-0 md:items-center md:p-6"
        onClick={cerrar}
      >
        <ProductModalPanel
          key={`${producto.id}-${modoDecant ? "d" : "f"}`}
          producto={producto}
          cerrar={cerrar}
          abierto={abierto}
          modoDecant={modoDecant}
          agregarAlCarrito={agregarAlCarrito}
          comprarAhora={comprarAhora}
        />
      </div>
    </div>
  );
}
