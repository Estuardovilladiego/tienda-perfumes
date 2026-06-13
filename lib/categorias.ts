/** Imágenes de portada desde public/imagenes (perfumes del catálogo). */
export const CATEGORIAS = [
  {
    nombre: "Hombre",
    slug: "hombre",
    imagen: "/imagenes/bleu-de-chanel.jpg",
  },
  {
    nombre: "Mujer",
    slug: "mujer",
    imagen: "/imagenes/good-girl.jpg",
  },
  {
    nombre: "Unisex",
    slug: "unisex",
    imagen: "/imagenes/erba-pura.jpg",
  },
  {
    nombre: "Árabes",
    slug: "arabes",
    imagen: "/imagenes/khamrah.jpg",
  },
] as const;

export type CategoriaSlug = (typeof CATEGORIAS)[number]["slug"];
export type CategoriaPublica = {
  nombre: string;
  slug: string;
  imagen: string;
  cantidad: number;
};

export function getCategoriaPorSlug(slug: string) {
  return CATEGORIAS.find((c) => c.slug === slug);
}

export function esCategoriaValida(slug: string): slug is CategoriaSlug {
  return CATEGORIAS.some((c) => c.slug === slug);
}
