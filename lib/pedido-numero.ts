/** Número único de pedido (ESS-YYYYMMDD-XXXXX). */
export function generarNumeroPedido() {
  const fecha = new Date();
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  const sufijo = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ESS-${y}${m}${d}-${sufijo}`;
}
