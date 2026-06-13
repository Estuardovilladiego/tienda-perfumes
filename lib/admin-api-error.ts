export const ADMIN_ERROR_SKU_DUPLICADO =
  "Ese SKU ya está en uso por otro producto. Ingresa un código diferente o deja el campo vacío.";

export function mensajeSkuDuplicado(sku: string, nombreProducto: string) {
  return `El SKU «${sku}» ya lo usa «${nombreProducto}». Cada perfume debe tener un código único.`;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === "string" ? error : "";
}

function isSkuUniqueViolation(message: string, error: unknown): boolean {
  if (message.includes("Producto_sku_key")) return true;
  if (message.includes("Unique constraint failed") && /sku/i.test(message)) return true;

  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaError = error as { code?: string; meta?: { target?: string[] | string } };
    if (prismaError.code === "P2002") {
      const target = prismaError.meta?.target;
      if (Array.isArray(target) && target.includes("sku")) return true;
      if (typeof target === "string" && target.includes("sku")) return true;
    }
  }

  return false;
}

export function adminDbErrorMessage(error: unknown, fallback: string) {
  const message = errorMessage(error);

  if (isSkuUniqueViolation(message, error)) {
    const skuMatch = message.match(/«([^»]+)»/);
    const productoMatch = message.match(/lo usa «([^»]+)»/);
    if (skuMatch && productoMatch) {
      return mensajeSkuDuplicado(skuMatch[1], productoMatch[1]);
    }
    return ADMIN_ERROR_SKU_DUPLICADO;
  }

  if (
    message.includes("ECONNREFUSED") ||
    message.includes("pool timeout") ||
    message.includes("connect ETIMEDOUT") ||
    message.includes("Connection timed out")
  ) {
    return "No hay conexión con la base de datos. Verifica DATABASE_URL (Railway) e inténtalo de nuevo.";
  }

  if (process.env.NODE_ENV !== "production" && message) {
    return message;
  }

  if (message.includes("Invalid `") || message.includes("prisma.")) {
    return fallback;
  }

  return message || fallback;
}
