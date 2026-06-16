/** Tipos compartidos entre la API REST y el frontend. */

export type CarritoItemInput = {
  id: number;
  cantidad: number;
  /** 30, 50 o 100 — solo perfumes en categoría Decants */
  presentacionMl?: number;
};

export type CarritoItemValidado = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
  disponible: boolean;
  subtotal: number;
  imagen: string;
  volumen: string;
  esDecant?: boolean;
};

export type ValidarCarritoResponse = {
  valido: boolean;
  items: CarritoItemValidado[];
  total: number;
  errores: string[];
};

export type CrearPedidoInput = {
  nombre: string;
  telefono: string;
  email: string;
  ciudad?: string;
  direccion?: string;
  metodoPago?: string;
  referenciaPago?: string;
  notas?: string;
  items: CarritoItemInput[];
  /** Solo validación anti-manipulación; el servidor recalcula siempre. */
  subtotal?: number;
  recargoFinanciacion?: number;
  total?: number;
};

export type NewsletterInput = {
  email: string;
};
