/** Catálogo oficial Essenza — fuente para seed y modo estático. */

export type CategoriaNombre = "Hombre" | "Mujer" | "Unisex" | "Árabes";



export type CatalogoItem = {

  nombre: string;

  marca: string;

  precio: number;

  /** Una o más categorías (ej. ["Hombre", "Árabes"]). */

  categorias: CategoriaNombre[];

  volumenML: number;

  stock: number;

  imagen: string;

  destacado?: boolean;

  esNuevo?: boolean;

};



export const PRODUCTOS_POR_PAGINA = 12;



export const catalogoEssenza: CatalogoItem[] = [

  {

    nombre: "Mandarin Sky",

    marca: "Fragrance World",

    precio: 110000,

    categorias: ["Unisex", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/mandarin-sky.jpg",

    esNuevo: true,

  },

  {

    nombre: "Asad Elixir",

    marca: "Lattafa",

    precio: 120000,

    categorias: ["Hombre", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/asad-elixir.jpg",

    esNuevo: true,

  },

  {

    nombre: "Art Of Universe",

    marca: "Lattafa",

    precio: 140000,

    categorias: ["Unisex", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/art-of-universe.jpg",

  },

  {

    nombre: "Khamrah",

    marca: "Lattafa",

    precio: 120000,

    categorias: ["Hombre", "Unisex", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/khamrah.jpg",

    destacado: true,

  },

  {

    nombre: "Yara",

    marca: "Lattafa",

    precio: 100000,

    categorias: ["Mujer", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/yara.jpg",

    destacado: true,

  },

  {

    nombre: "Creed Aventus",

    marca: "Creed",

    precio: 105000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/creed-aventus.jpg",

    destacado: true,

  },

  {

    nombre: "Good Girl",

    marca: "Carolina Herrera",

    precio: 110000,

    categorias: ["Mujer"],

    volumenML: 80,

    stock: 5,

    imagen: "/imagenes/good-girl.jpg",

  },

  {

    nombre: "Odissey Aqua",

    marca: "Armaf",

    precio: 100000,

    categorias: ["Hombre", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/odissey-aqua.jpg",

  },

  {

    nombre: "Shaheen Gold",

    marca: "Lattafa",

    precio: 130000,

    categorias: ["Unisex", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/shaheen-gold.jpg",

  },

  {

    nombre: "Hawas Ice",

    marca: "Rasasi",

    precio: 110000,

    categorias: ["Hombre", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/hawas-ice.jpg",

  },

  {

    nombre: "Ariana Cloud",

    marca: "Ariana Grande",

    precio: 110000,

    categorias: ["Mujer"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/ariana-cloud.jpg",

  },

  {

    nombre: "Stronger With You",

    marca: "Emporio Armani",

    precio: 110000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/stronger-with-you.jpg",

  },

  {

    nombre: "Born In Roma Intense",

    marca: "Valentino",

    precio: 105000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/born-in-roma-intense.jpg",

  },

  {

    nombre: "Acqua Di Gio Profondo",

    marca: "Giorgio Armani",

    precio: 110000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/acqua-di-gio-profondo.jpg",

  },

  {

    nombre: "Asad Bourbon",

    marca: "Lattafa",

    precio: 120000,

    categorias: ["Hombre", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/asad-bourbon.jpg",

  },

  {

    nombre: "Asad",

    marca: "Lattafa",

    precio: 120000,

    categorias: ["Hombre", "Árabes"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/asad.jpg",

  },

  {

    nombre: "Phantom PR",

    marca: "Paco Rabanne",

    precio: 130000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/phantom-pr.jpg",

  },

  {

    nombre: "Yves Saint Laurent Y",

    marca: "Yves Saint Laurent",

    precio: 130000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/ysl-y.jpg",

  },

  {

    nombre: "La Vie Est Belle",

    marca: "Lancome",

    precio: 100000,

    categorias: ["Mujer"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/la-vie-est-belle.jpg",

  },

  {

    nombre: "Dior Sauvage",

    marca: "Dior",

    precio: 110000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/dior-sauvage.jpg",

    destacado: true,

  },

  {

    nombre: "Le Beau JPG",

    marca: "Jean Paul Gaultier",

    precio: 135000,

    categorias: ["Hombre"],

    volumenML: 125,

    stock: 5,

    imagen: "/imagenes/le-beau-jpg.jpg",

  },

  {

    nombre: "Bleu De Chanel",

    marca: "Chanel",

    precio: 110000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/bleu-de-chanel.jpg",

  },

  {

    nombre: "Chanel Allure Homme",

    marca: "Chanel",

    precio: 110000,

    categorias: ["Hombre"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/chanel-allure-homme.jpg",

  },

  {

    nombre: "Lacoste Essential",

    marca: "Lacoste",

    precio: 120000,

    categorias: ["Hombre"],

    volumenML: 125,

    stock: 5,

    imagen: "/imagenes/lacoste-essential.jpg",

  },

  {

    nombre: "Erba Pura",

    marca: "Xerjoff",

    precio: 140000,

    categorias: ["Unisex"],

    volumenML: 100,

    stock: 5,

    imagen: "/imagenes/erba-pura.jpg",

  },

];



export function slugify(text: string): string {

  return text

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .replace(/[^a-z0-9]+/g, "-")

    .replace(/(^-|-$)/g, "");

}



/** Slug de categoría desde nombre (Árabes → arabes). */

export function slugCategoria(nombre: CategoriaNombre): string {

  return slugify(nombre);

}

