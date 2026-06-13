export function etiquetaStock(stock: number): string {
  if (stock <= 0) return "Agotado";
  if (stock === 1) return "Última unidad disponible";
  if (stock <= 5) return `Solo ${stock} unidades disponibles`;
  return `${stock} unidades disponibles`;
}

export function maxCantidadCompra(stock: number): number {
  if (stock <= 0) return 0;
  return Math.min(stock, 99);
}

export function stockDisponible(stock: number | undefined | null): number {
  return Math.max(0, stock ?? 0);
}
