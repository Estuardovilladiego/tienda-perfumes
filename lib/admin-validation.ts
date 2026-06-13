export type ProductoAdminInput = {
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
  precioAnterior: number | null;
  sku: string | null;
  volumen: string;
  stock: number;
  imagen: string;
  imagenes: string[];
  destacado: boolean;
  esNuevo: boolean;
  enOferta: boolean;
  familiaOlfativa: string | null;
  notasSalida: string | null;
  notasCorazon: string | null;
  notasFondo: string | null;
  categorias: number[];
  activo: boolean;
};

export type CategoriaAdminInput = {
  nombre: string;
  slug: string;
  imagen: string | null;
  orden: number;
};

export const estadosPedido = [
  "pendiente",
  "confirmado",
  "preparando",
  "enviado",
  "entregado",
  "cancelado",
] as const;

export type EstadoPedidoInput = (typeof estadosPedido)[number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function asBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function validateProductoAdmin(body: Record<string, unknown>) {
  const errors: string[] = [];
  const precio = asNumber(body.precio);
  const precioAnteriorRaw = body.precioAnterior === "" ? null : body.precioAnterior;
  const precioAnterior =
    precioAnteriorRaw === null || precioAnteriorRaw === undefined
      ? null
      : asNumber(precioAnteriorRaw);
  const stock = asNumber(body.stock);
  const categorias = Array.isArray(body.categorias)
    ? body.categorias.map(Number).filter(Number.isFinite)
    : [];
  const imagenes = Array.isArray(body.imagenes)
    ? body.imagenes.map(asString).filter(Boolean)
    : asString(body.imagenes)
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);

  const input: ProductoAdminInput = {
    nombre: asString(body.nombre),
    marca: asString(body.marca),
    descripcion: asString(body.descripcion),
    precio,
    precioAnterior,
    sku: asString(body.sku) || null,
    volumen: asString(body.volumen) || "100 ML",
    stock,
    imagen: asString(body.imagen),
    imagenes,
    destacado: asBoolean(body.destacado),
    esNuevo: asBoolean(body.esNuevo),
    enOferta: asBoolean(body.enOferta),
    familiaOlfativa: asString(body.familiaOlfativa) || null,
    notasSalida: asString(body.notasSalida) || null,
    notasCorazon: asString(body.notasCorazon) || null,
    notasFondo: asString(body.notasFondo) || null,
    categorias,
    activo: body.activo === undefined ? true : asBoolean(body.activo),
  };

  if (!input.nombre) errors.push("El nombre es obligatorio");
  if (!input.marca) errors.push("La marca es obligatoria");
  if (!input.descripcion) errors.push("La descripción es obligatoria");
  if (!Number.isFinite(precio) || precio <= 0) errors.push("El precio debe ser mayor a 0");
  if (precioAnterior !== null && (!Number.isFinite(precioAnterior) || precioAnterior < 0)) {
    errors.push("El precio anterior no es válido");
  }
  if (!Number.isInteger(stock) || stock < 0) errors.push("El stock debe ser un entero positivo");
  if (!input.imagen) errors.push("La imagen principal es obligatoria");
  if (!input.categorias.length) errors.push("Selecciona al menos una categoria");

  return { ok: errors.length === 0, errors, input };
}

export function validateCategoriaAdmin(body: Record<string, unknown>) {
  const nombre = asString(body.nombre);
  const input: CategoriaAdminInput = {
    nombre,
    slug: asString(body.slug) || slugify(nombre),
    imagen: asString(body.imagen) || null,
    orden: Number.isFinite(asNumber(body.orden)) ? asNumber(body.orden) : 0,
  };
  const errors: string[] = [];
  if (!input.nombre) errors.push("El nombre es obligatorio");
  if (!input.slug) errors.push("El slug es obligatorio");
  return { ok: errors.length === 0, errors, input };
}
