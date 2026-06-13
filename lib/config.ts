/** true solo si en .env pones USE_STATIC_PRODUCTS=true (catálogo en archivo, sin MySQL). */
export function esModoDemoEstatico(): boolean {
  return process.env.USE_STATIC_PRODUCTS === "true";
}
