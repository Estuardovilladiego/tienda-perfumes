import "server-only";

import { revalidatePath } from "next/cache";

/** Invalida páginas del catálogo tras cambios en productos o categorías. */
export function revalidateCatalogo() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/categorias");
  revalidatePath("/producto", "layout");
}
