import type { Producto } from "@/app/types/producto";

export const CART_STORAGE_KEY = "essenza_carrito";

function esProductoValido(item: unknown): item is Producto {
  if (!item || typeof item !== "object") return false;
  const p = item as Record<string, unknown>;
  return (
    typeof p.id === "number" &&
    typeof p.nombre === "string" &&
    typeof p.descripcion === "string" &&
    typeof p.precio === "number" &&
    typeof p.imagen === "string" &&
    typeof p.volumen === "string" &&
    typeof p.cantidad === "number" &&
    p.cantidad > 0 &&
    Array.isArray(p.categorias)
  );
}

export function cargarCarritoDesdeStorage(): Producto[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(esProductoValido);
  } catch {
    return [];
  }
}

export function guardarCarritoEnStorage(carrito: Producto[]): void {
  if (typeof window === "undefined") return;

  try {
    if (carrito.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
  } catch {
    // Cuota excedida o modo privado: ignorar sin romper la UI
  }
}

export function limpiarCarritoStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}
