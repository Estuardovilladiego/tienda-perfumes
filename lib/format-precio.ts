/** Formato COP estable en SSR y cliente (evita hydration mismatch de toLocaleString). */
export function formatPrecioCOP(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
