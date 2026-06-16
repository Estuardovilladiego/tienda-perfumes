"use client";

import { ChevronLeft, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import CheckoutConfirmacion from "@/app/components/checkout/CheckoutConfirmacion";
import CheckoutResumenTotales from "@/app/components/checkout/CheckoutResumenTotales";
import PaymentMethodPicker from "@/app/components/checkout/PaymentMethodPicker";
import type { Producto } from "../types/producto";
import { crearPedidoCliente, validarCarritoCliente } from "@/lib/client-api";
import { mensajeComprobanteWhatsApp } from "@/lib/format-pedido-whatsapp";
import { formatPrecioCOP } from "@/lib/format-precio";
import type { MetodoPagoId } from "@/lib/metodos-pago";
import { calcularTotalesPedido } from "@/lib/recargo-financiacion";
import { IMAGEN_PLACEHOLDER, urlImagenProducto } from "@/lib/product-imagen";
import { esEmailValido, normalizarEmail } from "@/lib/validate-email";
import { whatsappUrl } from "@/lib/site";

type CheckoutPaso = "carrito" | "datos" | "pago" | "confirmacion";

type PedidoConfirmado = {
  id: number;
  numero: string;
  subtotal: number;
  recargoFinanciacion: number;
  total: number;
  items: { nombre: string; volumen: string; cantidad: number; precio: number }[];
  ciudad: string;
  direccion: string;
  correoEnviado?: boolean;
};

type CartProps = {
  abierto: boolean;
  cerrar: () => void;
  carrito: Producto[];
  actualizarCantidadCarrito: (id: number, cantidad: number) => Promise<boolean>;
  vaciarCarrito: () => void;
  checkoutInmediato?: boolean;
  onCheckoutConsumido?: () => void;
};

const PASOS: { id: CheckoutPaso; label: string }[] = [
  { id: "carrito", label: "Carrito" },
  { id: "datos", label: "Entrega" },
  { id: "pago", label: "Pago" },
];

function pasoIndice(paso: CheckoutPaso): number {
  if (paso === "confirmacion") return 3;
  return PASOS.findIndex((p) => p.id === paso);
}

export default function Cart({
  abierto,
  cerrar,
  carrito,
  actualizarCantidadCarrito,
  vaciarCarrito,
  checkoutInmediato,
  onCheckoutConsumido,
}: CartProps) {
  const [paso, setPaso] = useState<CheckoutPaso>("carrito");
  const [cantidadActualizando, setCantidadActualizando] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("Barranquilla");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPagoId>("nequi");
  const [pedidoConfirmado, setPedidoConfirmado] = useState<PedidoConfirmado | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState("");

  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totales = useMemo(() => calcularTotalesPedido(subtotal, metodoPago), [subtotal, metodoPago]);

  const itemsApi = carrito.map((item) => ({
    id: item.id,
    cantidad: item.cantidad,
  }));

  useEffect(() => {
    if (!abierto) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  useEffect(() => {
    if (!checkoutInmediato || !abierto || carrito.length === 0) return;
    void iniciarCheckout();
    onCheckoutConsumido?.();
  }, [checkoutInmediato, abierto, carrito.length]);

  function resetCheckout() {
    setPaso("carrito");
    setNombre("");
    setTelefono("");
    setCiudad("Barranquilla");
    setDireccion("");
    setEmail("");
    setMetodoPago("nequi");
    setPedidoConfirmado(null);
    setErrorCheckout("");
  }

  async function iniciarCheckout() {
    setErrorCheckout("");
    setProcesando(true);

    const validacion = await validarCarritoCliente(itemsApi);
    setProcesando(false);

    if (!validacion.ok) {
      setErrorCheckout(validacion.error);
      return;
    }

    if (!validacion.data.valido) {
      setErrorCheckout(validacion.data.errores.join(". ") || "No se pudo validar el carrito");
      return;
    }

    setPaso("datos");
  }

  function validarDatosEntrega() {
    const nombreTrim = nombre.trim();
    const telefonoTrim = telefono.trim();
    const emailTrim = normalizarEmail(email);
    const ciudadTrim = ciudad.trim();
    const direccionTrim = direccion.trim();

    if (!nombreTrim || !telefonoTrim || !ciudadTrim || !direccionTrim) {
      return "Completa nombre, teléfono, ciudad y dirección";
    }
    if (!emailTrim || !esEmailValido(emailTrim)) {
      return "Ingresa un correo válido para enviarte la confirmación del pedido";
    }
    return null;
  }

  function continuarAPago() {
    const error = validarDatosEntrega();
    if (error) {
      setErrorCheckout(error);
      return;
    }
    setErrorCheckout("");
    setPaso("pago");
  }

  async function confirmarPedido() {
    const error = validarDatosEntrega();
    if (error) {
      setErrorCheckout(error);
      return;
    }

    const nombreTrim = nombre.trim();
    const telefonoTrim = telefono.trim();
    const emailTrim = normalizarEmail(email);
    const ciudadTrim = ciudad.trim();
    const direccionTrim = direccion.trim();

    setErrorCheckout("");
    setProcesando(true);

    const pedido = await crearPedidoCliente({
      nombre: nombreTrim,
      telefono: telefonoTrim,
      email: emailTrim,
      ciudad: ciudadTrim,
      direccion: direccionTrim,
      metodoPago,
      subtotal: totales.subtotal,
      recargoFinanciacion: totales.recargoFinanciacion,
      total: totales.total,
      items: itemsApi,
    });

    setProcesando(false);

    if (!pedido.ok) {
      setErrorCheckout(pedido.error);
      return;
    }

    setPedidoConfirmado({
      id: pedido.data.id,
      numero: pedido.data.numero,
      subtotal: pedido.data.subtotal,
      recargoFinanciacion: pedido.data.recargoFinanciacion,
      total: pedido.data.total,
      items: carrito.map((item) => ({
        nombre: item.nombre,
        volumen: item.volumen,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      ciudad: ciudadTrim,
      direccion: direccionTrim,
      correoEnviado: pedido.data.correoEnviado,
    });
    setPaso("confirmacion");
    vaciarCarrito();
  }

  function enviarWhatsAppComprobante() {
    if (!pedidoConfirmado) return;

    const texto = mensajeComprobanteWhatsApp({
      pedidoId: pedidoConfirmado.id,
      numero: pedidoConfirmado.numero,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: normalizarEmail(email),
      ciudad: pedidoConfirmado.ciudad,
      direccion: pedidoConfirmado.direccion,
      metodoPago,
      subtotal: pedidoConfirmado.subtotal,
      recargoFinanciacion: pedidoConfirmado.recargoFinanciacion,
      total: pedidoConfirmado.total,
      fecha: new Date(),
      items: pedidoConfirmado.items.map((i) => ({
        nombre: i.nombre,
        volumen: i.volumen,
        cantidad: i.cantidad,
        precio: i.precio,
      })),
    });
    window.open(whatsappUrl(texto), "_blank", "noopener,noreferrer");
  }

  function handleCerrar() {
    resetCheckout();
    cerrar();
  }

  async function cambiarCantidadItem(id: number, cantidad: number) {
    setCantidadActualizando(id);
    await actualizarCantidadCarrito(id, cantidad);
    setCantidadActualizando(null);
  }

  const indiceActual = pasoIndice(paso);
  const mostrarFooter = paso !== "confirmacion";
  const totalFooter =
    paso === "confirmacion" && pedidoConfirmado
      ? pedidoConfirmado.total
      : paso === "pago"
        ? totales.total
        : subtotal;

  return (
    <>
      <div
        onClick={handleCerrar}
        className={`fixed inset-0 z-[90] bg-[#1a1510]/55 backdrop-blur-[6px] transition-opacity duration-500 ease-out ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!abierto}
      />

      <aside
        className={`cart-drawer fixed right-0 top-0 z-[95] flex h-[100dvh] w-full max-w-[440px] flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Carrito de compras"
        aria-hidden={!abierto}
      >
        <header className="cart-drawer-header safe-top shrink-0 px-4 pb-4 pt-4 sm:px-6 sm:pt-5">
          {paso === "datos" ? (
            <button type="button" onClick={() => setPaso("carrito")} className="cart-header-back mb-3">
              <ChevronLeft size={16} strokeWidth={1.5} />
              Volver al carrito
            </button>
          ) : paso === "pago" ? (
            <button type="button" onClick={() => setPaso("datos")} className="cart-header-back mb-3">
              <ChevronLeft size={16} strokeWidth={1.5} />
              Volver a entrega
            </button>
          ) : paso === "confirmacion" ? (
            <button type="button" onClick={handleCerrar} className="cart-header-back mb-3">
              <ChevronLeft size={16} strokeWidth={1.5} />
              Volver a la tienda
            </button>
          ) : null}

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-gold" />
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground">
                  {paso === "confirmacion" ? "Confirmación" : "Essenza"}
                </h2>
              </div>
              <p className="mt-1 text-xs text-muted">
                {paso === "carrito" && "Revisa tus fragancias seleccionadas"}
                {paso === "datos" && "Información de entrega y contacto"}
                {paso === "pago" && "Selecciona tu método de pago"}
                {paso === "confirmacion" && "Tu pedido fue registrado"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCerrar}
              aria-label="Cerrar carrito"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 text-muted transition hover:border-gold/40 hover:text-foreground"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {paso !== "confirmacion" ? (
            <nav className="cart-steps" aria-label="Pasos del checkout">
              {PASOS.map((step, i) => {
                const activo = step.id === paso;
                const hecho = indiceActual > i;
                return (
                  <div key={step.id} className="flex flex-1 items-center">
                    {i > 0 ? (
                      <div className={`cart-step-line ${hecho || activo ? "is-done" : ""}`} />
                    ) : null}
                    <div className={`cart-step ${activo ? "is-active" : ""} ${hecho ? "is-done" : ""}`}>
                      <span className="cart-step-dot">{hecho ? "✓" : i + 1}</span>
                      <span className="cart-step-label">{step.label}</span>
                    </div>
                  </div>
                );
              })}
            </nav>
          ) : null}
        </header>

        <div className="cart-body flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          {carrito.length === 0 && paso === "carrito" ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="cart-empty-icon">
                <ShoppingBag size={22} strokeWidth={1.25} />
              </div>
              <p className="mt-5 text-sm font-medium text-foreground">Tu carrito está vacío</p>
              <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-muted">
                Explora el catálogo y añade tus perfumes favoritos
              </p>
              <Link href="/catalogo" className="btn-primary mt-6 text-[10px]">
                Ir al catálogo
              </Link>
            </div>
          ) : paso === "confirmacion" && pedidoConfirmado ? (
            <CheckoutConfirmacion
              pedidoId={pedidoConfirmado.id}
              numeroPedido={pedidoConfirmado.numero}
              subtotal={pedidoConfirmado.subtotal}
              recargoFinanciacion={pedidoConfirmado.recargoFinanciacion}
              total={pedidoConfirmado.total}
              metodoPago={metodoPago}
              email={normalizarEmail(email)}
              correoEnviado={pedidoConfirmado.correoEnviado}
              onWhatsApp={enviarWhatsAppComprobante}
              onCerrar={handleCerrar}
            />
          ) : paso === "datos" ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                continuarAPago();
              }}
            >
              <CheckoutInput id="checkout-nombre" label="Nombre completo" value={nombre} onChange={setNombre} />
              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                <CheckoutInput
                  id="checkout-telefono"
                  label="WhatsApp"
                  type="tel"
                  value={telefono}
                  onChange={setTelefono}
                  placeholder="3001234567"
                />
                <CheckoutInput
                  id="checkout-ciudad"
                  label="Ciudad"
                  value={ciudad}
                  onChange={setCiudad}
                />
              </div>
              <CheckoutInput
                id="checkout-email"
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="tu@correo.com"
                hint="Confirmación del pedido por correo"
              />
              <CheckoutInput
                id="checkout-direccion"
                label="Dirección de entrega"
                value={direccion}
                onChange={setDireccion}
                placeholder="Calle, barrio, apartamento"
              />
              <button type="button" onClick={() => setPaso("carrito")} className="cart-back-link pt-1">
                <ChevronLeft size={14} />
                Volver al carrito
              </button>
            </form>
          ) : paso === "pago" ? (
            <div className="space-y-4">
              <PaymentMethodPicker
                seleccionado={metodoPago}
                onSelect={setMetodoPago}
                total={totales.total}
              />
              <button type="button" onClick={() => setPaso("datos")} className="cart-back-link">
                <ChevronLeft size={14} />
                Volver a entrega
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {carrito.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={urlImagenProducto(item.imagen)}
                      alt={item.nombre}
                      onError={(e) => {
                        e.currentTarget.src = IMAGEN_PLACEHOLDER;
                      }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[13px] font-medium leading-snug">{item.nombre}</h3>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
                      {item.volumen}
                      {item.marca ? ` · ${item.marca}` : ""}
                    </p>
                    <div className="mt-2.5 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold tabular-nums">
                          $ {formatPrecioCOP(item.precio * item.cantidad)}
                        </p>
                        {item.cantidad > 1 ? (
                          <p className="text-[10px] text-muted">
                            $ {formatPrecioCOP(item.precio)} c/u
                          </p>
                        ) : null}
                      </div>
                      <div className="inline-flex items-center rounded-full border border-border bg-cream/40">
                        <button
                          type="button"
                          onClick={() => cambiarCantidadItem(item.id, item.cantidad - 1)}
                          disabled={cantidadActualizando === item.id}
                          aria-label="Disminuir cantidad"
                          className="flex h-7 w-7 items-center justify-center rounded-l-full text-muted transition hover:text-foreground disabled:opacity-40"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-xs font-semibold tabular-nums">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidadItem(item.id, item.cantidad + 1)}
                          disabled={cantidadActualizando === item.id || item.cantidad >= 99}
                          aria-label="Aumentar cantidad"
                          className="flex h-7 w-7 items-center justify-center rounded-r-full text-muted transition hover:text-foreground disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mostrarFooter ? (
          <footer className="cart-footer safe-bottom shrink-0 px-4 py-4 sm:px-6 sm:py-5">
            {carrito.length > 0 && paso === "carrito" ? (
              <button
                type="button"
                onClick={vaciarCarrito}
                className="mb-3 w-full text-center text-[10px] font-medium uppercase tracking-[0.16em] text-muted transition hover:text-red-600/80"
              >
                Vaciar carrito
              </button>
            ) : null}

            {(carrito.length > 0 || paso === "datos" || paso === "pago") && (
              <>
                <div className="cart-divider mb-4" />
                {paso === "pago" ? (
                  <div className="mb-4">
                    <CheckoutResumenTotales
                      subtotal={totales.subtotal}
                      recargoFinanciacion={totales.recargoFinanciacion}
                      total={totales.total}
                      destacarTotal
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                        Subtotal
                      </p>
                      {paso === "carrito" && totalUnidades > 0 ? (
                        <p className="mt-0.5 text-[10px] text-muted">
                          {totalUnidades} {totalUnidades === 1 ? "artículo" : "artículos"}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-xl font-semibold tracking-tight tabular-nums">
                      $ {formatPrecioCOP(totalFooter)}
                    </p>
                  </div>
                )}
              </>
            )}

            {errorCheckout ? (
              <p className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
                {errorCheckout}
              </p>
            ) : null}

            {paso === "carrito" && carrito.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={iniciarCheckout}
                  disabled={procesando}
                  className="btn-primary w-full py-3 disabled:cursor-wait disabled:opacity-60"
                >
                  {procesando ? "Validando stock…" : "Finalizar compra"}
                </button>
                <p className="mt-2.5 text-center text-[10px] leading-relaxed tracking-wide text-muted">
                  Nequi · Llaves · Bancolombia · Falabella · Sistecredito · Addi
                </p>
              </>
            ) : null}

            {paso === "datos" ? (
              <button type="button" onClick={continuarAPago} className="btn-primary w-full py-3">
                Continuar al pago
              </button>
            ) : null}

            {paso === "pago" ? (
              <button
                type="button"
                onClick={confirmarPedido}
                disabled={procesando}
                className="btn-primary w-full py-3 disabled:cursor-wait disabled:opacity-60"
              >
                {procesando ? "Registrando pedido…" : "Confirmar pedido"}
              </button>
            ) : null}
          </footer>
        ) : null}
      </aside>
    </>
  );
}

function CheckoutInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="cart-input-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="cart-input"
      />
      {hint ? <p className="mt-1 text-[10px] leading-snug text-muted">{hint}</p> : null}
    </div>
  );
}
