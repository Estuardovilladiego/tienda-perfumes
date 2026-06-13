import { slugify } from "@/lib/admin-validation";

export const ORDENES_CATALOGO = [
  { value: "nombre", label: "Nombre A–Z" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nuevo", label: "Más recientes" },
] as const;

export type OrdenCatalogo = (typeof ORDENES_CATALOGO)[number]["value"];

const ordenesValidos = new Set<string>(ORDENES_CATALOGO.map((o) => o.value));

export function parseOrdenCatalogo(value?: string | null): OrdenCatalogo {
  const v = value?.trim();
  if (v && ordenesValidos.has(v)) return v as OrdenCatalogo;
  return "nombre";
}

export function parseMarcaSlug(value?: string | null): string {
  return value?.trim().toLowerCase() || "";
}

export function slugMarca(nombre: string): string {
  return slugify(nombre);
}

export type MarcaCatalogo = { slug: string; nombre: string };

export function extraerMarcas(
  productos: { marca?: string | null }[]
): MarcaCatalogo[] {
  const map = new Map<string, string>();
  for (const p of productos) {
    if (!p.marca?.trim()) continue;
    const slug = slugMarca(p.marca);
    if (!map.has(slug)) map.set(slug, p.marca.trim());
  }
  return [...map.entries()]
    .map(([slug, nombre]) => ({ slug, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function filtrarPorMarcaSlug<T extends { marca?: string | null }>(
  lista: T[],
  marcaSlug: string
): T[] {
  if (!marcaSlug) return lista;
  return lista.filter((p) => p.marca && slugMarca(p.marca) === marcaSlug);
}

export function ordenarProductos<
  T extends {
    nombre: string;
    precio: number;
    esNuevo?: boolean;
    destacado?: boolean;
  },
>(lista: T[], orden: OrdenCatalogo): T[] {
  const copia = [...lista];
  switch (orden) {
    case "precio-asc":
      return copia.sort((a, b) => a.precio - b.precio);
    case "precio-desc":
      return copia.sort((a, b) => b.precio - a.precio);
    case "nuevo":
      return copia.sort((a, b) => {
        const nA = a.esNuevo ? 1 : 0;
        const nB = b.esNuevo ? 1 : 0;
        if (nB !== nA) return nB - nA;
        return a.nombre.localeCompare(b.nombre, "es");
      });
    default:
      return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }
}
