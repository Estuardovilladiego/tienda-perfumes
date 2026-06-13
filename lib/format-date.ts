/** Formato de fecha estable en SSR y cliente (evita hydration mismatch de toLocaleString). */
export function formatDateTime(value: string | Date) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const hours24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const hours12 = hours24 % 12 || 12;
  const suffix = hours24 >= 12 ? "p. m." : "a. m.";

  return `${day}/${month}/${year}, ${hours12}:${minutes} ${suffix}`;
}
