"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import Cart from "@/app/components/Cart";
import CartToast from "@/app/components/CartToast";
import ProductModal from "@/app/components/ProductModal";
import type { Producto } from "@/app/types/producto";
import { validarCarritoCliente } from "@/lib/client-api";
import {
  clearCartSnapshot,
  getCartServerSnapshot,
  getCartSnapshot,
  setCartSnapshot,
  subscribeCart,
} from "@/lib/cart-store";
import { mismasLineaCarrito } from "@/lib/decants";

type CartContextValue = {
  carrito: Producto[];
  cantidad: number;
  subtotal: number;
  carritoAbierto: boolean;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  agregarAlCarrito: (producto: Producto, cantidadAgregar?: number) => Promise<boolean>;
  comprarAhora: (producto: Producto, cantidadAgregar?: number) => Promise<boolean>;
  eliminarDelCarrito: (item: Producto) => void;
  actualizarCantidadCarrito: (item: Producto, cantidad: number) => Promise<boolean>;
  vaciarCarrito: () => void;
  abrirModal: (producto: Producto) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const carrito = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [checkoutInmediato, setCheckoutInmediato] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Producto agregado al carrito");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cantidad = useMemo(
    () => carrito.reduce((acc, item) => acc + item.cantidad, 0),
    [carrito]
  );

  const subtotal = useMemo(
    () => carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [carrito]
  );

  const mostrarToast = useCallback(
    (message: string, variant: "success" | "error" = "success") => {
      setToastMessage(message);
      setToastVariant(variant);
      setToastVisible(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setToastVisible(false), variant === "error" ? 3500 : 2000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const validarStockProducto = useCallback(
    async (producto: Producto, cantidadNueva: number) => {
      const validacion = await validarCarritoCliente([
        {
          id: producto.id,
          cantidad: cantidadNueva,
          presentacionMl: producto.presentacionMl ?? undefined,
        },
      ]);
      if (!validacion.ok) {
        mostrarToast(validacion.error, "error");
        return false;
      }
      if (!validacion.data.valido) {
        mostrarToast(validacion.data.errores[0] || "Stock insuficiente", "error");
        return false;
      }
      return true;
    },
    [mostrarToast]
  );

  const agregarAlCarrito = useCallback(
    async (producto: Producto, cantidadAgregar = 1) => {
      const qty = Math.max(1, cantidadAgregar);
      const enCarrito = carrito.find((item) => mismasLineaCarrito(item, producto));
      const cantidadTotal = (enCarrito?.cantidad ?? 0) + qty;

      const ok = await validarStockProducto(producto, cantidadTotal);
      if (!ok) return false;

      setCartSnapshot((prev) => {
        const existe = prev.find((item) => mismasLineaCarrito(item, producto));
        if (existe) {
          return prev.map((item) =>
            mismasLineaCarrito(item, producto)
              ? { ...item, cantidad: item.cantidad + qty, precio: producto.precio, volumen: producto.volumen }
              : item
          );
        }
        return [...prev, { ...producto, cantidad: qty }];
      });

      setCarritoAbierto(true);
      mostrarToast("Producto agregado al carrito");
      return true;
    },
    [carrito, mostrarToast, validarStockProducto]
  );

  const comprarAhora = useCallback(
    async (producto: Producto, cantidadAgregar = 1) => {
      const qty = Math.max(1, cantidadAgregar);
      const ok = await validarStockProducto(producto, qty);
      if (!ok) return false;

      setCartSnapshot([{ ...producto, cantidad: qty }]);
      setCheckoutInmediato(true);
      setCarritoAbierto(true);
      setModalAbierto(false);
      return true;
    },
    [validarStockProducto]
  );

  const eliminarDelCarrito = useCallback((item: Producto) => {
    setCartSnapshot((prev) =>
      prev
        .map((linea) =>
          mismasLineaCarrito(linea, item)
            ? { ...linea, cantidad: linea.cantidad - 1 }
            : linea
        )
        .filter((linea) => linea.cantidad > 0)
    );
  }, []);

  const actualizarCantidadCarrito = useCallback(
    async (item: Producto, cantidadNueva: number) => {
      const qty = Math.max(0, Math.min(99, Math.floor(cantidadNueva)));
      const enCarrito = carrito.find((i) => mismasLineaCarrito(i, item));
      if (!enCarrito) return false;

      if (qty === 0) {
        setCartSnapshot((prev) => prev.filter((i) => !mismasLineaCarrito(i, item)));
        return true;
      }

      if (qty > enCarrito.cantidad) {
        const ok = await validarStockProducto(enCarrito, qty);
        if (!ok) return false;
      }

      setCartSnapshot((prev) =>
        prev.map((i) => (mismasLineaCarrito(i, item) ? { ...i, cantidad: qty } : i))
      );
      return true;
    },
    [carrito, validarStockProducto]
  );

  const vaciarCarrito = useCallback(() => {
    clearCartSnapshot();
  }, []);

  const abrirModal = useCallback((producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  }, []);

  const value: CartContextValue = {
    carrito,
    cantidad,
    subtotal,
    carritoAbierto,
    abrirCarrito: () => setCarritoAbierto(true),
    cerrarCarrito: () => setCarritoAbierto(false),
    agregarAlCarrito,
    comprarAhora,
    eliminarDelCarrito,
    actualizarCantidadCarrito,
    vaciarCarrito,
    abrirModal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Cart
        abierto={carritoAbierto}
        cerrar={() => setCarritoAbierto(false)}
        carrito={carrito}
        actualizarCantidadCarrito={actualizarCantidadCarrito}
        vaciarCarrito={vaciarCarrito}
        checkoutInmediato={checkoutInmediato}
        onCheckoutConsumido={() => setCheckoutInmediato(false)}
      />
      <CartToast visible={toastVisible} message={toastMessage} variant={toastVariant} />
      <ProductModal
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        producto={productoSeleccionado}
        agregarAlCarrito={agregarAlCarrito}
        comprarAhora={comprarAhora}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
