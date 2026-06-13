import type { Producto } from "@/app/types/producto";
import {
  cargarCarritoDesdeStorage,
  guardarCarritoEnStorage,
  limpiarCarritoStorage,
} from "@/lib/cart-storage";

const listeners = new Set<() => void>();

let memoryCart: Producto[] | null = null;

const EMPTY_CART: Producto[] = [];

function getMemoryCart(): Producto[] {
  if (memoryCart !== null) return memoryCart;
  if (typeof window === "undefined") return EMPTY_CART;
  memoryCart = cargarCarritoDesdeStorage();
  return memoryCart;
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCartSnapshot(): Producto[] {
  return getMemoryCart();
}

export function getCartServerSnapshot(): Producto[] {
  return EMPTY_CART;
}

export function setCartSnapshot(next: Producto[] | ((prev: Producto[]) => Producto[])) {
  const prev = getMemoryCart();
  memoryCart = typeof next === "function" ? next(prev) : next;
  guardarCarritoEnStorage(memoryCart);
  listeners.forEach((listener) => listener());
}

export function clearCartSnapshot() {
  memoryCart = [];
  limpiarCarritoStorage();
  listeners.forEach((listener) => listener());
}
